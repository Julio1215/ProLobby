// Wrapper de layout para páginas de auth (Login, Register, etc.)
export default function AuthPage({ children }) {
  return (
    <div className="min-h-screen bg-light-base dark:bg-dark-base flex items-center justify-center p-4 transition-colors">
      <div className="w-full max-w-md bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-app-lg p-8 flex flex-col gap-5 shadow-2xl">
        {children}
      </div>
    </div>
  )
}

export function AuthLogo() {
  return (
    <div className="text-center font-display font-bold text-2xl tracking-wide text-light-text-1 dark:text-dark-text-1">
      🎮 <span>HUB</span><span className="text-brand-light">GAMER</span>
    </div>
  )
}

export function AuthTitle({ children }) {
  return <h1 className="text-2xl font-bold text-light-text-1 dark:text-dark-text-1">{children}</h1>
}

export function AuthError({ msg }) {
  if (!msg) return null
  return <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-app text-red-400 text-sm">{msg}</div>
}

export function AuthBtn({ children, loading, ...props }) {
  return (
    <button
      {...props}
      className="w-full py-3 bg-brand hover:bg-brand-light disabled:opacity-60 disabled:cursor-not-allowed rounded-app text-white font-semibold text-base transition-colors"
    >
      {children}
    </button>
  )
}

export function AuthField({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-light-text-3 dark:text-dark-text-3 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}

export const inputCls = "w-full px-3.5 py-2.5 bg-light-secondary dark:bg-dark-secondary border border-light-border dark:border-dark-border rounded-app text-light-text-1 dark:text-dark-text-1 text-sm focus:border-brand outline-none transition-colors placeholder:text-light-text-3 dark:placeholder:text-dark-text-3"
