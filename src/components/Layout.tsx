import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../lib/content'
import { firebaseReady } from '../lib/firebase'
import { Footer } from './Footer'
import { LoginButton } from './LoginButton'

export function Layout() {
  const { isAdmin } = useAuth()
  const { data: s } = useSettings()

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand" aria-label={`${s.name} ana sayfa`}>
          {s.name}
        </Link>
        <nav className="main-nav" aria-label="Ana menü">
          <NavLink to="/menu">Menü</NavLink>
          <NavLink to="/etkinlikler">Etkinlikler</NavLink>
          <NavLink to="/sadakat">Sadakat</NavLink>
          {isAdmin && <NavLink to="/admin">Yönetim</NavLink>}
        </nav>
        <div className="header-actions">
          <LoginButton compact />
        </div>
      </header>

      {!firebaseReady && (
        <div className="demo-bar">
          Demo modu: Firebase henüz bağlı değil, içerik örnek verilerden geliyor. Giriş ve yönetim paneli için README’deki kurulumu yapın.
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <Footer s={s} />
    </>
  )
}
