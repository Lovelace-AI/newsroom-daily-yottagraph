import { useElementalClient } from '@yottagraph-app/elemental-api/client';
import type { ArticleData } from '~/components/ArticleCard.vue';

export function useArticles() {
    const client = useElementalClient();
    const { loadSchema, getPid } = useElementalSchema();

    const articles = ref<ArticleData[]>([]);
    const loading = ref(false);
    const error = ref<Error | null>(null);

    async function loadRecentArticles(limit: number = 20) {
        loading.value = true;
        error.value = null;

        try {
            await loadSchema();

            const articleFid = getPid('article');
            if (!articleFid) {
                throw new Error('Article flavor not found in schema');
            }

            const expression = JSON.stringify({
                type: 'comparison',
                comparison: {
                    operator: 'exists',
                    pid: getPid('title'),
                },
            });

            const res = await client.findEntities({
                expression,
                limit,
            });

            const eids = (res as any).eids ?? [];

            if (eids.length === 0) {
                articles.value = [];
                return [];
            }

            const titlePid = getPid('title');
            const sentimentPid = getPid('sentiment');

            if (!titlePid) {
                throw new Error('Required properties not found in schema');
            }

            const pids = [titlePid];
            if (sentimentPid) pids.push(sentimentPid);

            const propsRes = await client.getPropertyValues({
                eids: JSON.stringify(eids),
                pids: JSON.stringify(pids),
            });

            const articleMap = new Map<
                string,
                { title: string | null; sentiment: number | null }
            >();

            for (const val of propsRes.values ?? []) {
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
            console.error('Failed to load articles:', err);
            error.value = err as Error;
            return [];
        } finally {
            loading.value = false;
        }
    }

    async function loadArticleById(neid: string) {
        loading.value = true;
        error.value = null;

        try {
            await loadSchema();

            const titlePid = getPid('title');
            const sentimentPid = getPid('sentiment');

            if (!titlePid) {
                throw new Error('Required properties not found in schema');
            }

            const pids = [titlePid];
            if (sentimentPid) pids.push(sentimentPid);

            const propsRes = await client.getPropertyValues({
                eids: JSON.stringify([neid]),
                pids: JSON.stringify(pids),
            });

            const article: ArticleData = {
                neid,
                title: null,
                sentiment: null,
                source: null,
                publishedAt: null,
                summary: null,
            };

            for (const val of propsRes.values ?? []) {
                if (val.pid === titlePid) {
                    article.title = String(val.value);
                } else if (val.pid === sentimentPid) {
                    article.sentiment = Number(val.value);
                }
            }

            return article;
        } catch (err) {
            console.error('Failed to load article:', err);
            error.value = err as Error;
            return null;
        } finally {
            loading.value = false;
        }
    }

    return {
        articles: readonly(articles),
        loading: readonly(loading),
        error: readonly(error),
        loadRecentArticles,
        loadArticleById,
    };
}
