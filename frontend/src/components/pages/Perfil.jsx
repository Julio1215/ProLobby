// pages/Perfil.jsx
//
// O que foi simplificado:
// - useAuthStore (Zustand) → useAuth() do nosso contexto
// - toast.success() / toast.error() → useState de mensagem inline
//   Motivo: o Toast original usava Context + Provider + variável global mutável.
//   A substituição é um par de estados (mensagem + tipo) e um div condicional.
//   Mesma experiência para o usuário, código muito mais simples.
// - Import path atualizado (era ../../services/api, agora ../services/api)

import { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api, { getAssetUrl } from '../../services/api'

const labelStyle = {
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'rgba(240,238,255,0.45)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  display: 'block',
  marginBottom: '0.35rem',
}

// Seção com título e borda — usada para agrupar campos
function Secao({ titulo, children }) {
  return (
    <div style={{ background: 'var(--color-dark-card)', border: '1px solid var(--color-dark-border)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-text-1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {titulo}
      </h2>
      {children}
    </div>
  )
}

export default function Perfil() {
  // useAuth() substitui useAuthStore() — mesma interface: usuario e atualizarUsuario
  const { usuario, atualizarUsuario } = useAuth()

  const [displayName, setDisplayName] = useState(usuario?.displayName || '')
  const [bio, setBio]                 = useState(usuario?.bio || '')
  const [salvando, setSalvando]       = useState(false)
  const [enviando, setEnviando]       = useState(false)

  // Estado de feedback — substitui toast.success() e toast.error()
  // tipo pode ser 'sucesso' ou 'erro'
  const [aviso, setAviso] = useState({ mensagem: '', tipo: '' })
  const fileRef = useRef(null)

  function mostrarAviso(mensagem, tipo = 'sucesso') {
    setAviso({ mensagem, tipo })
    setTimeout(() => setAviso({ mensagem: '', tipo: '' }), 3000)
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setSalvando(true)
    try {
      const res = await api.patch('/users/me', { displayName, bio })
      atualizarUsuario(res.data.user)
      mostrarAviso('Perfil atualizado!')
    } catch (err) {
      mostrarAviso(err.response?.data?.error || 'Erro ao salvar.', 'erro')
    } finally {
      setSalvando(false)
    }
  }

  async function handleAvatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setEnviando(true)
    try {
      const fd = new FormData()
      fd.append('avatar', file)
      const res = await api.post('/users/me/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      atualizarUsuario(res.data.user)
      mostrarAviso('Foto atualizada!')
    } catch (err) {
      mostrarAviso(err.response?.data?.error || 'Erro ao enviar a foto.', 'erro')
    } finally {
      setEnviando(false)
      e.target.value = ''
    }
  }

  const urlAvatar = usuario?.avatarUrl ? getAssetUrl(usuario.avatarUrl) : null
  const inicial   = (usuario?.displayName || usuario?.username || 'U')[0].toUpperCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>

      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-text-1)', marginBottom: '0.3rem' }}>
          👤 Meu Perfil
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-dark-text-2)' }}>
          Gerencie sua conta e personalize seu perfil
        </p>
      </div>

      {/* Aviso de sucesso ou erro — substitui o sistema de Toast */}
      {aviso.mensagem && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          background: aviso.tipo === 'erro' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          border: `1px solid ${aviso.tipo === 'erro' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
          color: aviso.tipo === 'erro' ? '#f87171' : '#34d399',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}>
          {aviso.tipo === 'erro' ? '⚠️' : '✅'} {aviso.mensagem}
        </div>
      )}

      {/* Card de preview do perfil */}
      <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--color-dark-border)' }}>
        {/* Banner decorativo */}
        <div style={{ height: '100px', background: 'linear-gradient(135deg, rgba(124,58,237,0.5) 0%, rgba(191,0,255,0.3) 50%, rgba(0,229,255,0.2) 100%)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(124,58,237,0.05) 0px, rgba(124,58,237,0.05) 1px, transparent 1px, transparent 20px)' }} />
        </div>

        {/* Avatar + nome */}
        <div style={{ background: 'var(--color-dark-card)', padding: '0 1.5rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '-36px', marginBottom: '0.875rem' }}>
            {/* Clique no avatar abre o seletor de arquivo */}
            <div onClick={() => fileRef.current?.click()}
              style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #bf00ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, color: 'white', overflow: 'hidden', cursor: 'pointer', border: '3px solid var(--color-dark-card)', boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)', position: 'relative', flexShrink: 0 }}>
              {urlAvatar
                ? <img src={urlAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : inicial
              }
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', opacity: 0, transition: 'opacity 0.2s' }}
                className="hover:opacity-100">
                {enviando ? '...' : '📷'}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-text-1)' }}>
                {usuario?.displayName || usuario?.username}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-dark-text-2)' }}>@{usuario?.username}</p>
            </div>

            <button onClick={() => fileRef.current?.click()} disabled={enviando}
              className="btn btn-secondary"
              style={{ marginLeft: 'auto', fontSize: '0.78rem', padding: '0.4rem 0.875rem' }}>
              {enviando ? 'Enviando...' : '📷 Mudar foto'}
            </button>
          </div>

          {bio && <p style={{ fontSize: '0.82rem', color: 'var(--color-dark-text-2)', lineHeight: 1.6 }}>{bio}</p>}
        </div>
      </div>

      {/* Input de arquivo oculto — ativado pelo botão e pelo clique no avatar */}
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} onChange={handleAvatar} />

      {/* Formulário de edição */}
      <Secao titulo="✏️ Editar informações">
        <form onSubmit={handleSalvar} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Nome de exibição</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder={usuario?.username}
              maxLength={50}
              className="input"
            />
          </div>
          <div>
            <label style={labelStyle}>Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Conta um pouco sobre você, seus jogos favoritos..."
              maxLength={300}
              className="input"
              style={{ resize: 'vertical', lineHeight: 1.6 }}
            />
            <p style={{ fontSize: '0.68rem', color: 'var(--color-dark-text-3)', marginTop: '0.25rem', textAlign: 'right' }}>
              {bio.length}/300
            </p>
          </div>
          <button type="submit" disabled={salvando} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
            {salvando ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </Secao>

      {/* Dados da conta (somente leitura) */}
      <Secao titulo="🔐 Dados da conta">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <label style={labelStyle}>Username</label>
            <input value={usuario?.username || ''} disabled className="input" />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input value={usuario?.email || ''} disabled className="input" />
          </div>
          <div>
            <label style={labelStyle}>Função</label>
            <div style={{ padding: '0.625rem 1rem', borderRadius: '14px', background: 'var(--color-dark-secondary)', border: '1px solid var(--color-dark-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge badge-brand">
                {usuario?.role === 'ADMIN' ? '👑 Admin' : '🎮 Usuário'}
              </span>
            </div>
          </div>
        </div>
      </Secao>

      {/* Zona de risco */}
      <Secao titulo="⚠️ Zona de risco">
        <div style={{ padding: '1rem', borderRadius: '14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f87171', marginBottom: '0.2rem' }}>Excluir conta</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(248,113,113,0.7)' }}>Esta ação é irreversível</p>
          </div>
          <button className="btn btn-danger" style={{ fontSize: '0.8rem' }} disabled>
            Excluir minha conta
          </button>
        </div>
      </Secao>
    </div>
  )
}
