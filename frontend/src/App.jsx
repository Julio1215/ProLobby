import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './components/pages/Dashboard'
import NewsPage from './components/pages/NewsPage'
import QcdPage from './components/pages/QcdPage'
import ReviewsPage from './components/pages/ReviewsPage'
import RpgPage from './components/pages/RpgPage'
import ProfilePage from './components/pages/ProfilePage'
import CommunityPage from './components/pages/CommunityPage'
import MestrePage from './components/pages/MestrePage'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import ForgotPasswordPage from './components/pages/ForgotPasswordPage'
import ResetPasswordPage from './components/pages/ResetPasswordPage'
import useThemeStore from './store/themeStore'

export default function App() {
  useEffect(() => {
    useThemeStore.getState().initTheme()
  }, [])

  return (
    <Routes>
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      <Route path="/" element={<Layout />}>
        <Route index            element={<Dashboard />} />
        <Route path="news"      element={<NewsPage />} />
        <Route path="qcd"       element={<QcdPage />} />
        <Route path="reviews"   element={<ReviewsPage />} />
        <Route path="rpg"       element={<RpgPage />} />
        <Route path="mestre"    element={<MestrePage />} />
        <Route path="perfil"    element={<ProfilePage />} />
        <Route path="community" element={<CommunityPage />} />
      </Route>
    </Routes>
  )
}
