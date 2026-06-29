import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function TopNav() {
  const { t, i18n } = useTranslation();

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    padding: '12px 24px',
    color: isActive ? '#38bdf8' : '#cbd5e1',
    textDecoration: 'none',
    fontWeight: 'bold' as const,
    borderBottom: isActive ? '2px solid #38bdf8' : '2px solid transparent',
    transition: 'all 0.2s'
  });

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      backgroundColor: '#0f172a',
      borderBottom: '1px solid #1e293b',
      padding: '0 20px',
      position: 'relative',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex' }}>
        <NavLink to="/situation" style={linkStyle}>
          {t('nav.situation')}
        </NavLink>
        <NavLink to="/find" style={linkStyle}>
          {t('nav.find')}
        </NavLink>
        <NavLink to="/report" style={linkStyle}>
          {t('nav.report')}
        </NavLink>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontWeight: 'bold' }}>
        <span 
          onClick={() => i18n.changeLanguage('es')}
          style={{ cursor: 'pointer', color: i18n.language.startsWith('es') ? '#38bdf8' : '#cbd5e1' }}
        >ES</span>
        <span>|</span>
        <span 
          onClick={() => i18n.changeLanguage('en')}
          style={{ cursor: 'pointer', color: i18n.language.startsWith('en') ? '#38bdf8' : '#cbd5e1' }}
        >EN</span>
      </div>
    </nav>
  );
}
