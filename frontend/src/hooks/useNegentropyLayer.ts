import { useEffect, useState } from 'react';
import { API_BASE } from '../lib/api';

export type NegentropyDataset = 'hospitales' | 'planteles' | 'edificaciones';

export type NegentropySource = 'live' | 'cache' | 'empty' | null;

export interface NegentropyFeatureCollection {
  type: 'FeatureCollection';
  features: any[];
}

const EMPTY_COLLECTION: NegentropyFeatureCollection = { type: 'FeatureCollection', features: [] };

export interface UseNegentropyLayerResult {
  collection: NegentropyFeatureCollection;
  loading: boolean;
  error: string | null;
  source: NegentropySource;
  attribution: string | null;
}

/**
 * Fetch a Negentropy dataset (hospitales/planteles/edificaciones) GeoJSON from
 * the gateway `/api/negentropy/:dataset` route.
 *
 * Viewport loading: `bounds` is the current map viewport as `[minLng,minLat,maxLng,maxLat]`;
 * it is passed through as `?bbox=` so the gateway filters to just the features in view.
 * A new viewport bounds value refetches; the in-flight request is aborted on cleanup/unmount.
 */
export function useNegentropyLayer(
  dataset: NegentropyDataset,
  enabled: boolean,
  bounds?: [number, number, number, number] | null,
): UseNegentropyLayerResult {
  const [collection, setCollection] = useState<NegentropyFeatureCollection>(EMPTY_COLLECTION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<NegentropySource>(null);
  const [attribution, setAttribution] = useState<string | null>(null);

  const boundsKey = enabled && bounds ? bounds.map((n) => Math.round(n * 10000) / 10000).join(',') : '';

  useEffect(() => {
    if (!enabled) {
      setCollection(EMPTY_COLLECTION);
      setSource(null);
      setError(null);
      setAttribution(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const query = boundsKey ? `?bbox=${encodeURIComponent(boundsKey)}` : '';
        const res = await fetch(`${API_BASE}/api/negentropy/${dataset}${query}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Gateway responded ${res.status}`);
        const body = await res.json();
        if (cancelled) return;
        setCollection(
          body && body.type === 'FeatureCollection' && Array.isArray(body.features)
            ? (body as NegentropyFeatureCollection)
            : EMPTY_COLLECTION,
        );
        setSource(res.headers.get('X-Negentropy-Source') as NegentropySource);
        setAttribution(res.headers.get('X-Attribution'));
      } catch (err) {
        if (cancelled || (err instanceof DOMException && err.name === 'AbortError')) return;
        setCollection(EMPTY_COLLECTION);
        setSource(null);
        setAttribution(null);
        setError(err instanceof Error ? err.message : 'Failed to load Negentropy layer');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [dataset, enabled, boundsKey]);

  return { collection, loading, error, source, attribution };
}
