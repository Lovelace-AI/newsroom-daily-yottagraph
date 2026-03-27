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

Project just created. Run `/build_my_app` in Cursor to start building.

## Modules

*None yet — the agent will populate this as features are built.*
