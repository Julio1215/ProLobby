// main.jsx — ponto de entrada da aplicação
//
// O que foi simplificado:
// - Removido QueryClientProvider (@tanstack/react-query)
//   → Não precisamos mais. Cada página busca seus próprios dados com useEffect.
// - Removido ToastProvider
//   → Substituído por mensagens de estado inline em cada página.
// - Adicionado AuthProvider
//   → Disponibiliza os dados do usuário logado para toda a árvore de componentes.

import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)
