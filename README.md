# Shoplc - Multi-Store Shopify Manager

Manage multiple Shopify stores from a single repository.

## Structure

- `shared/` - Common theme files (sections, snippets, layouts, blocks, locales)
- `stores/` - Store-specific files (templates, styles, config)
- `scripts/` - Build and deployment scripts
- `build/` - Generated theme files (not committed)

## Setup

1. Install dependencies:
```bash
   npm install
```

2. Build themes:
```bash
   npm run build              # Build all stores
   npm run build:store1       # Build specific store
```

## Store Structure

Each store has:
- `templates/` - Store-specific page templates
- `assets/variables.css` - Store-specific styling
- `config/settings_data.json` - Store-specific settings
