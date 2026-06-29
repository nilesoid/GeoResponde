import { useState, useEffect, useRef } from 'react';
interface Feature {
  type: 'Feature';
  geometry: any;
  properties: any;
  id?: string | number;
}

interface FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

export interface ArcGISFeatureProviderOptions {
  url: string;
  bbox: [number, number, number, number] | null; // [minLng, minLat, maxLng, maxLat]
  where?: string;
  active?: boolean;
}

export function useArcGISFeatureLayer({ url, bbox, where = '1=1', active = true }: ArcGISFeatureProviderOptions) {
  const [featureCollection, setFeatureCollection] = useState<FeatureCollection>({
    type: 'FeatureCollection',
    features: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Cache of features by ID to avoid duplicates
  const featureCache = useRef<Map<string | number, Feature>>(new Map());
  // AbortController for the current bounding box fetch
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!active || !url || !bbox) {
      return;
    }

    // Cancel any ongoing request since bbox has changed (user is panning)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    const signal = abortController.signal;

    let isSubscribed = true;
    let offset = 0;
    const recordCount = 2000;

    const fetchFeatures = async () => {
      setLoading(true);
      setError(null);

      const [xmin, ymin, xmax, ymax] = bbox;
      const geometry = `${xmin},${ymin},${xmax},${ymax}`;

      try {
        let hasMore = true;
        const params = new URLSearchParams({
          where,
          geometry,
          geometryType: 'esriGeometryEnvelope',
          spatialRel: 'esriSpatialRelIntersects',
          outFields: '*',
          f: 'geojson',
          resultRecordCount: recordCount.toString()
        });

        while (hasMore && isSubscribed && !signal.aborted) {
          params.set('resultOffset', offset.toString());
          
          const queryUrl = url.endsWith('/query') ? url : `${url}/query`;
          const separator = queryUrl.includes('?') ? '&' : '?';
          const requestUrl = `${queryUrl}${separator}${params.toString()}`;
          const response = await fetch(requestUrl, { signal });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch ArcGIS features: ${response.statusText}`);
          }
          
          const data = await response.json();
          if (data.error) {
             throw new Error(data.error.message || 'Unknown ArcGIS API error');
          }
          
          if (data.type === 'FeatureCollection' && data.features) {
            const newFeatures = data.features as Feature[];
            let addedCount = 0;
            
            // Add to cache to prevent duplicates
            newFeatures.forEach(feature => {
              // Ensure we have an ID to use for caching
              const id = feature.id ?? feature.properties?.fid ?? feature.properties?.OBJECTID;
              if (id !== undefined && id !== null && !featureCache.current.has(id)) {
                featureCache.current.set(id, feature);
                addedCount++;
              }
            });

            // Update state with cached features
            if (isSubscribed && !signal.aborted) {
              setFeatureCollection({
                type: 'FeatureCollection',
                features: Array.from(featureCache.current.values())
              });
            }

            // Pagination logic
            if (newFeatures.length === recordCount) {
              offset += recordCount;
            } else {
              break; // No more features for this bbox
            }
          } else {
            break; // Unexpected format
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError' && isSubscribed) {
          setError(err);
          console.error("ArcGISFeatureProvider error:", err);
        }
      } finally {
        if (isSubscribed && !signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchFeatures();

    return () => {
      isSubscribed = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url, bbox?.join(','), where, active]);

  // Clear cache if url or where clause completely changes
  useEffect(() => {
    featureCache.current.clear();
    setFeatureCollection({ type: 'FeatureCollection', features: [] });
  }, [url, where]);

  return { featureCollection, loading, error };
}
