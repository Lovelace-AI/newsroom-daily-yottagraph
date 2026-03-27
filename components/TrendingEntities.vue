<template>
    <v-card class="trending-entities" variant="flat">
        <v-card-title class="card-title">Trending Entities</v-card-title>
        <v-card-text v-if="loading" class="text-center">
            <v-progress-circular indeterminate color="primary" size="32" />
        </v-card-text>
        <v-card-text v-else-if="error" class="error-text">
            Failed to load trending entities
        </v-card-text>
        <v-list v-else density="compact" class="entity-list">
            <v-list-item
                v-for="entity in entities"
                :key="entity.neid"
                :to="`/entity/${entity.neid}`"
                class="entity-item"
            >
                <template #prepend>
                    <v-icon :icon="getFlavorIcon(entity.flavor)" size="small" />
                </template>
                <v-list-item-title>{{ entity.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ entity.count }} mentions</v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script setup lang="ts">
    interface TrendingEntity {
        neid: string;
        name: string;
        flavor: string;
        count: number;
    }

    const entities = ref<TrendingEntity[]>([]);
    const loading = ref(true);
    const error = ref(false);

    onMounted(async () => {
        await loadTrendingEntities();
    });

    async function loadTrendingEntities() {
        loading.value = true;
        error.value = false;
        try {
            entities.value = [];
        } catch (err) {
            console.error('Failed to load trending entities:', err);
            error.value = true;
        } finally {
            loading.value = false;
        }
    }

    function getFlavorIcon(flavor: string): string {
        if (flavor === 'organization') return 'mdi-domain';
        if (flavor === 'person') return 'mdi-account';
        if (flavor === 'location') return 'mdi-map-marker';
        if (flavor === 'financial_instrument') return 'mdi-chart-line';
        return 'mdi-file-document';
    }
</script>

<style scoped>
    .trending-entities {
        background: var(--lv-surface);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .card-title {
        font-size: 0.875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--lv-silver);
        padding: 16px;
    }

    .entity-list {
        background: transparent;
    }

    .entity-item {
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);
    }

    .entity-item:last-child {
        border-bottom: none;
    }

    .error-text {
        color: var(--lv-silver);
        text-align: center;
        font-size: 0.875rem;
    }
</style>
