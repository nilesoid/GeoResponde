import { useTranslation } from 'react-i18next';

interface Props {
  activeLayerIds: Set<string>;
  onToggleLayer: (id: string) => void;
}

const NEGENTROPY_SUBLAYERS = [
  { id: 'layer-negentropy-hospitales', key: 'hospitals', color: '#e74c3c' },
  { id: 'layer-negentropy-planteles', key: 'schools', color: '#9b59b6' },
  { id: 'layer-negentropy-edificaciones', key: 'damage', color: '#94a3b8' },
];

/**
 * Negentropy filters: per-sublayer toggle chips with color swatches, matching the
 * EONET category chips. Shown in the Sidebar under the consolidated Negentropy row.
 */
export function NegentropyControls({ activeLayerIds, onToggleLayer }: Props) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      <span style={{ color: '#94a3b8', fontSize: '12px' }}>
        {t('situation.negentropy.categoriesLabel')}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {NEGENTROPY_SUBLAYERS.map(({ id, key, color }) => {
          const active = activeLayerIds.has(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => onToggleLayer(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: active ? '#334155' : '#0f172a',
                border: `1px solid ${active ? color : '#334155'}`,
                borderRadius: '999px',
                padding: '4px 10px',
                color: active ? '#e2e8f0' : '#94a3b8',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                opacity: active ? 1 : 0.7,
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: color,
                }}
              />
              {t(`situation.negentropy.categories.${key}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
