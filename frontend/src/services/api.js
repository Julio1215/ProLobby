import axios from 'axios'

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    'http://localhost:3001/api',
  timeout: 15000,
})

// ============================================
// REQUEST INTERCEPTOR
// ============================================

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hg_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    // 401 = token expirado ou inválido
    if (status === 401) {
      const currentPath = window.location.pathname
      // Não redireciona se já está em página de auth
      if (!['/login', '/register', '/forgot-password', '/reset-password'].includes(currentPath)) {
        localStorage.removeItem('hg_token')
        localStorage.removeItem('hg_user')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// ============================================
// HELPER: asset URL resolver
// ============================================

export const getAssetUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  const origin = api.defaults.baseURL.replace(/\/api\/?$/, '')
  return `${origin}${path}`
}

export default api
