import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import useAuthStore from '../../store/authStore'
import toast from '../ui/Toast'

// Field FORA do componente — nunca é recriado
function Field({ name, value, onChange, label, type = 'text', placeholder, required, hint, showPass, onTogglePass }) {
  const isPass = name === 'password' || name === 'confirm'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(240,238,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label} {required && <span style={{ color: 'var(--color-brand-light)' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={isPass ? (showPass ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="input"
          style={isPass ? { paddingRight: '2.75rem' } : {}}
        />
        {name === 'password' && (
          <button type="button" onClick={onTogglePass}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-dark-text-3)', fontSize: '14px', lineHeight: 0, padding: '4px' }}>
            {showPass ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {hint && <p style={{ fontSize: '0.68rem', color: 'rgba(240,238,255,0.35)' }}>{hint}</p>}
    </div>
  )
}

export default function RegisterPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', username: '', displayName: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.username || !form.password) { setError('Preencha todos os campos obrigatórios'); return }
    if (form.password !== form.confirm) { setError('As senhas não coincidem'); return }
    if (form.password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        email: form.email,
        username: form.username,
        displayName: form.displayName || form.username,
        password: form.password,
      })
      login(res.data.user, res.data.token)
      toast.success('Conta criada! Bem-vindo ao ProLobby 🎮')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao criar conta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #060610 0%, #0d0d1a 50%, #060610 100%)',
      padding: '1.5rem', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(191,0,255,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(13, 13, 26, 0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(124, 58, 237, 0.2)',
        borderRadius: '24px', padding: '2.5rem',
        boxShadow: '0 0 60px rgba(124, 58, 237, 0.12)',
        animation: 'fadeInUp 0.4s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed, #bf00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 0.875rem', boxShadow: '0 0 20px rgba(191, 0, 255, 0.35)' }}>
            🎮
          </div>
          <h1 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.4rem', fontWeight: 900, color: 'white', marginBottom: '0.3rem' }}>
            Criar conta
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'rgba(240,238,255,0.45)' }}>Junte-se ao ProLobby</p>
        </div>

        {error && (
          <div style={{ marginBottom: '1.25rem', padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.82rem', display: 'flex', gap: '0.5rem' }}>
            <span>⚠️</span><span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <Field name="email"       value={form.email}       onChange={handleChange} label="Email"              type="email" placeholder="seu@email.com"         required />
          <Field name="username"    value={form.username}    onChange={handleChange} label="Username"                        placeholder="gamer123"               required hint="Será seu identificador único" />
          <Field name="displayName" value={form.displayName} onChange={handleChange} label="Nome de exibição"               placeholder="Seu nome público (opcional)" />
          <Field name="password"    value={form.password}    onChange={handleChange} label="Senha"              type="password" placeholder="Min. 6 caracteres"  required showPass={showPass} onTogglePass={() => setShowPass(s => !s)} />
          <Field name="confirm"     value={form.confirm}     onChange={handleChange} label="Confirmar senha"    type="password" placeholder="Repita a senha"      required showPass={showPass} />

          <button type="submit" disabled={loading} className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                Criando conta...
              </span>
            ) : 'Criar conta grátis 🚀'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'rgba(240,238,255,0.4)' }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: 'var(--color-brand-light)', fontWeight: 700, textDecoration: 'none' }} className="hover:underline">
            Entrar
          </Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}