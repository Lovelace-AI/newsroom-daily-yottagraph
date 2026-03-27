<template>
    <v-card class="sentiment-chart" variant="flat">
        <v-card-title class="card-title">Sentiment Trend</v-card-title>
        <v-card-text v-if="loading" class="text-center">
            <v-progress-circular indeterminate color="primary" size="32" />
        </v-card-text>
        <v-card-text v-else-if="error" class="error-text">
            Failed to load sentiment data
        </v-card-text>
        <v-card-text v-else-if="!dataPoints || dataPoints.length === 0" class="empty-text">
            No sentiment data available
        </v-card-text>
        <v-card-text v-else class="chart-container">
            <svg :width="width" :height="height" class="chart-svg">
                <polyline :points="linePoints" class="sentiment-line" />
                <line
                    :x1="padding"
                    :y1="centerY"
                    :x2="width - padding"
                    :y2="centerY"
                    class="zero-line"
                />
                <g v-for="(point, i) in points" :key="i">
                    <circle :cx="point.x" :cy="point.y" r="3" class="data-point" />
                </g>
            </svg>
            <div class="chart-labels">
                <span class="label-left">{{ formatDate(dataPoints[0]?.date) }}</span>
                <span class="label-right">{{
                    formatDate(dataPoints[dataPoints.length - 1]?.date)
                }}</span>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
    interface SentimentDataPoint {
        date: string;
        sentiment: number;
    }

    const props = defineProps<{
        dataPoints: SentimentDataPoint[];
        loading?: boolean;
        error?: boolean;
    }>();

    const width = 400;
    const height = 200;
    const padding = 40;

    const centerY = computed(() => height / 2);

    const points = computed(() => {
        if (!props.dataPoints || props.dataPoints.length === 0) return [];

        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        return props.dataPoints.map((point, i) => {
            const x = padding + (i / (props.dataPoints.length - 1)) * chartWidth;
            const y = centerY.value - (point.sentiment * chartHeight) / 2;
            return { x, y };
        });
    });

    const linePoints = computed(() => {
        return points.value.map((p) => `${p.x},${p.y}`).join(' ');
    });

    function formatDate(dateStr: string | undefined): string {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateStr;
        }
    }
</script>

<style scoped>
    .sentiment-chart {
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

    .chart-container {
        position: relative;
    }

    .chart-svg {
        display: block;
        width: 100%;
        height: auto;
    }

    .sentiment-line {
        fill: none;
        stroke: var(--lv-green);
        stroke-width: 2;
    }

    .zero-line {
        stroke: rgba(255, 255, 255, 0.1);
        stroke-width: 1;
        stroke-dasharray: 4;
    }

    .data-point {
        fill: var(--lv-green);
    }

    .chart-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 0.75rem;
        color: var(--lv-silver);
    }

    .error-text,
    .empty-text {
        color: var(--lv-silver);
        text-align: center;
        font-size: 0.875rem;
    }
</style>
