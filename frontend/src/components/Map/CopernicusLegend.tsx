interface CopernicusLegendProps {
  activeLayerIds: Set<string>;
}

export function CopernicusLegend({ activeLayerIds }: CopernicusLegendProps) {
  const hasDamage = activeLayerIds.has('layer-copernicus-damage');
  const hasBuildings = hasDamage;
  const hasRoads = hasDamage;
  const hasGroundMovement = activeLayerIds.has('layer-copernicus-ground-movement');
  const hasNasa = activeLayerIds.has('layer-nasa-sentinel-damage');
  const hasFaults = activeLayerIds.has('layer-faults');
  const hasCitizenReports = activeLayerIds.has('layer-citizen-reports');

  if (!hasBuildings && !hasRoads && !hasGroundMovement && !hasNasa && !hasFaults && !hasCitizenReports) {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: '30px',
      right: '10px',
      backgroundColor: 'white',
      color: 'black',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      zIndex: 10,
      fontSize: '12px',
      fontFamily: 'sans-serif',
      maxHeight: '300px',
      overflowY: 'auto'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px', borderBottom: '1px solid #ccc', paddingBottom: '4px' }}>Layer Legend</div>

      {hasNasa && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>NASA Sentinel Damage</div>
          <div style={{ fontSize: '10px', color: '#666', marginBottom: '4px' }}>Probability of damage</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { label: 'High (75%+)', color: '#e60000' },
              { label: 'Medium (50%)', color: '#ff5500' },
              { label: 'Low (25%)', color: '#ffff73' }
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: item.color, border: '1px solid #666' }}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasGroundMovement && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Ground Movement (LOS) (m)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { label: 'Above 0.5', color: '#a50026' },
              { label: '0.2 to 0.5', color: '#c82227' },
              { label: '0.1 to 0.2', color: '#ee603d' },
              { label: '0.05 to 0.1', color: '#fca65d' },
              { label: '0 to 0.05', color: '#fede8e' },
              { label: '-0.05 to 0', color: '#def2f7' },
              { label: '-0.1 to -0.05', color: '#a4d3e6' },
              { label: '-0.2 to -0.1', color: '#6aa1cb' },
              { label: '-0.5 to -0.2', color: '#4062ab' }
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: item.color, border: '1px solid #666' }}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasBuildings && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Built Up Area</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { label: 'Destroyed', color: '#c0392b' },
              { label: 'Damaged', color: '#d35400' },
              { label: 'Possibly damaged', color: '#f39c12' },
              { label: 'No visible damage', color: '#27ae60' },
              { label: 'Not Analysed', color: '#7f8c8d' }
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: item.color, border: '1px solid #666' }}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasRoads && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Transportation Network</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '3px', backgroundColor: '#ffbebe', borderTop: '1px solid #686868', borderBottom: '1px solid #686868' }}></div>
              <span>Highway</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '2px', backgroundColor: '#ffffff', borderTop: '1px solid #686868', borderBottom: '1px solid #686868' }}></div>
              <span>Main road</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '1px', backgroundColor: '#b2b2b2', borderTop: '1px solid #686868', borderBottom: '1px solid #686868' }}></div>
              <span>Local road</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '1px', borderTop: '2px dashed #b2b2b2', marginTop: '2px' }}></div>
              <span>Track</span>
            </div>
            <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>* Red/Orange indicates damage</div>
          </div>
        </div>
      )}

      {hasFaults && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Tectonic Faults</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '3px', backgroundColor: '#e74c3c' }}></div>
              <span>Plate Boundary</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '20px', height: '2px', backgroundColor: '#f1c40f' }}></div>
              <span>Active Fault</span>
            </div>
          </div>
        </div>
      )}

      {hasCitizenReports && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Citizen Reports</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { label: 'Missing Person', color: '#e74c3c' },
              { label: 'Found Person', color: '#2ecc71' },
              { label: 'Shelter', color: '#3498db' },
              { label: 'Hospital', color: '#1abc9c' },
              { label: 'Veterinary', color: '#f39c12' }
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: item.color, borderRadius: '50%', border: '1px solid #fff' }}></div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
