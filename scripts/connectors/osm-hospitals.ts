import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = path.resolve(process.cwd());
const DATA_DIR = path.join(ROOT_DIR, 'public/data');

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const USER_AGENT = 'GeoResponde-App/1.0';

// Overpass QL to get all hospitals in Venezuela, returning center coordinates for polygons/relations
const QUERY = `[out:json][timeout:25];
area["name"="Venezuela"]->.searchArea;
(
  node["amenity"="hospital"](area.searchArea);
  way["amenity"="hospital"](area.searchArea);
  relation["amenity"="hospital"](area.searchArea);
);
out center;`;

async function fetchHospitals() {
  console.log('Fetching hospitals from OpenStreetMap Overpass API...');
  
  const url = `${OVERPASS_URL}?data=${encodeURIComponent(QUERY)}`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch OSM hospitals: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const elements = data.elements || [];
  
  console.log(`Received ${elements.length} raw hospital records.`);

  // Convert to GeoJSON FeatureCollection
  const geojson = {
    type: 'FeatureCollection',
    metadata: {
      generated: Date.now(),
      title: 'OpenStreetMap Hospitals in Venezuela'
    },
    features: elements.map((el: any) => {
      // For nodes, coordinates are in lat/lon. For ways/relations with 'out center', they are in center.lat/lon
      const lat = el.lat || el.center?.lat;
      const lon = el.lon || el.center?.lon;
      
      if (!lat || !lon) return null;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat]
        },
        properties: {
          id: el.id,
          type: el.type,
          name: el.tags?.name || 'Unknown Hospital',
          emergency: el.tags?.emergency || 'unknown',
          amenity: el.tags?.amenity,
          source: 'OpenStreetMap'
        }
      };
    }).filter(Boolean) // Remove any elements that failed to parse coordinates
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  
  const outputPath = path.join(DATA_DIR, 'hospitals.geojson');
  fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
  
  console.log(`Saved ${geojson.features.length} hospital features to ${outputPath}`);
}

fetchHospitals().catch(err => {
  console.error(err);
  process.exit(1);
});
