import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoginButton } from '../components/LoginButton'
import { firebaseReady } from '../lib/firebase'
import { CampaignsAdmin } from './admin/CampaignsAdmin'
import { EventsAdmin } from './admin/EventsAdmin'
import { MembersAdmin } from './admin/MembersAdmin'
import { MenuAdmin } from './admin/MenuAdmin'
import { SettingsAdmin } from './admin/SettingsAdmin'
import { usePageMeta } from '../lib/usePageMeta'

const tabs = [
  { id: 'kasa', label: 'Kasa' },
  { id: 'menu', label: 'Menü' },
  { id: 'kampanya', label: 'Kampanyalar' },
  { id: 'etkinlik', label: 'Etkinlikler' },
  { id: 'ayar', label: 'Site ayarları' },
] as const

export function AdminPage() {
  usePageMeta('Yönetim', 'Botta Bloom yönetim paneli.', { noindex: true })
  const { ready, user, isAdmin } = useAuth()
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('kasa')

  if (!firebaseReady)
    return <div className="page"><h1>Yönetim</h1><p className="muted">Önce Firebase'i bağlayın (README → Kurulum).</p></div>
  if (!ready) return <div className="page"><p className="muted">Yükleniyor…</p></div>

  if (!user)
    return (
      <div className="page narrow">
        <h1>Yönetim</h1>
        <p className="lead">Yönetici hesabıyla giriş yapın.</p>
        <LoginButton />
      </div>
    )

  // Yönetici olmayanlar sayfanın varlığını görmez; gerçek koruma firestore.rules içindedir.
  if (!isAdmin) return <Navigate to="/" replace />

  return (
    <div className="page">
      <h1>Yönetim</h1>
      <div className="chips admin-tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`chip ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'kasa' && <MembersAdmin />}
      {tab === 'menu' && <MenuAdmin />}
      {tab === 'kampanya' && <CampaignsAdmin />}
      {tab === 'etkinlik' && <EventsAdmin />}
      {tab === 'ayar' && <SettingsAdmin />}
    </div>
  )
}
