import { useState } from 'react';
import { MapViewer } from '../components/Map/MapViewer';
import { Sidebar } from '../components/Sidebar/Sidebar';

export function Situation() {
  const [activeLayerIds, setActiveLayerIds] = useState<Set<string>>(new Set());

  const toggleLayer = (id: string) => {
    setActiveLayerIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
      <MapViewer activeLayerIds={activeLayerIds} />
      <Sidebar activeLayerIds={activeLayerIds} onToggleLayer={toggleLayer} />
    </div>
  );
}
