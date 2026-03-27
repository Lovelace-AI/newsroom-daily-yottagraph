<template>
    <div class="entity-page">
        <v-btn variant="text" prepend-icon="mdi-arrow-left" class="back-btn" @click="router.back()">
            Back
        </v-btn>

        <div v-if="loading && !entityName" class="loading-container">
            <v-progress-circular indeterminate color="primary" size="48" />
            <p class="loading-text">Loading entity...</p>
        </div>

        <div v-else-if="error" class="error-container">
            <v-icon icon="mdi-alert-circle" size="48" color="error" />
            <p class="error-text">Entity not found</p>
            <v-btn variant="text" to="/">Return to Home</v-btn>
        </div>

        <div v-else class="entity-content">
            <div class="entity-header">
                <div class="entity-info">
                    <h1 class="entity-name">{{ entityName || 'Unknown Entity' }}</h1>
                    <v-chip v-if="entityFlavor" size="small" variant="outlined" class="entity-type">
                        {{ entityFlavor }}
                    </v-chip>
                </div>
            </div>

            <div class="content-grid">
                <div class="main-content">
                    <div class="news-section">
                        <div class="section-header">
                            <h2 class="section-title">News Mentions</h2>
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
                            <v-progress-circular indeterminate color="primary" size="32" />
                            <p class="loading-text">Loading articles...</p>
                        </div>

                        <div v-else-if="articles.length === 0" class="empty-container">
                            <v-icon icon="mdi-newspaper-variant-outline" size="48" color="grey" />
                            <p class="empty-text">No articles found for this entity</p>
                        </div>

                        <div v-else class="articles-grid">
                            <ArticleCard
                                v-for="article in articles"
                                :key="article.neid"
                                :article="article"
                            />
                        </div>
                    </div>
                </div>

                <aside class="sidebar">
                    <SentimentChart :data-points="sentimentData" :loading="loading" />
                </aside>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const route = useRoute();
    const router = useRouter();

    const entityId = computed(() => route.params.id as string);
    const entityIdRef = ref(entityId.value);

    watch(entityId, (newId) => {
        entityIdRef.value = newId;
    });

    const {
        entityName,
        entityFlavor,
        articles,
        sentimentData,
        loading,
        error,
        loadArticlesForEntity,
    } = useEntityNews(entityIdRef);

    onMounted(async () => {
        await refresh();
    });

    async function refresh() {
        await loadArticlesForEntity();
    }
</script>

<style scoped>
    .entity-page {
        height: 100%;
        overflow-y: auto;
        padding: 24px;
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

    .entity-content {
        max-width: 1400px;
        margin: 0 auto;
    }

    .entity-header {
        margin-bottom: 32px;
        padding: 24px;
        background: var(--lv-surface);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
    }

    .entity-info {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
    }

    .entity-name {
        font-size: 2rem;
        font-weight: 600;
        margin: 0;
    }

    .entity-type {
        text-transform: capitalize;
    }

    .content-grid {
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 24px;
    }

    @media (max-width: 1024px) {
        .content-grid {
            grid-template-columns: 1fr;
        }

        .sidebar {
            order: -1;
        }
    }

    .main-content {
        min-width: 0;
    }

    .section-header {
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

    .empty-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 64px 24px;
        gap: 16px;
    }

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
