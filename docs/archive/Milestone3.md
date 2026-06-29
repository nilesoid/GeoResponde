# GeoResponde Venezuela

# Milestone 3 – Humanitarian Integration Layer

## Federated Search + Submission Router

**Status:** Architecture Specification

**Priority:** P0

---

# Vision

GeoResponde is evolving from a GIS viewer into a **Geospatial Situation Room**.

Its mission is to orchestrate scientific, humanitarian and operational information without replacing or duplicating existing initiatives.

GeoResponde is not another humanitarian database.

GeoResponde is an integration platform.

---

# Internal Architecture

GeoResponde is internally divided into three independent domains.

```text
Scientific Intelligence

Humanitarian Network

Submission Router
```

These domains are implementation details.

They are **NOT** exposed directly to users.

---

# User Experience

The application is organized around user intent.

The primary navigation becomes:

```text
Situation

Find

Report
```

Every future feature should naturally fit into one of these three sections.

---

# Situation

Question answered:

**"What is happening?"**

Powered internally by:

Scientific Intelligence

Responsible for scientific and geospatial context.

Examples:

* Earthquakes
* Aftershocks
* Faults
* Ground Deformation
* Satellite Imagery
* Geological Context
* ShakeMaps
* Hazard Models

Scientific providers include:

USGS

Copernicus

ESA

NASA

FUNVISIS

Planet

Maxar

Sentinel

Situation remains map-centric.

---

# Find

Question answered:

**"Where is...?"**

Powered internally by:

Humanitarian Network

This becomes the humanitarian integration layer.

GeoResponde performs a **Federated Search** across multiple humanitarian initiatives.

GeoResponde does NOT own humanitarian data.

GeoResponde orchestrates access to it.

---

# Humanitarian Providers

Examples:

Terremoto Venezuela

Venezuela Te Busca

HazLoHoy

Venezuela Reporta

Hospitales Venezuela

Refugios Venezuela

Ayuda para Venezuela

Huellas Can

Future providers should be added without modifying the frontend.

---

# Humanitarian Provider Registry

Create:

```text
providers/

scientific/

humanitarian/
```

Each provider contains:

id

display_name

website

description

logo

status

adapter

capabilities

---

# Provider Capabilities

Providers declare capabilities.

Possible capabilities:

search

map

directory

statistics

building_details

person_lookup

submission

resource

future_api

future_sync

The UI automatically adapts to provider capabilities.

---

# Federated Search

Users search only once.

GeoResponde dispatches that query to every compatible provider.

```text
User

↓

GeoResponde

↓

Provider A

Provider B

Provider C

↓

Normalized Results

↓

Unified Presentation
```

Search results are NEVER stored permanently.

Providers remain the source of truth.

---

# Search Domains

Support searching:

People

Buildings

Addresses

Hospitals

Shelters

Collection Centers

Organizations

Pets

Future categories should require no architectural changes.

---

# Search Adapter Interface

Every provider implements:

```typescript
search(query)
```

Adapters transform provider-specific responses into normalized search results.

---

# Normalized Search Result

Every provider returns:

provider

provider_id

type

title

subtitle

status

location

last_update

confidence

url

thumbnail

metadata

---

# Attribution

Every result displays:

Provider logo

Provider name

Last update

Open Original Resource

GeoResponde never claims ownership.

---

# Report

Question answered:

**"I want to report something."**

Powered internally by:

Submission Router.

GeoResponde becomes the entry point for citizen reporting.

GeoResponde is NOT another reporting database.

GeoResponde routes reports toward existing initiatives.

---

# Submission Router

Citizen submits information once.

GeoResponde determines compatible destinations.

Initial implementation:

Guide users toward the correct official reporting platforms.

Future implementation:

Automatic API submission.

Future synchronized submission.

---

# Submission Categories

Missing Person

Found Person

Building Damage

Shelter

Collection Center

Hospital Update

Volunteer

Pet

Infrastructure Damage

Road Closure

Future report types should be easily added.

---

# Submission Flow

```text
Citizen

↓

GeoResponde

↓

Normalize Submission

↓

Find Compatible Providers

↓

Display Suggested Destinations

↓

Official Provider
```

Future:

```text
Citizen

↓

GeoResponde

↓

Submission Router

↓

Provider APIs
```

---

# Submission Package

Internally every report becomes a provider-independent object.

```text
Submission Package

↓

Provider Adapter

↓

Provider Implementation
```

This abstraction prepares GeoResponde for future interoperability.

---

# Provider Adapters

Supported adapter types:

Supabase

REST

GraphQL

ArcGIS Feature Service

GeoJSON

STAC

WMS

RSS

Static Directory

Web Forms

Adding providers should only require creating a new adapter.

No frontend changes.

---

# Resources

Some organizations expose no searchable data.

Examples:

Donation campaigns

Volunteer organizations

Emergency numbers

Official bulletins

These become Resources.

Resources are:

Curated

Attributed

External

Resources are NOT map layers.

Resources are NOT humanitarian entities.

---

# Future Architecture

This architecture should remain compatible with future capabilities.

Live APIs

Official Partnerships

Provider Authentication

Bidirectional Synchronization

Emergency Exchange Format / Protocol (future)

No work on protocol standardization is required during this milestone.

The architecture should simply avoid assumptions that would prevent that future evolution.

---

# Success Criteria

Situation continues consuming Scientific Intelligence providers.

Find performs federated search across all configured humanitarian providers.

Results are normalized.

Results preserve attribution.

Results always link back to the official provider.

Report routes users toward the correct reporting destination.

No humanitarian databases are duplicated.

Adding a new provider only requires:

1. Registering the provider.

2. Implementing a provider adapter.

No frontend modifications should ever be required.
