<template>
    <div class="dashboard-page">
        <div class="dashboard-header">
            <h1 class="page-title">Newsroom Daily</h1>
            <p class="page-subtitle">Latest news from the Lovelace Knowledge Graph</p>
        </div>

        <div class="search-section">
            <EntitySearch />
        </div>

        <div class="dashboard-content">
            <div class="main-feed">
                <div class="feed-header">
                    <h2 class="section-title">Latest Stories</h2>
                    <v-btn
                        v-if="!loading"
                        size="small"
                        variant="text"
                        prepend-icon="mdi-refresh"
                        @click="refresh"
                    >
                        Refresh
                    </v-btn>
                </div>

                <div v-if="loading" class="loading-container">
                    <v-progress-circular indeterminate color="primary" size="48" />
                    <p class="loading-text">Loading articles...</p>
                </div>

                <div v-else-if="error" class="error-container">
                    <v-icon icon="mdi-alert-circle" size="48" color="error" />
                    <p class="error-text">Failed to load articles</p>
                    <v-btn variant="text" @click="refresh">Try Again</v-btn>
                </div>

                <div v-else-if="articles.length === 0" class="empty-container">
                    <v-icon icon="mdi-newspaper-variant-outline" size="48" color="grey" />
                    <p class="empty-text">No articles found</p>
                </div>

                <div v-else class="articles-grid">
                    <ArticleCard
                        v-for="article in articles"
                        :key="article.neid"
                        :article="article"
                    />
                </div>
            </div>

            <aside class="sidebar">
                <TrendingEntities />
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
    const { articles, loading, error, loadRecentArticles } = useArticles();

    onMounted(async () => {
        await refresh();
    });

    async function refresh() {
        await loadRecentArticles(20);
    }
</script>

<style scoped>
    .dashboard-page {
        height: 100%;
        overflow-y: auto;
        padding: 24px;
    }

    .dashboard-header {
        margin-bottom: 24px;
    }

    .page-title {
        font-family: var(--font-headline);
        font-weight: 400;
        font-size: 2rem;
        letter-spacing: 0.02em;
        margin-bottom: 8px;
    }

    .page-subtitle {
        color: var(--lv-silver);
        font-size: 1rem;
    }

    .search-section {
        margin-bottom: 32px;
        max-width: 600px;
    }

    .dashboard-content {
        display: grid;
        grid-template-columns: 1fr 320px;
        gap: 24px;
    }

    @media (max-width: 960px) {
        .dashboard-content {
            grid-template-columns: 1fr;
        }

        .sidebar {
            order: -1;
        }
    }

    .main-feed {
        min-width: 0;
    }

    .feed-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }

    .section-title {
        font-family: var(--font-headline);
        font-weight: 400;
        font-size: 1.25rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--lv-silver);
    }

    .articles-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .loading-container,
    .error-container,
    .empty-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 64px 24px;
        gap: 16px;
    }

    .loading-text,
    .error-text,
    .empty-text {
        color: var(--lv-silver);
        font-size: 1rem;
    }

    .sidebar {
        position: sticky;
        top: 24px;
        height: fit-content;
    }
</style>
