import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import toast from '../ui/Toast'

export default function LoginPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ login: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.login || !form.password) { setError('Preencha todos os campos'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user, res.data.token)
      toast.success('Login realizado! Bem-vindo de volta 👾')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #060610 0%, #0d0d1a 50%, #060610 100%)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{ position: 'fixed', top: '-100px', left: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-80px', right: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(191,0,255,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(13, 13, 26, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(124, 58, 237, 0.2)',
        borderRadius: '24px',
        padding: '2.5rem',
        position: 'relative',
        boxShadow: '0 0 60px rgba(124, 58, 237, 0.12)',
        animation: 'fadeInUp 0.4s ease',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #7c3aed, #bf00ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', margin: '0 auto 1rem',
            boxShadow: '0 0 24px rgba(191, 0, 255, 0.4)',
          }}>
            🎮
          </div>
          <h1 style={{
            fontFamily: 'var(--font-orbitron)',
            fontSize: '1.5rem',
            fontWeight: 900,
            color: 'white',
            marginBottom: '0.3rem',
          }}>
            PRO<span style={{ color: 'var(--color-brand-light)' }}>LOBBY</span>
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.5)' }}>
            Entre na sua conta gamer
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: '1.25rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#f87171',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(240,238,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Email ou Username
            </label>
            <input
              type="text"
              name="login"
              value={form.login}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="input"
              autoComplete="username"
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(240,238,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Senha
              </label>
              <Link to="/forgot-password" style={{ fontSize: '0.72rem', color: 'var(--color-brand-light)', textDecoration: 'none', fontWeight: 600 }}
                className="hover:underline">
                Esqueceu?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input"
                autoComplete="current-password"
                required
                style={{ paddingRight: '2.75rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--color-dark-text-3)', fontSize: '14px', lineHeight: 0, padding: '4px',
                }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', marginTop: '0.5rem' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                Entrando...
              </span>
            ) : 'Entrar'}
          </button>
        </form>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'rgba(240,238,255,0.45)' }}>
          Não tem conta?{' '}
          <Link to="/register" style={{ color: 'var(--color-brand-light)', fontWeight: 700, textDecoration: 'none' }}
            className="hover:underline">
            Criar conta grátis
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
