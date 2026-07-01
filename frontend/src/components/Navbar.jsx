import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getAssetUrl } from '../services/api'

// ============================================================
// ThemeToggle — botão de alternar tema claro/escuro
// ============================================================
function ThemeToggle() {
  const [tema, setTema] = useState(
    () => localStorage.getItem('hg_theme') || 'dark'
  )

  function alternarTema() {
    const novoTema = tema === 'dark' ? 'light' : 'dark'
    localStorage.setItem('hg_theme', novoTema)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(novoTema)
    setTema(novoTema)
  }

  const isDark = tema === 'dark'

  return (
    <button
      onClick={alternarTema}
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

// ============================================================
// UserDropdown — menu do usuário logado
// ============================================================
function UserDropdown({ usuario, onLogout }) {
  const [aberto, setAberto] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function fecharSeForaDo(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setAberto(false)
      }
    }
    document.addEventListener('mousedown', fecharSeForaDo)
    return () => document.removeEventListener('mousedown', fecharSeForaDo)
  }, [])

  const urlAvatar = usuario?.avatarUrl ? getAssetUrl(usuario.avatarUrl) : null
  const inicial = (usuario?.displayName || usuario?.username || 'U')[0].toUpperCase()

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setAberto(a => !a)}
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
        <span style={{
          width: '28px', height: '28px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #bf00ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: 'white',
          overflow: 'hidden', flexShrink: 0,
        }}>
          {urlAvatar
            ? <img src={urlAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : inicial
          }
        </span>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-dark-text-1)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {usuario?.displayName || usuario?.username}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: 'var(--color-dark-text-2)', transform: aberto ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {aberto && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          minWidth: '180px',
          background: 'var(--color-dark-card)',
          border: '1px solid var(--color-dark-border)',
          borderRadius: '14px',
          padding: '0.4rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 1000,
          animation: 'fadeInUp 0.15s ease',
        }}>
          <ItemDropdown icon="👤" label="Meu Perfil" onClick={() => { navigate('/perfil'); setAberto(false) }} />
          <div style={{ height: '1px', background: 'var(--color-dark-border)', margin: '0.3rem 0.5rem' }} />
          <ItemDropdown icon="🚪" label="Sair" onClick={() => { onLogout(); setAberto(false) }} perigo />
        </div>
      )}
    </div>
  )
}

function ItemDropdown({ icon, label, onClick, perigo }) {
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
        color: perigo ? '#ef4444' : 'var(--color-dark-text-1)',
        transition: 'background 0.15s',
        textAlign: 'left',
      }}
      className={perigo ? 'hover:bg-red-500/10' : 'hover:bg-dark-hover'}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

// ============================================================
// Navbar principal
// ============================================================
export default function Navbar() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
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
          color: 'var(--color-dark-text-1)',
        }}>
          PRO<span style={{ color: 'var(--color-brand-light)' }}>LOBBY</span>
        </span>
      </Link>

      {/* LADO DIREITO */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ThemeToggle />

        {usuario ? (
          <UserDropdown usuario={usuario} onLogout={handleLogout} />
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