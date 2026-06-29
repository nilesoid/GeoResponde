# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0-alpha] - 2026-06-29

### Added
- **Situation Module (Beta)**: Fully functional geospatial mapping interface combining Scientific Intelligence (earthquakes, faults, satellite imagery).
- **Find Module (Experimental)**: Federated search capability integrated with the first live humanitarian provider (`Venezuela Te Busca`).
- **Provider Gateway Architecture**: Robust plugin system for connecting external real-world humanitarian databases via independent adapters.
- **Remix Single Fetch Transport**: Stable deserialization pipeline for Remix-based providers.
- **Internationalization (i18n)**: English and Spanish localization support out of the box.

### Changed
- Refactored frontend layer structure to distinctly separate Scientific vs Humanitarian/Logistics categories.
- Migrated away from regex parsing to structural object tree traversal for provider integrations.
- Overhauled documentation to present GeoResponde as a Geospatial Situation Room rather than just a GIS viewer.

### Removed
- Removed internal mock providers and sandbox testing scripts from the active codebase.
