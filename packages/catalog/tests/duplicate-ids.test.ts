import { describe, it, expect } from 'vitest';
import { validateRelations } from '../src/validators/relations';

describe('Duplicate IDs Validation', () => {
  it('should throw an error when a duplicate ID exists across collections', () => {
    const catalog = {
      organizations: [{ id: 'org-1', name: 'Org 1', type: 'NGO' as const }],
      sources: [{ id: 'org-1', name: 'Source 1', url: 'https://example.com', organizationId: 'org-1' }],
      datasets: [],
      layers: []
    };

    expect(() => validateRelations(catalog)).toThrow(/Duplicate ID detected/);
  });

  it('should throw an error when a duplicate ID exists within the same collection', () => {
    const catalog = {
      organizations: [
        { id: 'org-1', name: 'Org 1', type: 'NGO' as const },
        { id: 'org-1', name: 'Org 1 Duplicate', type: 'NGO' as const }
      ],
      sources: [],
      datasets: [],
      layers: []
    };

    expect(() => validateRelations(catalog)).toThrow(/Duplicate ID detected/);
  });
});
