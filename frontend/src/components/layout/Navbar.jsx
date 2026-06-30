import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import useAuthStore from '../../store/authStore'
import useThemeStore from '../../store/themeStore'
import { getAssetUrl } from '../../services/api'

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
      style={{
        width: '36px', height: '36px',
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-dark-secondary)',
        border: '1px solid var(--color-dark-border)',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'all 0.2s',
        color: 'var(--color-dark-text-2)',
      }}
      className="hover:border-brand hover:text-brand-light"
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  )
}

function NotificationBell() {
  return (
    <button
      title="Notificações"
      style={{
        width: '36px', height: '36px',
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--color-dark-secondary)',
        border: '1px solid var(--color-dark-border)',
        cursor: 'pointer',
        color: 'var(--color-dark-text-2)',
        position: 'relative',
        transition: 'all 0.2s',
      }}
      className="hover:border-brand hover:text-brand-light"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    </button>
  )
}

function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const avatar = user?.avatarUrl ? getAssetUrl(user.avatarUrl) : null
  const initial = (user?.displayName || user?.username || 'U')[0].toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.3rem 0.75rem 0.3rem 0.3rem',
          background: 'var(--color-dark-secondary)',
          border: '1px solid var(--color-dark-border)',
          borderRadius: '99px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        className="hover:border-brand"
      >
        {/* Avatar */}
        <span style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #bf00ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: 'white',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {avatar
            ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : initial
          }
        </span>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-dark-text-1)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.displayName || user?.username}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-dark-text-2)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          minWidth: '180px',
          background: '#0d0d1a',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--color-dark-border)',
          borderRadius: '14px',
          padding: '0.4rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          zIndex: 1000,
          animation: 'fadeInUp 0.15s ease',
        }}>
          <DropItem icon="👤" label="Meu Perfil" onClick={() => { navigate('/perfil'); setOpen(false) }} />
          <DropItem icon="⚙️" label="Configurações" onClick={() => setOpen(false)} />
          <div style={{ height: '1px', background: 'var(--color-dark-border)', margin: '0.3rem 0.5rem' }} />
          <DropItem icon="🚪" label="Sair" onClick={() => { onLogout(); setOpen(false) }} danger />
        </div>
      )}
    </div>
  )
}

function DropItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
        padding: '0.55rem 0.75rem',
        borderRadius: '10px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.82rem',
        fontWeight: 500,
        color: danger ? '#ef4444' : 'var(--color-dark-text-1)',
        transition: 'background 0.15s',
        textAlign: 'left',
      }}
      className={danger ? 'hover:bg-red-500/10' : 'hover:bg-dark-hover'}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.25rem',
      background: 'rgba(13, 13, 26, 0.9)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--color-dark-border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}
      className="transition-colors"
    >
      {/* LOGO */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
        <div style={{
          width: '30px', height: '30px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #7c3aed, #bf00ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '16px',
          boxShadow: '0 0 12px rgba(191, 0, 255, 0.4)',
        }}>
          🎮
        </div>
        <span style={{
          fontFamily: 'var(--font-orbitron)',
          fontSize: '1rem',
          fontWeight: 900,
          letterSpacing: '0.05em',
          color: 'white',
        }}>
          PRO<span style={{ color: 'var(--color-brand-light)' }}>LOBBY</span>
        </span>
      </Link>

      {/* RIGHT SIDE */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <NotificationBell />
        <ThemeToggle />

        {user ? (
          <UserDropdown user={user} onLogout={handleLogout} />
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login"
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '10px',
                border: '1px solid var(--color-dark-border)',
                color: 'var(--color-dark-text-2)',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              className="hover:border-brand hover:text-brand-light"
            >
              Entrar
            </Link>
            <Link to="/register"
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: 'white',
                fontSize: '0.82rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
                boxShadow: '0 0 12px rgba(124, 58, 237, 0.3)',
              }}
              className="hover:opacity-90"
            >
              Criar conta
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
