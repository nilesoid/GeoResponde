# Catalog Engine

The GeoResponde Catalog Engine is responsible for loading, validating, and indexing the structured YAML data into static JSON files for the frontend applications.

## Catalog Lifecycle

1. **YAML Loading:** The engine parses `datasets.yaml`, `layers.yaml`, `organizations.yaml`, and `sources.yaml`.
2. **Schema Validation:** Each entity is validated against its corresponding JSON Schema (e.g., `datasets.schema.json`).
3. **Relational Validation:** The engine ensures all references are valid (no broken links) and checks for duplicate IDs across the entire catalog.
4. **Search Indexing:** A flat `search-index.json` is generated for quick frontend queries.
5. **Distribution Output:** The verified, indexed JSON files are written to `/public/catalog/` where they can be served as a static API.

## Validation Process

- **Duplicate IDs:** If two entities share the same ID (e.g., a Source and an Organization), the build will fail.
- **Missing References:**
  - `sources.yaml` must reference a valid `organizationId`.
  - `datasets.yaml` must reference a valid `sourceId`.
  - `layers.yaml` must reference valid `datasetIds`.
- **Invalid Schemas:** Enforced by strict `ajv` checking against the draft-07 schemas.

## Adding Data

### Adding Organizations
Open `data/catalog/organizations.yaml` and add:
```yaml
- id: org-red-cross
  name: Red Cross
  type: NGO
```

### Adding Sources
Open `data/catalog/sources.yaml` and add:
```yaml
- id: src-red-cross-data
  name: Relief Data
  url: https://example.com/data
  organizationId: org-red-cross
```

### Adding Datasets
Open `data/catalog/datasets.yaml` and add:
```yaml
- id: ds-relief-centers
  title: Relief Centers 2026
  sourceId: src-red-cross-data
```

### Adding Layers
Open `data/catalog/layers.yaml` and add:
```yaml
- id: layer-relief
  name: Relief Centers Map Layer
  datasetIds: 
    - ds-relief-centers
```

After modifying data, run `pnpm catalog:build` at the root of the project to validate and generate the new JSON files.
