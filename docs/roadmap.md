# GeoResponde Roadmap

The roadmap establishes the milestones required to evolve GeoResponde from an experimental project into a fully functional, open-source Geospatial Situation Room.

## Milestones

### v0.2 — Initial Integration (Current)
- **Situation**: Base Scientific layers implemented and functional (Beta).
- **Find**: First real humanitarian provider (`Venezuela Te Busca`) integrated successfully (Experimental).
- **Architecture**: Core Provider Gateway and routing structures validated.

### v0.3 — Provider Framework
- Consolidate and standardize the Provider Gateway.
- Implement reusable Transports (REST, Supabase, ArcGIS) alongside Remix Single Fetch.
- Expand developer diagnostics for debugging provider responses.

### v0.4 — Multiple Providers
- Broaden the Find module by integrating the remaining priority providers.
- Implement parallel fetching with fault tolerance and timeouts.
- Enable complex federated search filtering.

### v0.5 — Submission Router
- Begin development of the **Report** module.
- Implement bidirectional communication to allow field reporters to submit data back to specific provider databases.

### v1.0 — Complete Geospatial Situation Room
- Full stabilization across Situation, Find, and Report modules.
- Dedicated user management and role-based access for emergency responders.
- General availability for deployment in new disaster contexts worldwide.
