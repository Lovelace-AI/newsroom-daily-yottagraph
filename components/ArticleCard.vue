<template>
    <v-card :to="`/article/${article.neid}`" class="article-card" variant="flat" hover>
        <v-card-text>
            <div class="article-header">
                <h3 class="article-title">{{ article.title || 'Untitled Article' }}</h3>
                <SentimentBadge :sentiment="article.sentiment" />
            </div>

            <div class="article-meta">
                <span v-if="article.source" class="article-source">{{ article.source }}</span>
                <span v-if="article.publishedAt" class="article-date">{{
                    formatDate(article.publishedAt)
                }}</span>
            </div>

            <p v-if="article.summary" class="article-summary">{{ article.summary }}</p>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
    export interface ArticleData {
        neid: string;
        title: string | null;
        sentiment: number | null;
        source: string | null;
        publishedAt: string | null;
        summary: string | null;
    }

    defineProps<{
        article: ArticleData;
    }>();

    function formatDate(dateStr: string | null): string {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return date.toLocaleDateString();
        } catch {
            return dateStr;
        }
    }
</script>

<style scoped>
    .article-card {
        background: var(--lv-surface);
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition: all 0.2s ease;
    }

    .article-card:hover {
        border-color: rgba(255, 255, 255, 0.1);
    }

    .article-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 8px;
    }

    .article-title {
        font-size: 1rem;
        font-weight: 500;
        line-height: 1.4;
        margin: 0;
        flex: 1;
    }

    .article-meta {
        display: flex;
        gap: 12px;
        font-size: 0.875rem;
        color: var(--lv-silver);
        margin-bottom: 8px;
    }

    .article-source {
        font-weight: 500;
    }

    .article-date::before {
        content: '•';
        margin-right: 8px;
    }

    .article-summary {
        font-size: 0.875rem;
        line-height: 1.5;
        color: var(--lv-silver);
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
