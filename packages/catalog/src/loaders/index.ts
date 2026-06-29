import path from 'path';
import { readYaml } from '../utils/fs';
import { Organization, Source, Dataset, Layer } from '../types';
import { HumanitarianProvider } from '@georesponde/shared';

const CATALOG_DIR = path.resolve(__dirname, '../../../../data/catalog');

export async function loadOrganizations(): Promise<Organization[]> {
  return readYaml<Organization>(path.join(CATALOG_DIR, 'organizations.yaml'));
}

export async function loadSources(): Promise<Source[]> {
  return readYaml<Source>(path.join(CATALOG_DIR, 'sources.yaml'));
}

export async function loadDatasets(): Promise<Dataset[]> {
  return readYaml<Dataset>(path.join(CATALOG_DIR, 'datasets.yaml'));
}

export async function loadLayers(): Promise<Layer[]> {
  return readYaml<Layer>(path.join(CATALOG_DIR, 'layers.yaml'));
}

export async function loadProviders(): Promise<HumanitarianProvider[]> {
  return readYaml<HumanitarianProvider>(path.join(CATALOG_DIR, 'providers/providers.yaml'));
}
