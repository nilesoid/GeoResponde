import * as fs from 'fs';
import * as path from 'path';

const API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
const START_DATE = '2026-06-23';
// Venezuela Bounding Box
const MIN_LAT = 0;
const MAX_LAT = 15;
const MIN_LON = -75;
const MAX_LON = -59;

const ROOT_DIR = path.resolve(process.cwd());
const DATA_DIR = path.join(ROOT_DIR, 'public/data');

async function fetchAftershocks() {
  const url = `${API_URL}?format=geojson&starttime=${START_DATE}&minlatitude=${MIN_LAT}&maxlatitude=${MAX_LAT}&minlongitude=${MIN_LON}&maxlongitude=${MAX_LON}&minmagnitude=2.5`;
  
  console.log(`Fetching USGS Aftershocks from ${url}...`);
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch USGS aftershocks: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // Add some custom metadata properties to align with our schema
  data.metadata = {
    ...data.metadata,
    generated: Date.now(),
    title: 'USGS Recorded Aftershocks (Venezuela, Since June 23, 2026)'
  };
  
  // Ensure the public data directory exists
  fs.mkdirSync(DATA_DIR, { recursive: true });
  
  // Write to public folder
  const outputPath = path.join(DATA_DIR, 'aftershocks.geojson');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  
  console.log(`Saved ${data.features?.length || 0} aftershock events to ${outputPath}`);
}

fetchAftershocks().catch(err => {
  console.error(err);
  process.exit(1);
});
