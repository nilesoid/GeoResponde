import { useState, useEffect } from 'react';

interface Provider {
  id: string;
  display_name: string;
  status: string;
  adapter: string;
  capabilities: string[];
}

export function ProviderStatus() {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/providers`)
      .then(res => res.json())
      .then(data => setProviders(data))
      .catch(err => console.error("Failed to load providers", err));
  }, []);

  const getStatusBadge = (provider: Provider) => {
    let color = '#ccc';
    let label = 'Unknown';
    let textColor = '#000';

    if (provider.status === 'inactive' || provider.status === 'planned') {
      color = '#e2e8f0';
      label = 'Not Implemented';
    } else if (provider.status === 'offline') {
      color = '#fecaca';
      label = 'Offline';
    } else if (provider.adapter === 'MockHumanitarianAdapter') {
      color = '#fef08a';
      label = 'Mock Provider';
    } else {
      color = '#bbf7d0';
      label = 'Real Provider';
    }

    return (
      <span style={{
        backgroundColor: color,
        color: textColor,
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {label}
      </span>
    );
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1rem' }}>Provider Status</h2>
      
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #ddd' }}>
            <tr>
              <th style={{ padding: '12px 16px' }}>Provider Name</th>
              <th style={{ padding: '12px 16px' }}>Adapter ID</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Capabilities</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{p.display_name}</td>
                <td style={{ padding: '12px 16px', color: '#666', fontSize: '14px' }}>{p.adapter}</td>
                <td style={{ padding: '12px 16px' }}>{getStatusBadge(p)}</td>
                <td style={{ padding: '12px 16px' }}>
                  {p.capabilities.map(c => (
                    <span key={c} style={{
                      display: 'inline-block',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '11px',
                      marginRight: '4px',
                      marginBottom: '4px'
                    }}>
                      {c}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
            {providers.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '24px' }}>Loading providers...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
