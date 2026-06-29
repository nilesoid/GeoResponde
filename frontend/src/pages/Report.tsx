import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Report() {
  const [category, setCategory] = useState<string | null>(null);
  const { t } = useTranslation();

  const categories = [
    { id: 'missing_person', label: t('report.missingPerson'), providerUrl: 'https://venezuelatebusca.com/reportar' },
    { id: 'found_person', label: t('report.foundPerson'), providerUrl: 'https://venezuelatebusca.com/reportar' },
    { id: 'building_damage', label: t('report.damagedBuilding'), providerUrl: 'https://terremoto.hazlohoy.org/report' },
    { id: 'shelter', label: t('report.shelterUpdate'), providerUrl: 'https://refugiosvenezuela.com/update' },
  ];

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', flex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#fff', marginBottom: '16px', fontSize: '36px' }}>{t('report.title')}</h1>
        <p style={{ color: '#aaa', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          {t('report.subtitle')}
        </p>
      </div>

      {!category ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              style={{
                padding: '32px 24px',
                backgroundColor: '#1e293b',
                border: '2px solid #334155',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '20px',
                fontWeight: 'bold',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.borderColor = '#38bdf8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1e293b';
                e.currentTarget.style.borderColor = '#334155';
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button 
            onClick={() => setCategory(null)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#3498db', 
              cursor: 'pointer',
              marginBottom: '20px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {t('report.back')}
          </button>
          
          <div style={{ 
            backgroundColor: '#1e293b', 
            padding: '40px', 
            borderRadius: '12px', 
            border: '1px solid #334155',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#fff', marginTop: 0, fontSize: '28px', marginBottom: '16px' }}>{t('report.redirectTitle')}</h2>
            <p style={{ color: '#cbd5e1', marginBottom: '24px', fontSize: '18px', lineHeight: '1.6' }}>
              {t('report.redirectText')}
            </p>
            <a 
              href={categories.find(c => c.id === category)?.providerUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                padding: '16px 40px',
                backgroundColor: '#3498db',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '20px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
            >
              {t('report.goToOfficial')}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
