import { useElementalClient } from '@yottagraph-app/elemental-api/client';
import type { ArticleData } from '~/components/ArticleCard.vue';

export function useEntityNews(entityNeid: Ref<string | undefined>) {
    const client = useElementalClient();
    const { loadSchema, getPid } = useElementalSchema();

    const entityName = ref<string | null>(null);
    const entityFlavor = ref<string | null>(null);
    const articles = ref<ArticleData[]>([]);
    const sentimentData = ref<Array<{ date: string; sentiment: number }>>([]);
    const loading = ref(false);
    const error = ref<Error | null>(null);

    async function loadEntityInfo() {
        if (!entityNeid.value) return;

        try {
            const nameRes = await $fetch<{ name: string }>(
                `/api/qs/entities/${entityNeid.value}/name`
            );
            entityName.value = nameRes.name;

            const detailsRes = await $fetch<{
                report: { name: string; type: string; aliases: string[] };
            }>(`/api/qs/entities/${entityNeid.value}`);
            entityFlavor.value = detailsRes.report.type;
        } catch (err) {
            console.error('Failed to load entity info:', err);
        }
    }

    async function loadArticlesForEntity() {
        if (!entityNeid.value) return;

        loading.value = true;
        error.value = null;

        try {
            await loadSchema();
            await loadEntityInfo();

            const appearsInPid = getPid('appears_in');
            const titlePid = getPid('title');
            const sentimentPid = getPid('sentiment');

            if (!appearsInPid || !titlePid) {
                throw new Error('Required properties not found in schema');
            }

            const propsRes = await client.getPropertyValues({
                eids: JSON.stringify([entityNeid.value]),
                pids: JSON.stringify([appearsInPid]),
                include_attributes: 'true',
            } as any);

            const articleNeids: string[] = [];
            for (const val of propsRes.values ?? []) {
                if (val.pid === appearsInPid) {
                    const articleNeid = String(val.value).padStart(20, '0');
                    articleNeids.push(articleNeid);
                }
            }

            if (articleNeids.length === 0) {
                articles.value = [];
                return [];
            }

            const articlePropsRes = await client.getPropertyValues({
                eids: JSON.stringify(articleNeids),
                pids: JSON.stringify([titlePid, sentimentPid].filter(Boolean)),
            });

            const articleMap = new Map<
                string,
                { title: string | null; sentiment: number | null }
            >();

            for (const val of articlePropsRes.values ?? []) {
                if (!articleMap.has(val.eid)) {
                    articleMap.set(val.eid, { title: null, sentiment: null });
                }

                const article = articleMap.get(val.eid)!;

                if (val.pid === titlePid) {
                    article.title = String(val.value);
                } else if (val.pid === sentimentPid) {
                    article.sentiment = Number(val.value);
                }
            }

            const result: ArticleData[] = [];
            for (const [neid, data] of articleMap) {
                result.push({
                    neid,
                    title: data.title,
                    sentiment: data.sentiment,
                    source: null,
                    publishedAt: null,
                    summary: null,
                });
            }

            articles.value = result;
            return result;
        } catch (err) {
            console.error('Failed to load entity articles:', err);
            error.value = err as Error;
            return [];
        } finally {
            loading.value = false;
        }
    }

    watch(entityNeid, () => {
        if (entityNeid.value) {
            loadArticlesForEntity();
        }
    });

    return {
        entityName: readonly(entityName),
        entityFlavor: readonly(entityFlavor),
        articles: readonly(articles),
        sentimentData: readonly(sentimentData),
        loading: readonly(loading),
        error: readonly(error),
        loadArticlesForEntity,
    };
}
