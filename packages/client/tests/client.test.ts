import { describe, it, expect, vi } from 'vitest';
import { GeoRespondeClient } from '../src/client';

describe('GeoRespondeClient', () => {
  it('should fetch from default base url', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ([{ id: 'layer-1' }])
    });

    const client = new GeoRespondeClient({ fetch: mockFetch as unknown as typeof fetch });
    const layers = await client.getLayers();
    
    expect(mockFetch).toHaveBeenCalledWith('/catalog/layers.json');
    expect(layers).toEqual([{ id: 'layer-1' }]);
  });

  it('should fetch from custom base url', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    });

    const client = new GeoRespondeClient({ 
      baseUrl: 'https://api.georesponde.org/v1/catalog', 
      fetch: mockFetch as unknown as typeof fetch 
    });
    await client.getCatalog();
    
    expect(mockFetch).toHaveBeenCalledWith('https://api.georesponde.org/v1/catalog/catalog.json');
  });

  it('should throw an error if response is not ok', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    });

    const client = new GeoRespondeClient({ fetch: mockFetch as unknown as typeof fetch });
    await expect(client.getDatasets()).rejects.toThrow(/404 Not Found/);
  });
});
