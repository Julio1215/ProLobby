import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('hg_user') || 'null'),
  token: localStorage.getItem('hg_token') || null,

  login: (user, token) => {
    localStorage.setItem('hg_token', token)
    localStorage.setItem('hg_user', JSON.stringify(user))
    set({ user, token })
  },

  logout: () => {
    localStorage.removeItem('hg_token')
    localStorage.removeItem('hg_user')
    set({ user: null, token: null })
  },

  // Atualiza dados do usuário sem deslogar (usado após editar perfil/avatar)
  updateUser: (user) => {
    localStorage.setItem('hg_user', JSON.stringify(user))
    set({ user })
  },

  isAuthenticated: () => !!localStorage.getItem('hg_token'),
}))

export default useAuthStore
