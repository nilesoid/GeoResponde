import { describe, it, expect } from 'vitest';
import { validateRelations } from '../src/validators/relations';

describe('Valid Catalog', () => {
  it('should not throw any errors for a perfectly valid catalog', () => {
    const catalog = {
      organizations: [{ id: 'org-1', name: 'Org 1', type: 'NGO' as const }],
      sources: [{ id: 'src-1', name: 'Source 1', url: 'http://example.com', organizationId: 'org-1' }],
      datasets: [{ id: 'ds-1', title: 'Dataset 1', sourceId: 'src-1' }],
      layers: [{ id: 'layer-1', name: 'Layer 1', datasetIds: ['ds-1'] }]
    };

    expect(() => validateRelations(catalog)).not.toThrow();
  });
});
