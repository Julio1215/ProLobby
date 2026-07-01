// pages/EsqueciSenha.jsx
//
// O que foi simplificado:
// - Removido AuthPage.jsx como wrapper genérico
//   → O layout de fundo (gradiente + card centralizado) está inline aqui.
//   → Assim o arquivo é autocontido: abre o arquivo, vê tudo.
// - AuthLogo, AuthTitle, AuthError, AuthBtn, AuthField (exports do AuthPage)
//   → Substituídos por JSX direto — sem componentes intermediários.
// - Lógica idêntica ao original.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [linkDev, setLinkDev] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      const { data } = await api.post('/auth/forgot-password', { email })
      setEnviado(true)
      // Em ambiente de dev o backend devolve o token diretamente para teste
      if (data.devToken) setLinkDev(`/reset-password?token=${data.devToken}`)
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao enviar. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #060610 0%, #0d0d1a 50%, #060610 100%)',
      padding: '1.5rem',
    }}>
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(124,58,237,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(191,0,255,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />

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
          <h1 style={{ fontFamily: 'var(--font-orbitron)', fontSize: '1.3rem', fontWeight: 900, color: 'white' }}>
            Recuperar senha
          </h1>
        </div>

        {!enviado ? (
          <>
            <p style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.5)', lineHeight: 1.6 }}>
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>

            {erro && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.82rem' }}>
                ⚠️ {erro}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(240,238,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="input"
                />
              </div>
              <button type="submit" disabled={carregando} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }}>
                {carregando ? 'Enviando...' : 'Enviar link'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center', padding: '1rem 0' }}>
            <span style={{ fontSize: '3rem' }}>✉️</span>
            <p style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.5)', lineHeight: 1.6 }}>
              Se este email estiver cadastrado, você receberá as instruções em breve.
            </p>
            {/* Link visível só em ambiente de desenvolvimento */}
            {linkDev && (
              <div style={{ width: '100%', padding: '0.75rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '12px', fontSize: '0.82rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ color: 'rgba(240,238,255,0.4)' }}>🛠️ Modo dev — link de reset:</span>
                <Link to={linkDev} style={{ color: 'var(--color-brand-light)', fontWeight: 600, textDecoration: 'none' }}
                  className="hover:underline">
                  Clique aqui para redefinir →
                </Link>
              </div>
            )}
          </div>
        )}

        <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'rgba(240,238,255,0.45)' }}>
          Lembrou a senha?{' '}
          <Link to="/login" style={{ color: 'var(--color-brand-light)', fontWeight: 600, textDecoration: 'none' }} className="hover:underline">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  )
}
