import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'

// ============================================
// NAV ITEMS — espelha o índice "Navegação" combinado
// com a equipe (ver footer do layout oficial de Notícias):
// Home, E-Sports, Notícias, Comunidade, Fichas de RPG, Guia de Jogos
// + páginas já existentes no app que ainda não estão no índice combinado
// ============================================
const NAV_ITEMS = [
  {
    to: '/', end: true, label: 'Home',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    to: '/news', label: 'Notícias',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
  },
  {
    to: '/esports', label: 'E-Sports', comingSoon: true,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  },
  {
    to: '/community', label: 'Comunidade',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    to: '/rpg', label: 'Fichas de RPG',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3.5 18.5 3.5-9.5L10.5 12 12 6l1.5 6 3.5-3 3.5 9.5"/><path d="M3 18h18"/></svg>,
  },
  {
    to: '/guia', label: 'Guia de Jogos', comingSoon: true,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
  {
    to: '/mestre', label: 'Mestre IA',
    badge: 'IA',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a5 5 0 1 0 5 5"/><path d="M8 21v-1a4 4 0 0 1 4-4h4"/><circle cx="17" cy="15" r="3"/><path d="m21 19-1.5-1.5"/></svg>,
  },
  {
    to: '/qcd', label: 'QCD Score',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const check = () => setCollapsed(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <aside style={{
      width: collapsed ? '64px' : '200px',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      background: 'var(--color-dark-secondary)',
      borderRight: '1px solid var(--color-dark-border)',
      position: 'relative',
      paddingBottom: '1rem',
    }}>
      {/* Toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        title={collapsed ? 'Expandir' : 'Recolher'}
        style={{
          position: 'absolute', top: '0.75rem',
          right: collapsed ? '50%' : '0.5rem',
          transform: collapsed ? 'translateX(50%)' : 'none',
          width: '22px', height: '22px', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--color-dark-card)',
          border: '1px solid var(--color-dark-border)',
          color: 'var(--color-dark-text-2)',
          cursor: 'pointer', zIndex: 10, fontSize: '10px',
          transition: 'all 0.2s',
        }}
      >
        {collapsed ? '›' : '‹'}
      </button>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '2.5rem 0.5rem 0.5rem' }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.comingSoon ? '#' : item.to}
            end={item.end}
            title={collapsed ? item.label : undefined}
            onClick={item.comingSoon ? (e) => e.preventDefault() : undefined}
            style={{ textDecoration: 'none', cursor: item.comingSoon ? 'default' : 'pointer' }}
          >
            {({ isActive }) => (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: collapsed ? '0.65rem' : '0.6rem 0.85rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '42px',
                background: isActive && !item.comingSoon ? 'rgba(124,58,237,0.12)' : 'transparent',
                color: isActive && !item.comingSoon ? 'var(--color-brand-light)' : item.comingSoon ? 'var(--color-dark-text-3)' : 'var(--color-dark-text-2)',
                opacity: item.comingSoon ? 0.55 : 1,
                transition: 'all 0.15s',
              }}
              className={!isActive && !item.comingSoon ? 'hover:bg-dark-hover hover:text-dark-text-1' : ''}
              >
                {/* Active bar */}
                {isActive && !item.comingSoon && (
                  <span style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: '3px', borderRadius: '0 3px 3px 0',
                    background: 'linear-gradient(180deg, #7c3aed, #bf00ff)',
                  }} />
                )}

                <span style={{ flexShrink: 0, lineHeight: 0 }}>{item.icon}</span>

                {!collapsed && (
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', flex: 1 }}>
                    {item.label}
                  </span>
                )}

                {/* Badge IA */}
                {!collapsed && item.badge && (
                  <span style={{
                    padding: '0.1rem 0.4rem', borderRadius: '99px',
                    fontSize: '0.55rem', fontWeight: 800,
                    background: 'linear-gradient(135deg,#7c3aed,#bf00ff)',
                    color: 'white', letterSpacing: '0.04em',
                  }}>
                    {item.badge}
                  </span>
                )}

                {/* Badge "em breve" */}
                {!collapsed && item.comingSoon && (
                  <span style={{
                    padding: '0.08rem 0.4rem', borderRadius: '99px',
                    fontSize: '0.52rem', fontWeight: 700,
                    border: '1px solid var(--color-dark-border)',
                    color: 'var(--color-dark-text-3)', letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                  }}>
                    em breve
                  </span>
                )}

                {/* Tooltip collapsed */}
                {collapsed && (
                  <span style={{
                    position: 'absolute', left: '110%', top: '50%', transform: 'translateY(-50%)',
                    background: 'var(--color-dark-card)',
                    border: '1px solid var(--color-dark-border)',
                    borderRadius: '8px', padding: '0.3rem 0.65rem',
                    fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap',
                    pointerEvents: 'none', opacity: 0, zIndex: 100,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                    transition: 'opacity 0.15s',
                  }}
                  className="group-hover:opacity-100"
                  >
                    {item.label}{item.comingSoon ? ' (em breve)' : ''}
                  </span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div style={{ marginTop: 'auto', padding: '0 0.75rem' }}>
          <div style={{
            padding: '0.75rem', borderRadius: '12px',
            background: 'rgba(124,58,237,0.07)',
            border: '1px solid rgba(124,58,237,0.12)',
          }}>
            <p style={{ fontSize: '0.63rem', color: 'var(--color-dark-text-3)', textAlign: 'center', lineHeight: 1.4 }}>
              ProLobby v1.0<br/>
              <span style={{ color: 'var(--color-brand-light)', opacity: 0.6 }}>Hub Gamer</span>
            </p>
          </div>
        </div>
      )}
    </aside>
  )
}
