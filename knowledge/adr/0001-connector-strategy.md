---
id: adr-0001
status: proposed
owner: georesponde-team
last_review: 2026-06-25
tags: [adr, architecture, connectors, automation]
---

# ADR 0001: Data Connector Strategy

## Context

GeoResponde Venezuela acts as a centralized information hub. The platform itself does not store raw earthquake or humanitarian data; instead, it indexes metadata via a structured YAML catalog. 

To maintain the trustworthiness of the platform, the data must remain up-to-date (e.g., polling USGS for new seismic events, checking GDACS for new alerts). We need a strategy for implementing "connectors" that fetch external data, format it into our schema, and update the catalog or generate static geospatial files (like GeoJSON).

## Decision

We will implement a **Serverless, Git-Driven Connector Architecture** based on GitHub Actions.

Instead of building a traditional backend API with worker processes and a database, we will rely on:
1. **TypeScript Connector Scripts**: Lightweight scripts living in `scripts/connectors/` that pull from specific APIs (USGS, Copernicus, GDACS).
2. **GitHub Actions Schedule (Cron)**: Automated workflows that run these connector scripts at defined intervals (e.g., every hour).
3. **Git as the Database**: When a connector detects new information, it modifies the relevant YAML catalog or writes a new GeoJSON to `public/data/`. The GitHub Action then commits these changes back to the repository.
4. **Triggered Builds**: The new commit automatically triggers the `catalog:build` workflow, updating the static API and ultimately the frontend.

## Consequences

### Positive
- **Zero Infrastructure Cost**: No need to host or maintain a database, message queue, or API servers.
- **Extreme Traceability**: Every automated update is a Git commit. We can track exactly when a dataset was updated and roll back if a connector misbehaves.
- **High Availability**: The frontend only consumes static files, meaning it can scale infinitely via CDN regardless of how many connectors are running.

### Negative
- **Latency**: Not suitable for sub-minute real-time data due to Git commit and CI/CD overhead. However, our minimum resolution for "Real-time" in this context is usually 5-15 minutes, which GitHub Actions can handle.
- **Git Bloat**: Frequent commits could bloat the repository history over time. We may need to squash commits periodically or handle raw data downloads outside of Git (e.g., uploading directly to an S3 bucket instead of committing to the repo if the files are large).

## Status
Proposed
