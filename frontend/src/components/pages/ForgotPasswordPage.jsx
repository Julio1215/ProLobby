import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import AuthPage, { AuthLogo, AuthTitle, AuthError, AuthBtn, AuthField, inputCls } from './AuthPage'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [devLink, setDevLink] = useState(null)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/forgot-password', { email })
      setSent(true)
      if (data.devToken) setDevLink(`/reset-password?token=${data.devToken}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthPage>
      <AuthLogo />
      <AuthTitle>Recuperar senha</AuthTitle>

      {!sent ? (
        <>
          <p className="text-sm text-light-text-2 dark:text-dark-text-2 leading-relaxed">
            Digite seu email e enviaremos um link para redefinir sua senha.
          </p>
          <AuthError msg={error} />
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <AuthField label="Email">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="seu@email.com" autoComplete="email" className={inputCls} />
            </AuthField>
            <AuthBtn type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar link'}
            </AuthBtn>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="text-5xl">✉️</span>
          <p className="text-sm text-light-text-2 dark:text-dark-text-2 leading-relaxed">
            Se este email estiver cadastrado, você receberá as instruções em breve.
          </p>
          {devLink && (
            <div className="w-full p-3 bg-brand/10 border border-brand/25 rounded-app text-sm text-center flex flex-col gap-1.5">
              <span className="text-light-text-3 dark:text-dark-text-3">🛠️ Modo dev — link de reset:</span>
              <Link to={devLink} className="text-brand-light font-semibold hover:underline">
                Clique aqui para redefinir →
              </Link>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-sm text-light-text-2 dark:text-dark-text-2">
        Lembrou a senha?{' '}
        <Link to="/login" className="text-brand-light hover:underline">Voltar ao login</Link>
      </p>
    </AuthPage>
  )
}
