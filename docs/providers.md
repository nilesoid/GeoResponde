# Provider Integration Guide

The **Provider Gateway** is the core architecture in GeoResponde responsible for federating requests to disparate humanitarian databases and APIs. 

## Supported Transports

GeoResponde is designed to interface with systems as they exist in the wild. While a REST API is preferred, the framework supports a variety of fallback transports to integrate with real-world providers.

Currently Supported Transports:
- `REST` (JSON Endpoints)
- `Remix Single Fetch` (TurboStream Deserialization)
- `ArcGIS Feature Services`
- `Supabase PostgREST`

## Provider Lifecycle and Integration Workflow

The official process for adding a new provider follows a strict pipeline to ensure stability and reusability:

1. **Investigation**: Analyze the provider's network traffic, determine available endpoints, and select the most stable integration method (avoiding HTML scraping if possible).
2. **Transport Selection**: Pick the appropriate transport client from `backend/src/transports/` (or build a new generic one).
3. **Parser Implementation**: Create a `parser.ts` to structurally traverse the payload and extract relevant fields.
4. **Normalization**: Map extracted fields to the strictly typed `NormalizedSearchResult` interface.
5. **Validation**: Test parsing with saved offline payloads via Vitest.
6. **Registration**: Export the completed adapter class and register it within `ProviderGateway.ts` and `public/catalog/providers.json`.
7. **Testing**: Use the developer diagnostic endpoint (`/api/dev/inspect/:id`) to verify live execution.

## Current Providers

| Provider | Status | Transport |
|---|---|---|
| Venezuela Te Busca | Experimental | Remix Single Fetch |
