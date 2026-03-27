<template>
    <div class="article-page">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" class="back-btn" @click="router.back()">
            Back
        </v-btn>

        <div v-if="loading" class="loading-container">
            <v-progress-circular indeterminate color="primary" size="48" />
            <p class="loading-text">Loading article...</p>
        </div>

        <div v-else-if="error || !article" class="error-container">
            <v-icon icon="mdi-alert-circle" size="48" color="error" />
            <p class="error-text">Article not found</p>
            <v-btn variant="text" to="/">Return to Home</v-btn>
        </div>

        <div v-else class="article-content">
            <div class="article-header">
                <h1 class="article-title">{{ article.title || 'Untitled Article' }}</h1>
                <SentimentBadge :sentiment="article.sentiment" />
            </div>

            <div class="article-meta">
                <span v-if="article.source" class="meta-item">
                    <v-icon icon="mdi-newspaper-variant" size="small" />
                    {{ article.source }}
                </span>
                <span v-if="article.publishedAt" class="meta-item">
                    <v-icon icon="mdi-clock-outline" size="small" />
                    {{ formatDate(article.publishedAt) }}
                </span>
            </div>

            <v-divider class="my-6" />

            <div v-if="article.summary" class="article-summary">
                <h2 class="section-title">Summary</h2>
                <p class="summary-text">{{ article.summary }}</p>
            </div>

            <div v-else class="no-summary">
                <p class="empty-text">No summary available for this article.</p>
            </div>

            <v-divider class="my-6" />

            <div class="article-actions">
                <v-btn
                    v-if="article.source"
                    variant="outlined"
                    prepend-icon="mdi-open-in-new"
                    target="_blank"
                    :href="`https://${article.source}`"
                >
                    View Original Source
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { ArticleData } from '~/components/ArticleCard.vue';

    const route = useRoute();
    const router = useRouter();

    const articleId = computed(() => route.params.id as string);

    const article = ref<ArticleData | null>(null);
    const loading = ref(true);
    const error = ref(false);

    onMounted(async () => {
        await loadArticle();
    });

    async function loadArticle() {
        loading.value = true;
        error.value = false;

        try {
            const { loadArticleById } = useArticles();
            const result = await loadArticleById(articleId.value);

            if (!result) {
                error.value = true;
            } else {
                article.value = result;
            }
        } catch (err) {
            console.error('Failed to load article:', err);
            error.value = true;
        } finally {
            loading.value = false;
        }
    }

    function formatDate(dateStr: string | null): string {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateStr;
        }
    }
</script>

<style scoped>
    .article-page {
        height: 100%;
        overflow-y: auto;
        padding: 24px;
        max-width: 900px;
        margin: 0 auto;
    }

    .back-btn {
        margin-bottom: 24px;
    }

    .loading-container,
    .error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 64px 24px;
        gap: 16px;
    }

    .loading-text,
    .error-text {
        color: var(--lv-silver);
        font-size: 1rem;
    }

    .article-content {
        background: var(--lv-surface);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 32px;
    }

    .article-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 24px;
        margin-bottom: 16px;
    }

    .article-title {
        font-size: 1.75rem;
        font-weight: 600;
        line-height: 1.3;
        margin: 0;
        flex: 1;
    }

    .article-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        color: var(--lv-silver);
        font-size: 0.875rem;
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .section-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 12px;
        color: var(--lv-silver);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .summary-text {
        font-size: 1rem;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.9);
    }

    .no-summary {
        padding: 32px 0;
    }

    .empty-text {
        color: var(--lv-silver);
        text-align: center;
    }

    .article-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }
</style>
