import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HumanitarianProvider, NormalizedSearchResult, SubmissionPackage } from '@georesponde/shared';
import { BaseAdapter } from '../adapters/BaseAdapter.js';
import { VenezuelaTeBuscaAdapter } from '../adapters/venezuelatebusca/adapter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ProviderGateway {
  private providers: HumanitarianProvider[] = [];
  private adapters: Map<string, BaseAdapter> = new Map();

  async initialize() {
    // Resolve relative to the location of this file, reaching the monorepo root
    const catalogPath = path.resolve(__dirname, '../../../public/catalog/providers.json');
    if (fs.existsSync(catalogPath)) {
      const content = fs.readFileSync(catalogPath, 'utf8');
      this.providers = JSON.parse(content);
      
      for (const p of this.providers) {
        if (p.status !== 'active') continue;
        
        if (p.adapter === 'VenezuelaTeBuscaAdapter') {
          this.adapters.set(p.id, new VenezuelaTeBuscaAdapter(p));
        }
      }
      console.log(`[Gateway] Initialized with ${this.adapters.size} active adapters.`);
    } else {
      console.warn(`[Gateway] Warning: No providers.json found at ${catalogPath}`);
    }
  }

  async search(query: string, domain?: string): Promise<NormalizedSearchResult[]> {
    const searchPromises: Promise<NormalizedSearchResult[]>[] = [];
    
    for (const [id, adapter] of this.adapters.entries()) {
      if (adapter.provider.capabilities.includes('search')) {
        searchPromises.push(
          adapter.search(query, domain).catch(e => {
            console.error(`[Gateway] Provider ${id} search failed:`, e);
            return [];
          })
        );
      }
    }

    const resultsArray = await Promise.all(searchPromises);
    return resultsArray.flat();
  }

  getProviders() {
    return this.providers;
  }
}
