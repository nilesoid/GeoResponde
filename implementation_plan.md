# Implementation Plan: Adding Advanced Geophysical Layers

The goal is to enrich the GeoResponde map with additional seismological and geophysical data, including a new source for historical quakes, geological maps, focal mechanisms, and additional hazard indicators.

## User Review Required

> [!IMPORTANT]  
> Please review the proposed data sources below. Since the 2026 earthquake is a hypothetical/simulated crisis event, some real-time APIs (like USGS Ground Failure) will not have data for it. For those, we will generate realistic simulated data or use static historical susceptibility models.

## Open Questions

> [!TIP]  
> For the Focal Mechanisms (beachballs), visualizing them dynamically on a web map requires either pre-generated SVGs or a custom WebGL shader. I propose we use a custom pin on the map and display the detailed tensor parameters (Strike, Dip, Rake, Magnitude) in the hover card. Is this acceptable, or would you prefer I attempt to integrate a library that renders the actual "beachball" SVGs?

> [!TIP]  
> For the "other geophysical information", I am proposing adding a **Liquefaction Susceptibility** map. Since real-time ground failure data for 2026 won't exist on USGS, I can generate a static GeoJSON layer highlighting high-risk coastal and riverbed zones in northern Venezuela based on elevation and water proximity. Does this sound good?

## Proposed Changes

### Data Connectors (Backend)

#### [NEW] `scripts/connectors/emsc-earthquakes.ts`
- Connects to the **EMSC FDSN API** (`www.seismicportal.eu`) to fetch historical earthquakes in Venezuela since June 24, 2026.
- Acts as a reliable fallback/addition to USGS and FUNVISIS.

#### [NEW] `scripts/connectors/macrostrat-geology.ts`
- Connects to the **Macrostrat API v2** to fetch regional geological polygons (formations, lithology, ages) for Venezuela.
- Will produce `geology.geojson`.

#### [NEW] `scripts/connectors/usgs-focal-mechanisms.ts`
- Connects to the **USGS ComCat API** filtering specifically for events with `producttype=moment-tensor`.
- Extracts Strike, Dip, and Rake for the main structural analysis.

#### [NEW] `scripts/connectors/liquefaction-susceptibility.ts`
- Generates a `liquefaction.geojson` polygon layer representing high susceptibility zones (coastal areas, sedimentary basins) in the affected region.

---

### Catalog Configuration

#### [MODIFY] `data/catalog/sources.yaml`
- Add sources for EMSC, Macrostrat, and Global CMT/USGS Tensors.

#### [MODIFY] `data/catalog/datasets.yaml`
- Register the 4 new datasets (`dataset-emsc`, `dataset-geology`, `dataset-focal-mechanisms`, `dataset-liquefaction`).

#### [MODIFY] `data/catalog/layers.yaml`
- Create 4 new map layers.

---

### MapViewer (Frontend)

#### [MODIFY] `frontend/src/components/Map/MapViewer.tsx`
- Add rendering logic for the geological polygons (fill layers with distinct colors based on lithology).
- Add rendering logic for the focal mechanisms (symbol layer).
- Add rendering logic for liquefaction susceptibility (semi-transparent hazard fill).
- Update the hover popup to neatly display geological formation names and focal mechanism parameters.

## Verification Plan

### Automated Tests
- Run `pnpm --filter @georesponde/catalog run build` to verify catalog integrity.
- Run `pnpm --filter @georesponde/frontend run build` to verify MapViewer TypeScript logic.

### Manual Verification
- Start the Vite dev server and toggle on the Geology, Liquefaction, Focal Mechanisms, and EMSC layers to ensure they render correctly and without visual clutter.
