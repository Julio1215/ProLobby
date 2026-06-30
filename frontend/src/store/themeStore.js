import { create } from 'zustand'

const getInitialTheme = () => {
  const saved = localStorage.getItem('hg_theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (theme) => {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
  }
}

const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('hg_theme', next)
    applyTheme(next)
    set({ theme: next })
  },

  initTheme: () => {
    applyTheme(get().theme)
  },
}))

export default useThemeStore