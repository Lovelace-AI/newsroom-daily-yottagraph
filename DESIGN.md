# Newsroom Daily

## Vision

# Newsroom Daily

A clean, modern news dashboard that surfaces the latest news articles from the Lovelace Knowledge Graph.

## Core Features

### News Feed

- Display a paginated feed of recent news articles, sorted by publication date (newest first)
- Each article card shows: headline, source, publication date, summary snippet, and sentiment indicator
- Support filtering by entity (company, person, topic) and by date range
- Clicking an article opens a detail view with the full summary, related entities, and a link to the original source

### Entity Context

- Allow users to search for an entity (e.g. a company like "Apple" or a person like "Elon Musk") and see all recent news mentioning that entity
- Show entity metadata (type, description) alongside the news feed
- Display sentiment trends for the entity over time using a simple line chart

### Dashboard Home

- A landing page with top trending stories across all entities
- A sidebar or section showing most-mentioned entities in recent news
- Quick search bar to jump to entity-specific news

## Data Source

All data comes from the Elemental API (Lovelace Knowledge Graph) via `useElementalClient()`. Use the discovery-first approach: call `getSchema()` to discover available entity types, then fetch news articles, entities, and sentiment data.

## Design Notes

- Use Vuetify cards and lists for the feed layout
- Keep the UI minimal and readable — prioritize scannability
- Use color-coded sentiment badges (green for positive, red for negative, gray for neutral)
- Responsive layout that works on desktop and mobile

## Status

**Implementation Complete** — Core features built and ready for testing.

## Modules

### Pages

- **`pages/index.vue`** — Dashboard home with news feed, entity search, and trending entities sidebar
- **`pages/article/[id].vue`** — Article detail view with summary, metadata, and sentiment indicator
- **`pages/entity/[id].vue`** — Entity-specific news feed with sentiment chart and article list

### Components

- **`ArticleCard.vue`** — Reusable card for displaying news articles with headline, source, date, summary snippet, and sentiment badge
- **`SentimentBadge.vue`** — Color-coded sentiment indicator (green for positive, red for negative, gray for neutral)
- **`EntitySearch.vue`** — Autocomplete search bar for finding entities by name
- **`SentimentChart.vue`** — SVG-based line chart showing sentiment trends over time
- **`TrendingEntities.vue`** — List of most-mentioned entities (placeholder for future implementation)

### Composables

- **`useElementalSchema.ts`** — Schema discovery and caching for PID/FID lookups
- **`useArticles.ts`** — Fetching and managing article data from the Elemental API
- **`useEntityNews.ts`** — Loading entity-specific news and sentiment data

### Server Routes

- **`server/api/qs/entities/search.post.ts`** — Proxy for entity search via Query Server
- **`server/api/qs/entities/[neid]/index.get.ts`** — Proxy for entity details
- **`server/api/qs/entities/[neid]/name.get.ts`** — Proxy for entity name lookup

## Next Steps

- Add date range filtering for news feeds
- Implement trending entities calculation based on article mentions
- Add pagination for article lists
- Enhance article detail page with related entities display
- Add loading states and error handling improvements
