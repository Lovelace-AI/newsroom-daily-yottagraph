<template>
    <v-autocomplete
        v-model="selectedEntity"
        v-model:search="searchQuery"
        :items="searchResults"
        :loading="loading"
        item-title="name"
        item-value="neid"
        label="Search entities..."
        variant="outlined"
        density="comfortable"
        prepend-inner-icon="mdi-magnify"
        clearable
        hide-no-data
        @update:model-value="onEntitySelected"
    >
        <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps">
                <template #prepend>
                    <v-icon :icon="getFlavorIcon(item.raw.flavor)" size="small" />
                </template>
                <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.raw.flavor }}</v-list-item-subtitle>
            </v-list-item>
        </template>
    </v-autocomplete>
</template>

<script setup lang="ts">
    import { useElementalClient } from '@yottagraph-app/elemental-api/client';

    const emit = defineEmits<{
        select: [neid: string, name: string];
    }>();

    const client = useElementalClient();
    const router = useRouter();

    const selectedEntity = ref<string | null>(null);
    const searchQuery = ref('');
    const searchResults = ref<Array<{ neid: string; name: string; flavor: string }>>([]);
    const loading = ref(false);

    let searchTimeout: ReturnType<typeof setTimeout> | null = null;

    watch(searchQuery, (newQuery) => {
        if (!newQuery || newQuery.length < 2) {
            searchResults.value = [];
            return;
        }

        if (searchTimeout) clearTimeout(searchTimeout);

        searchTimeout = setTimeout(async () => {
            await performSearch(newQuery);
        }, 300);
    });

    async function performSearch(query: string) {
        loading.value = true;
        try {
            const response = await $fetch<{
                results: Array<{
                    queryId: number;
                    matches: Array<{
                        neid: string;
                        name: string;
                        flavor: string;
                        score: number;
                    }>;
                }>;
            }>('/api/qs/entities/search', {
                method: 'POST',
                body: {
                    queries: [{ queryId: 1, query }],
                    maxResults: 10,
                },
            });

            if (response.results?.[0]?.matches) {
                searchResults.value = response.results[0].matches.map((m) => ({
                    neid: m.neid,
                    name: m.name,
                    flavor: m.flavor,
                }));
            }
        } catch (error) {
            console.error('Entity search failed:', error);
            searchResults.value = [];
        } finally {
            loading.value = false;
        }
    }

    function onEntitySelected(neid: string | null) {
        if (!neid) return;

        const entity = searchResults.value.find((e) => e.neid === neid);
        if (!entity) return;

        emit('select', neid, entity.name);

        router.push(`/entity/${neid}`);

        nextTick(() => {
            selectedEntity.value = null;
            searchQuery.value = '';
        });
    }

    function getFlavorIcon(flavor: string): string {
        if (flavor === 'organization') return 'mdi-domain';
        if (flavor === 'person') return 'mdi-account';
        if (flavor === 'location') return 'mdi-map-marker';
        if (flavor === 'financial_instrument') return 'mdi-chart-line';
        return 'mdi-file-document';
    }
</script>
