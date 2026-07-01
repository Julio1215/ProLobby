// pages/RedefinirSenha.jsx
//
// O que foi simplificado:
// - Removido AuthPage.jsx como wrapper → layout inline
// - Todos os sub-componentes do AuthPage (AuthField, AuthBtn, AuthError) → JSX direto
// - Lógica idêntica ao original

import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../services/api'

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [concluido, setConcluido] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (senha.length < 8) {
      setErro('A senha deve ter pelo menos 8 caracteres.')
      return
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.')
      return
    }

    setCarregando(true)
    try {
      await api.post('/auth/reset-password', { token, password: senha })
      setConcluido(true)
      // Redireciona para login após 3 segundos
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setErro(err.response?.data?.error || 'Token inválido ou expirado.')
    } finally {
      setCarregando(false)
    }
  }

  // Wrapper visual compartilhado pelas duas telas (formulário e confirmação)
  function Card({ children }) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #060610 0%, #0d0d1a 50%, #060610 100%)',
        padding: '1.5rem',
      }}>
        <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{
          width: '100%', maxWidth: '420px',
          background: 'rgba(13, 13, 26, 0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
          borderRadius: '24px', padding: '2.5rem',
          boxShadow: '0 0 60px rgba(124, 58, 237, 0.12)',
          display: 'flex', flexDirection: 'column', gap: '1.25rem',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #7c3aed, #bf00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', margin: '0 auto 0.875rem', boxShadow: '0 0 20px rgba(191, 0, 255, 0.35)' }}>
              🎮
            </div>
          </div>
          {children}
        </div>
      </div>
    )
  }

  // Link inválido (sem token na URL)
  if (!token) {
    return (
      <Card>
        <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.82rem' }}>
          ⚠️ Link inválido.
        </div>
        <Link to="/forgot-password" style={{ color: 'var(--color-brand-light)', fontSize: '0.82rem', textAlign: 'center', textDecoration: 'none' }}
          className="hover:underline">
          Solicitar novo link
        </Link>
      </Card>
    )
  }

  return (
    <Card>
      <h1 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.3rem', fontWeight: 900, color: 'white', textAlign: 'center' }}>
        Nova senha
      </h1>

      {!concluido ? (
        <>
          {erro && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.82rem' }}>
              ⚠️ {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(240,238,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Nova senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                className="input"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(240,238,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Confirmar senha
              </label>
              <input
                type="password"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete="new-password"
                className="input"
              />
            </div>
            <button type="submit" disabled={carregando} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
              {carregando ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center', padding: '1rem 0' }}>
          <span style={{ fontSize: '3rem' }}>✅</span>
          <p style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.5)' }}>Senha alterada! Redirecionando...</p>
          <Link to="/login" className="btn btn-primary" style={{ width: '100%', textAlign: 'center', textDecoration: 'none' }}>
            Ir para o login
          </Link>
        </div>
      )}
    </Card>
  )
}
