<template>
    <v-chip
        :color="color"
        :variant="variant"
        size="small"
        :prepend-icon="icon"
        class="sentiment-badge"
    >
        {{ label }}
    </v-chip>
</template>

<script setup lang="ts">
    const props = defineProps<{
        sentiment: number | null | undefined;
        size?: 'x-small' | 'small' | 'default' | 'large';
    }>();

    const color = computed(() => {
        if (props.sentiment === null || props.sentiment === undefined) {
            return 'grey';
        }
        if (props.sentiment >= 0.3) return 'success';
        if (props.sentiment <= -0.3) return 'error';
        return 'grey';
    });

    const variant = computed(() => {
        return 'tonal';
    });

    const icon = computed(() => {
        if (props.sentiment === null || props.sentiment === undefined) {
            return 'mdi-minus';
        }
        if (props.sentiment >= 0.3) return 'mdi-arrow-up';
        if (props.sentiment <= -0.3) return 'mdi-arrow-down';
        return 'mdi-minus';
    });

    const label = computed(() => {
        if (props.sentiment === null || props.sentiment === undefined) {
            return 'Neutral';
        }
        if (props.sentiment >= 0.5) return 'Very Positive';
        if (props.sentiment >= 0.3) return 'Positive';
        if (props.sentiment <= -0.5) return 'Very Negative';
        if (props.sentiment <= -0.3) return 'Negative';
        return 'Neutral';
    });
</script>

<style scoped>
    .sentiment-badge {
        font-weight: 500;
    }
</style>
