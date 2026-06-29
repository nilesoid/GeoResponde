import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import yaml from 'yaml';

// USGS Query API for Venezuela Bounding Box (approx) since June 24th 2026
// minlatitude=0.6, maxlatitude=12.5, minlongitude=-73.4, maxlongitude=-59.8
const USGS_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.0&minlatitude=0.6&maxlatitude=12.5&minlongitude=-73.4&maxlongitude=-59.8&starttime=2026-06-24';
const ROOT_DIR = path.resolve(__dirname, '../../');
const CATALOG_DIR = path.join(ROOT_DIR, 'data/catalog');
const DATA_DIR = path.join(ROOT_DIR, 'public/data');

async function readYaml(filename: string): Promise<any[]> {
  const filePath = path.join(CATALOG_DIR, filename);
  try {
    const text = await fs.readFile(filePath, 'utf8');
    return yaml.parse(text) || [];
  } catch (e) {
    return [];
  }
}

async function writeYaml(filename: string, data: any[], schemaName: string) {
  const filePath = path.join(CATALOG_DIR, filename);
  const header = `# yaml-language-server: $schema=./${schemaName}.schema.json\n# Generated/Updated by connector\n\n`;
  const text = header + yaml.stringify(data);
  await fs.writeFile(filePath, text, 'utf8');
}

async function upsertSource() {
  const sources = await readYaml('sources.yaml');
  const existing = sources.find(s => s.id === 'src-usgs-api');
  
  if (!existing) {
    sources.push({
      id: 'src-usgs-api',
      name: 'USGS Earthquake API (2.0+ M, since Jun 24)',
      url: USGS_URL,
      organizationId: 'org-usgs',
      license: 'Public Domain'
    });
    await writeYaml('sources.yaml', sources, 'sources');
    console.log('Added src-usgs-api to sources.yaml');
  }
}

async function upsertDataset() {
  const datasets = await readYaml('datasets.yaml');
  const existing = datasets.find(d => d.id === 'ds-earthquakes-recent');
  
  if (!existing) {
    datasets.push({
      id: 'ds-earthquakes-recent',
      title: 'Recent Earthquakes (M2.0+, since June 24)',
      description: 'Automatically updated GeoJSON feed of recent global seismic activity since June 24, 2026.',
      sourceId: 'src-usgs-api',
      tags: ['earthquake', 'seismic', 'global']
    });
    await writeYaml('datasets.yaml', datasets, 'datasets');
    console.log('Added ds-earthquakes-recent to datasets.yaml');
  }
}

async function upsertLayer() {
  const layers = await readYaml('layers.yaml');
  const existing = layers.find(l => l.id === 'layer-earthquakes');
  
  if (!existing) {
    layers.push({
      id: 'layer-earthquakes',
      name: 'Recent Earthquakes',
      datasetIds: ['ds-earthquakes-recent'],
      format: 'geojson',
      category: 'Scientific',
      confidence: 'Verified',
      refreshFrequency: 'Hourly',
      enabled: true,
      visualization: {
        type: 'circle',
        paint: {
          'circle-color': '#e74c3c',
          'circle-radius': ['*', ['get', 'mag'], 2]
        }
      }
    });
    await writeYaml('layers.yaml', layers, 'layers');
    console.log('Added layer-earthquakes to layers.yaml');
  }
}

async function fetchAndSaveData() {
  console.log('Fetching USGS data...');
  const res = await axios.get(USGS_URL);
  const data = res.data;
  
  const targetPath = path.join(DATA_DIR, 'earthquakes.geojson');
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Saved ${data.features.length} earthquakes to public/data/earthquakes.geojson`);
}

async function main() {
  try {
    await upsertSource();
    await upsertDataset();
    await upsertLayer();
    await fetchAndSaveData();
    console.log('Connector ran successfully!');
  } catch (err) {
    console.error('Connector failed:', err);
    process.exit(1);
  }
}

main();
