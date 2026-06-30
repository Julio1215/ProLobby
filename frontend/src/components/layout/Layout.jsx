import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import DiceWidget from '../ui/DiceWidget'

export default function Layout() {
  const location = useLocation()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--color-dark-base)',
    }} className="transition-colors">
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main
          key={location.pathname}
          className="page-enter"
          style={{
            flex: 1,
            padding: '1.5rem',
            maxWidth: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
            background: 'linear-gradient(180deg, #1e1b4b 0%, #2e1065 50%, #0f0a24 100%)',
          }}
        >
          <Outlet />
        </main>
      </div>
      <DiceWidget />
    </div>
  )
}
