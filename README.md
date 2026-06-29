# GeoResponde

> **An open-source Geospatial Situation Room integrating scientific intelligence and humanitarian information for disaster response.**

## Vision

GeoResponde is an open-source Geospatial Situation Room designed to prevent information fragmentation during major emergencies. 

Instead of duplicating existing humanitarian databases or building isolated scientific viewers, GeoResponde federates existing data into a unified, lightweight interface. We aim to bridge the gap between complex earth sciences (earthquakes, geology, fault lines) and ground-level humanitarian response (missing persons, field reports).

## Architecture

```
             GeoResponde
             
       Situation       Find        Report
           │             │            │
      Scientific   Humanitarian   Operations
     Intelligence    Network
```

GeoResponde is a monorepo consisting of:
- **Frontend**: React-based geospatial situation room mapping scientific events.
- **Backend**: Fastify API serving as a Provider Gateway to federate search requests across disparate humanitarian organizations.
- **Shared**: Type definitions and shared utilities.

## Module Maturity

| Module | Status | Description |
|---|---|---|
| **Situation** | **Beta** | Scientific Intelligence mapping (Earthquakes, Geology, Faults, Satellite imagery). |
| **Find** | **Experimental** | Federated search across humanitarian providers. |
| **Report** | **Planned** | Submission router for field operations and incoming reports. |

## Providers

GeoResponde connects to external databases using the **Provider Gateway**.

| Provider | Status | Transport |
|---|---|---|
| Venezuela Te Busca | Experimental | Remix Single Fetch |

## Installation & Development

To run the project locally, ensure you have Node.js (>=20) and `pnpm` installed.

```bash
# Install dependencies
pnpm install

# Start both frontend and backend development servers concurrently
pnpm dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Contributing

We welcome contributions from developers, researchers, and humanitarian organizations. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT License. See [LICENSE](LICENSE) for details.
