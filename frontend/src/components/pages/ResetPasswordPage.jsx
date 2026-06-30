import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../../services/api'
import AuthPage, { AuthLogo, AuthTitle, AuthError, AuthBtn, AuthField, inputCls } from './AuthPage'

export default function ResetPasswordPage() {
  const [searchParams]          = useSearchParams()
  const token                   = searchParams.get('token')
  const navigate                = useNavigate()
  const [password,  setPassword] = useState('')
  const [confirm,   setConfirm]  = useState('')
  const [done,      setDone]     = useState(false)
  const [error,     setError]    = useState('')
  const [loading,   setLoading]  = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('A senha deve ter pelo menos 8 caracteres.'); return }
    if (password !== confirm) { setError('As senhas não coincidem.'); return }
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password })
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.error || 'Token inválido ou expirado.')
    } finally { setLoading(false) }
  }

  if (!token) return (
    <AuthPage>
      <AuthLogo />
      <AuthError msg="Link inválido." />
      <Link to="/forgot-password" className="text-brand-light hover:underline text-sm text-center">Solicitar novo link</Link>
    </AuthPage>
  )

  return (
    <AuthPage>
      <AuthLogo />
      <AuthTitle>Nova senha</AuthTitle>
      {!done ? (
        <>
          <AuthError msg={error} />
          <form className="flex flex-col gap-4" onSubmit={submit}>
            <AuthField label="Nova senha">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required minLength={8} placeholder="Mínimo 8 caracteres" autoComplete="new-password" className={inputCls} />
            </AuthField>
            <AuthField label="Confirmar senha">
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                required placeholder="••••••••" autoComplete="new-password" className={inputCls} />
            </AuthField>
            <AuthBtn type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar nova senha'}
            </AuthBtn>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="text-5xl">✅</span>
          <p className="text-sm text-light-text-2 dark:text-dark-text-2">Senha alterada! Redirecionando...</p>
          <Link to="/login" className="w-full py-3 bg-brand text-white rounded-app text-center font-semibold hover:bg-brand-light transition-colors">
            Ir para o login
          </Link>
        </div>
      )}
    </AuthPage>
  )
}
