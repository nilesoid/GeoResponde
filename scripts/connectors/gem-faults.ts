import * as fs from 'fs';
import * as path from 'path';

const ROOT_DIR = path.resolve(process.cwd());
const DATA_DIR = path.join(ROOT_DIR, 'public/data');

const GEM_GEOJSON_URL = 'https://raw.githubusercontent.com/GEMScienceTools/gem-global-active-faults/master/geojson/gem_active_faults.geojson';

// Venezuela Bounding Box
const MIN_LAT = 0;
const MAX_LAT = 15;
const MIN_LON = -75;
const MAX_LON = -59;

async function fetchFaults() {
  console.log('Fetching GEM Global Active Faults Database...');
  
  const response = await fetch(GEM_GEOJSON_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch GEM faults: ${response.status}`);
  }

  const data = await response.json();
  console.log(`Received ${data.features.length} global faults.`);

  // Filter features to only those that intersect with Venezuela's bounding box
  const filteredFeatures = data.features.filter((feature: any) => {
    // Basic bounding box intersection check for LineStrings
    if (feature.geometry && feature.geometry.type === 'LineString' && feature.geometry.coordinates) {
      for (const coord of feature.geometry.coordinates) {
        const [lon, lat] = coord;
        if (lat >= MIN_LAT && lat <= MAX_LAT && lon >= MIN_LON && lon <= MAX_LON) {
          return true; // Keep if any point of the fault is inside the BBox
        }
      }
    } else if (feature.geometry && feature.geometry.type === 'MultiLineString' && feature.geometry.coordinates) {
        for (const line of feature.geometry.coordinates) {
            for (const coord of line) {
                const [lon, lat] = coord;
                if (lat >= MIN_LAT && lat <= MAX_LAT && lon >= MIN_LON && lon <= MAX_LON) {
                    return true;
                }
            }
        }
    }
    return false;
  });
  
  console.log(`Filtered down to ${filteredFeatures.length} faults within the Venezuela region.`);

  // Create clean GeoJSON
  const geojson = {
    type: 'FeatureCollection',
    metadata: {
      generated: Date.now(),
      title: 'Active Tectonic Faults (Venezuela Region)'
    },
    features: filteredFeatures
  };

  fs.mkdirSync(DATA_DIR, { recursive: true });
  
  const outputPath = path.join(DATA_DIR, 'faults.geojson');
  fs.writeFileSync(outputPath, JSON.stringify(geojson, null, 2));
  
  console.log(`Saved ${filteredFeatures.length} fault features to ${outputPath}`);
}

fetchFaults().catch(err => {
  console.error(err);
  process.exit(1);
});
