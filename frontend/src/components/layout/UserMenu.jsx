import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useThemeStore from '../../store/themeStore'
import { getAssetUrl } from '../../services/api'

function Avatar({ url, username, size = 'sm' }) {
  const dim = size === 'sm' ? 'w-[34px] h-[34px] text-sm' : 'w-[42px] h-[42px] text-base'
  return (
    <div className={`${dim} rounded-full bg-brand flex items-center justify-center font-semibold text-white overflow-hidden shrink-0`}>
      {url ? <img src={getAssetUrl(url)} alt={username} className="w-full h-full object-cover" /> : <span>{username?.[0]?.toUpperCase()}</span>}
    </div>
  )
}

export default function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const menuItem = 'flex items-center gap-2.5 w-full px-2 py-2 rounded-app text-sm text-light-text-2 dark:text-dark-text-2 hover:bg-light-hover dark:hover:bg-dark-hover hover:text-light-text-1 dark:hover:text-dark-text-1 transition-all text-left'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
      >
        <Avatar url={user.avatarUrl} username={user.username} />
        <span className="text-sm font-medium text-light-text-2 dark:text-dark-text-2 hidden sm:block">
          {user.displayName || user.username}
        </span>
        <span className="text-[9px] text-light-text-3 dark:text-dark-text-3">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-60 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-app shadow-2xl p-2 z-[200] transition-colors">
          {/* Header */}
          <div className="flex items-center gap-2.5 p-2">
            <Avatar url={user.avatarUrl} username={user.username} size="lg" />
            <div>
              <div className="text-sm font-semibold text-light-text-1 dark:text-dark-text-1">{user.displayName || user.username}</div>
              <div className="text-xs text-light-text-3 dark:text-dark-text-3">{user.email}</div>
            </div>
          </div>

          <div className="h-px bg-light-border dark:border-dark-border my-1.5" />

          <Link to="/perfil" className={menuItem} onClick={() => setOpen(false)}>
            <span>👤</span> Editar Perfil
          </Link>

          <button className={menuItem} onClick={toggleTheme}>
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
          </button>

          <div className="h-px bg-light-border dark:border-dark-border my-1.5" />

          <button
            className={`${menuItem} hover:!bg-red-500/10 hover:!text-red-500`}
            onClick={onLogout}
          >
            <span>🚪</span> Sair
          </button>
        </div>
      )}
    </div>
  )
}
