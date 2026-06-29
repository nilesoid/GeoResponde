import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const FUNVISIS_URL = 'http://www.funvisis.gob.ve/maravilla.json';
const ROOT_DIR = path.resolve(process.cwd()); 
const DATA_DIR = path.join(ROOT_DIR, 'public/data');

async function fetchFunvisis() {
  console.log(`Fetching FUNVISIS data from ${FUNVISIS_URL}...`);
  
  const response = await fetch(FUNVISIS_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch FUNVISIS: ${response.statusText}`);
  }
  
  const rawData: any = await response.json();
  const features: any[] = [];
  
  // FUNVISIS mapped properties bizarrely into a store locator template
  // phone: Magnitude
  // address: Epicenter
  // city: Time (HH:MM)
  // postalCode: Date (DD-MM-YYYY)
  // phoneFormatted / state: Depth
  
  for (const feature of rawData.features || []) {
    try {
      const props = feature.properties;
      const mag = parseFloat(props.phone);
      const depth = parseFloat(props.phoneFormatted?.replace(' km', ''));
      const [day, month, year] = props.postalCode.split('-');
      const [hours, minutes] = props.city.split(':');
      
      const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes)
      );

      const lon = parseFloat(props.long);
      const lat = parseFloat(props.lat);

      if (!isNaN(lon) && !isNaN(lat) && !isNaN(mag)) {
        features.push({
          type: 'Feature',
          id: randomUUID(),
          geometry: {
            type: 'Point',
            coordinates: [lon, lat, depth || 0]
          },
          properties: {
            mag,
            place: props.address || 'Venezuela',
            time: date.getTime(),
            depth: depth || 0,
            source: 'FUNVISIS'
          }
        });
      }
    } catch (e) {
      console.warn('Skipped a malformed feature from FUNVISIS');
    }
  }
  
  const geojson = {
    type: 'FeatureCollection',
    metadata: {
      generated: Date.now(),
      url: FUNVISIS_URL,
      title: 'FUNVISIS Local Earthquakes',
      status: 200,
      api: '1.0.0',
      count: features.length
    },
    features
  };
  
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(DATA_DIR, 'funvisis-earthquakes.geojson'),
    JSON.stringify(geojson, null, 2)
  );
  
  console.log(`Saved ${features.length} FUNVISIS earthquakes to public/data/funvisis-earthquakes.geojson`);
}

fetchFunvisis().catch(err => {
  console.error(err);
  process.exit(1);
});
