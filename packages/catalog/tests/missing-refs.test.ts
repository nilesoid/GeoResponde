import { describe, it, expect } from 'vitest';
import { validateRelations } from '../src/validators/relations';

describe('Missing References Validation', () => {
  it('should throw if a source references a missing organization', () => {
    const catalog = {
      organizations: [],
      sources: [{ id: 'src-1', name: 'Source 1', url: 'http://example.com', organizationId: 'org-1' }],
      datasets: [],
      layers: []
    };
    expect(() => validateRelations(catalog)).toThrow(/Broken reference: Source src-1 references missing Organization org-1/);
  });

  it('should throw if a dataset references a missing source', () => {
    const catalog = {
      organizations: [{ id: 'org-1', name: 'Org 1', type: 'NGO' as const }],
      sources: [{ id: 'src-1', name: 'Source 1', url: 'http://example.com', organizationId: 'org-1' }],
      datasets: [{ id: 'ds-1', title: 'Dataset 1', sourceId: 'src-unknown' }],
      layers: []
    };
    expect(() => validateRelations(catalog)).toThrow(/Broken reference: Dataset ds-1 references missing Source src-unknown/);
  });

  it('should throw if a layer references a missing dataset', () => {
    const catalog = {
      organizations: [{ id: 'org-1', name: 'Org 1', type: 'NGO' as const }],
      sources: [{ id: 'src-1', name: 'Source 1', url: 'http://example.com', organizationId: 'org-1' }],
      datasets: [{ id: 'ds-1', title: 'Dataset 1', sourceId: 'src-1' }],
      layers: [{ id: 'layer-1', name: 'Layer 1', datasetIds: ['ds-unknown'] }]
    };
    expect(() => validateRelations(catalog)).toThrow(/Broken reference: Layer layer-1 references missing Dataset ds-unknown/);
  });
});
