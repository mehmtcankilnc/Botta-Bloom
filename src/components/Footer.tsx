import { useEffect, useState } from 'react'
import type { SiteSettings } from '../lib/types'
import { FooterGarden } from './FooterGarden'

/** "09:00 – 23:00" gibi saat aralığını okuyup şu an açık mı hesaplar. Okuyamazsa null döner. */
function openStatus(hours: string, now: Date) {
  const m = hours.match(/(\d{1,2})[:.](\d{2})\s*[–—-]\s*(\d{1,2})[:.](\d{2})/)
  if (!m) return null
  const open = +m[1] * 60 + +m[2]
  const close = +m[3] * 60 + +m[4]
  const cur = now.getHours() * 60 + now.getMinutes()
  const isOpen = close <= open ? cur >= open || cur < close : cur >= open && cur < close
  return { isOpen, until: `${m[3].padStart(2, '0')}:${m[4]}`, from: `${m[1].padStart(2, '0')}:${m[2]}` }
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      setTimeout(() => setDone(false), 1800)
    } catch {
      /* pano erişimi yoksa sessizce geç */
    }
  }
  return (
    <button className="copy-btn" onClick={copy} aria-label={`${label} kopyala`}>
      {done ? 'Kopyalandı' : 'Kopyala'}
    </button>
  )
}

export function Footer({ s }: { s: SiteSettings }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])
  const status = openStatus(s.hours, now)
  const tel = s.phone.replace(/[^\d+]/g, '')

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <h2 className="footer-title">Bir kahveye, bir çiçeğe bekleriz</h2>

        <div className="footer-cols">
          <div className="fcol">
            <p className="fcol-label">Çalışma saatleri</p>
            {status && (
              <p className={`open-chip ${status.isOpen ? 'on' : ''}`} role="status">
                <span className="pulse" aria-hidden="true" />
                {status.isOpen ? `Şu an açığız, ${status.until}'e kadar` : `Şu an kapalıyız, ${status.from}'de açılıyoruz`}
              </p>
            )}
            <p className="footer-hours">{s.hours}</p>
          </div>

          <div className="fcol footer-contact">
            <p className="fcol-label">Adres</p>
            <p>
              {s.address} <CopyButton text={s.address} label="Adresi" />
            </p>
            {s.phone && (
              <p>
                <a href={`tel:${tel}`}>{s.phone}</a> <CopyButton text={s.phone} label="Telefonu" />
              </p>
            )}
          </div>

          <nav className="fcol" aria-label="Bağlantılar">
            <p className="fcol-label">Bizi bulun</p>
            <div className="footer-links">
            {s.mapUrl && <a href={s.mapUrl} target="_blank" rel="noreferrer">Yol tarifi</a>}
            {s.instagram && <a href={s.instagram} target="_blank" rel="noreferrer">Instagram</a>}
            {s.orderUrl && <a href={s.orderUrl} target="_blank" rel="noreferrer">Eve sipariş (Trendyol Go)</a>}
            </div>
          </nav>
        </div>
      </div>

      <FooterGarden name={s.name} />

    </footer>
  )
}
