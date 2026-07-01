import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'

import Layout from './components/Layout'

// Páginas com layout completo (Navbar + Sidebar)
import Home from './components/pages/Home'
import Noticias from './components/pages/Noticias'
import QcdScore from './components/pages/QcdScore'
import Reviews from './components/pages/Reviews'
import Rpg from './components/pages/Rpg'
import Mestre from './components/pages/Mestre'
import Perfil from './components/pages/Perfil'
import Comunidade from './components/pages/Comunidade'

// Novas Páginas de e-Sports com o estilo Pro Lobby
import HomeNoticias from './components/pages/HomeNoticias'
import Partidas from './components/pages/Partidas'
import Times from './components/pages/Times'

// Páginas de autenticação (sem Navbar/Sidebar)
import Login from './components/pages/Login'
import Cadastro from './components/pages/Cadastro'
import EsqueciSenha from './components/pages/EsqueciSenha'
import RedefinirSenha from './components/pages/RedefinirSenha'

export default function App() {
  // Aplica o tema salvo no localStorage assim que o app carrega.
  // O tema é 'dark' ou 'light' — adicionamos a classe no <html>.
  useEffect(() => {
    const temaSalvo = localStorage.getItem('hg_theme') || 'dark'
    document.documentElement.classList.add(temaSalvo)
  }, [])

  return (
    <Routes>
      {/* Páginas de autenticação — sem o layout geral */}
      <Route path="/login"           element={<Login />} />
      <Route path="/register"         element={<Cadastro />} />
      <Route path="/forgot-password"  element={<EsqueciSenha />} />
      <Route path="/reset-password"   element={<RedefinirSenha />} />

      {/* Páginas principais — dentro do Layout (Navbar + Sidebar) */}
      <Route path="/" element={<Layout />}>
        {/* Sub-rotas usando paths relativos e limpos */}
        <Route index              element={<Home />} />
        <Route path="news"        element={<Noticias />} />
        <Route path="qcd"         element={<QcdScore />} />
        <Route path="reviews"     element={<Reviews />} />
        <Route path="rpg"         element={<Rpg />} />
        <Route path="mestre"      element={<Mestre />} />
        <Route path="perfil"      element={<Perfil />} />
        <Route path="community"   element={<Comunidade />} />
        
        {/* Seção e-Sports integradas perfeitamente ao Layout */}
        <Route path="esports"     element={<HomeNoticias />} />
        <Route path="matches"     element={<Partidas />} />
        <Route path="teams"       element={<Times />} />
      </Route>
    </Routes>
  )
}