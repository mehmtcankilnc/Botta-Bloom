import { useEffect, useState } from 'react'
import { Field } from '../../components/Field'
import { ImageField } from '../../components/ImageField'
import { saveSettings, useSettings } from '../../lib/content'
import type { SiteSettings } from '../../lib/types'

export function SettingsAdmin() {
  const { data, loading } = useSettings()
  const [s, setS] = useState<SiteSettings>(data)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    setS(data)
  }, [data])

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS((p) => ({ ...p, [k]: v }))
  const text = (k: keyof SiteSettings) => (
    <input value={String(s[k])} onChange={(e) => set(k, e.target.value as never)} />
  )

  const save = async () => {
    setMsg('')
    try {
      await saveSettings(s)
      setMsg('Kaydedildi')
    } catch {
      setMsg('Kaydedilemedi. Yönetici yetkinizi ve bağlantıyı kontrol edin.')
    }
  }

  if (loading) return <p className="muted">Yükleniyor…</p>

  return (
    <div className="admin-form">
      <h2>Site ayarları</h2>
      <Field label="Kafe adı">{text('name')}</Field>
      <Field label="Slogan">{text('tagline')}</Field>
      <Field label="Ana sayfa başlığı">{text('heroTitle')}</Field>
      <Field label="Ana sayfa açıklaması">
        <textarea rows={3} value={s.heroText} onChange={(e) => set('heroText', e.target.value)} />
      </Field>
      <ImageField label="Ana sayfa fotoğrafı" value={s.heroImage} onChange={(v) => set('heroImage', v)} />
      <Field label="Adres">{text('address')}</Field>
      <Field label="Çalışma saatleri">{text('hours')}</Field>
      <Field label="Telefon">{text('phone')}</Field>
      <Field label="Instagram adresi">{text('instagram')}</Field>
      <Field label="Online sipariş adresi">{text('orderUrl')}</Field>
      <Field label="Harita adresi (Google Maps linki)">{text('mapUrl')}</Field>
      <Field label="Ödül için gereken damga sayısı">
        <input type="number" min={2} max={20} value={s.stampGoal} onChange={(e) => set('stampGoal', Math.max(2, Number(e.target.value) || 8))} />
      </Field>
      <Field label="Ödül metni">{text('rewardText')}</Field>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={save}>Kaydet</button>
        {msg && <span role="status" className="muted">{msg}</span>}
      </div>
    </div>
  )
}
