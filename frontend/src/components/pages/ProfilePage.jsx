import { useState, useRef } from 'react'
import useAuthStore from '../../store/authStore'
import api, { getAssetUrl } from '../../services/api'
import toast from '../ui/Toast'

const LABEL = 'text-xs font-semibold uppercase tracking-widest mb-1.5 block'
const labelStyle = { fontSize: '0.72rem', fontWeight: 700, color: 'rgba(240,238,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '0.35rem' }

function Section({ title, children }) {
  return (
    <div style={{
      background: 'var(--color-dark-card)',
      border: '1px solid var(--color-dark-border)',
      borderRadius: '20px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
    }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-text-1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [displayName, setDisplayName] = useState(user?.displayName || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.patch('/users/me', { displayName, bio })
      updateUser(res.data.user)
      toast.success('Perfil atualizado!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar.')
    } finally { setSaving(false) }
  }

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('avatar', file)
      const res = await api.post('/users/me/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      updateUser(res.data.user)
      toast.success('Foto atualizada!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao enviar a foto.')
    } finally { setUploading(false); e.target.value = '' }
  }

  const avatar = user?.avatarUrl ? getAssetUrl(user.avatarUrl) : null
  const initial = (user?.displayName || user?.username || 'U')[0].toUpperCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>

      {/* Page title */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-dark-text-1)', marginBottom: '0.3rem' }}>
          👤 Meu Perfil
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-dark-text-2)' }}>Gerencie sua conta e personalize seu perfil</p>
      </div>

      {/* Profile card preview */}
      <div style={{
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid var(--color-dark-border)',
      }}>
        {/* Banner */}
        <div style={{
          height: '100px',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.5) 0%, rgba(191,0,255,0.3) 50%, rgba(0,229,255,0.2) 100%)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(45deg, rgba(124,58,237,0.05) 0px, rgba(124,58,237,0.05) 1px, transparent 1px, transparent 20px)',
          }} />
        </div>

        {/* Avatar + info */}
        <div style={{
          background: 'var(--color-dark-card)',
          padding: '0 1.5rem 1.5rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', marginTop: '-36px', marginBottom: '0.875rem' }}>
            {/* Avatar */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #bf00ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.6rem', fontWeight: 800, color: 'white',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '3px solid var(--color-dark-card)',
                boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {avatar
                ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initial
              }
              {/* Hover overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
                opacity: 0,
                transition: 'opacity 0.2s',
              }}
              className="hover:opacity-100"
              >
                {uploading ? '...' : '📷'}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-dark-text-1)' }}>
                {user?.displayName || user?.username}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--color-dark-text-2)' }}>
                @{user?.username}
              </p>
            </div>

            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn btn-secondary"
              style={{ marginLeft: 'auto', fontSize: '0.78rem', padding: '0.4rem 0.875rem' }}
            >
              {uploading ? 'Enviando...' : '📷 Mudar foto'}
            </button>
          </div>

          {bio && (
            <p style={{ fontSize: '0.82rem', color: 'var(--color-dark-text-2)', lineHeight: 1.6 }}>{bio}</p>
          )}
        </div>
      </div>

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" style={{ display: 'none' }} onChange={handleAvatar} />

      {/* Edit form */}
      <Section title="✏️ Editar informações">
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Nome de exibição</label>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder={user?.username}
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

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start' }}
          >
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </form>
      </Section>

      {/* Account info */}
      <Section title="🔐 Dados da conta">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <label style={labelStyle}>Username</label>
            <input value={user?.username || ''} disabled className="input" />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input value={user?.email || ''} disabled className="input" />
          </div>
          <div>
            <label style={labelStyle}>Função</label>
            <div style={{
              padding: '0.625rem 1rem',
              borderRadius: '14px',
              background: 'var(--color-dark-secondary)',
              border: '1px solid var(--color-dark-border)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span className="badge badge-brand">{user?.role === 'ADMIN' ? '👑 Admin' : '🎮 Usuário'}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Danger zone */}
      <Section title="⚠️ Zona de risco">
        <div style={{
          padding: '1rem',
          borderRadius: '14px',
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f87171', marginBottom: '0.2rem' }}>Excluir conta</p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(248,113,113,0.7)' }}>Esta ação é irreversível</p>
          </div>
          <button className="btn btn-danger" style={{ fontSize: '0.8rem' }} disabled>
            Excluir minha conta
          </button>
        </div>
      </Section>
    </div>
  )
}
