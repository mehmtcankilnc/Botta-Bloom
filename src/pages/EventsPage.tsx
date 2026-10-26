import { Photo } from '../components/Photo'
import { useEvents, useSettings } from '../lib/content'
import { formatDate, todayISO } from '../lib/util'
import { usePageMeta } from '../lib/usePageMeta'

export function EventsPage() {
  usePageMeta('Etkinlikler', "Botta Bloom'da yaklaşan etkinlikler, atölyeler ve buluşmalar. Adana Cemalpaşa'da çiçekler ve kahve eşliğinde.")
  const { data: events, loading } = useEvents()
  const { data: s } = useSettings()
  const today = todayISO()
  const upcoming = events.filter((e) => e.active && e.date >= today)
  const past = events.filter((e) => e.active && e.date < today).reverse().slice(0, 6)

  return (
    <div className="page">
      <h1>Etkinlikler</h1>
      {loading && <p className="muted">Yükleniyor…</p>}

      {!loading && upcoming.length === 0 && (
        <p className="muted">
          Yaklaşan etkinlik yok. Yeni duyuruları{' '}
          <a href={s.instagram} target="_blank" rel="noreferrer">Instagram'dan</a> takip edin.
        </p>
      )}

      <div className="event-cards">
        {upcoming.map((e) => (
          <article key={e.id} className="event-card">
            <Photo src={e.image} alt={e.title} />
            <div>
              <p className="event-date">{formatDate(e.date)}{e.time && ` · ${e.time}`}</p>
              <h2>{e.title}</h2>
              {e.description && <p>{e.description}</p>}
            </div>
          </article>
        ))}
      </div>

      {past.length > 0 && (
        <>
          <h2 className="subhead">Geçmiş etkinlikler</h2>
          <div className="event-list">
            {past.map((e) => (
              <article key={e.id} className="event-row">
                <Photo src={e.image} alt={e.title} className="photo-thumb" />
                <div>
                  <h3>{e.title}</h3>
                  <p className="muted">{formatDate(e.date)}</p>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
