import { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react'

// ============================================
// CONTEXT
// ============================================

const ToastContext = createContext(null)

let externalToast = null

// ============================================
// TOAST ITEM
// ============================================

function ToastItem({ id, message, type = 'info', duration = 3500, onRemove }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), duration - 300)
    return () => clearTimeout(t)
  }, [duration])

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(() => onRemove(id), 300)
      return () => clearTimeout(t)
    }
  }, [visible, id, onRemove])

  const icons = { success: '✓', error: '✕', info: '◆', warning: '⚠' }
  const classes = {
    success: 'toast-success',
    error: 'toast-error',
    info: 'toast-info',
    warning: 'toast toast-warning',
  }

  return (
    <div
      className={`toast ${classes[type]}`}
      style={{
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
      }}
    >
      <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold">
        {icons[type]}
      </span>
      <span>{message}</span>
    </div>
  )
}

// ============================================
// PROVIDER
// ============================================

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const counterRef = useRef(0)

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++counterRef.current
    setToasts(prev => [...prev, { id, message, type, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // expose globally
  useEffect(() => {
    externalToast = addToast
    return () => { externalToast = null }
  }, [addToast])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
        {toasts.map(t => (
          <ToastItem key={t.id} {...t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ============================================
// HOOKS
// ============================================

export function useToast() {
  return useContext(ToastContext)
}

// Call from anywhere (outside React tree)
export const toast = {
  success: (msg, dur) => externalToast?.(msg, 'success', dur),
  error:   (msg, dur) => externalToast?.(msg, 'error', dur),
  info:    (msg, dur) => externalToast?.(msg, 'info', dur),
  warning: (msg, dur) => externalToast?.(msg, 'warning', dur),
}

export default toast
