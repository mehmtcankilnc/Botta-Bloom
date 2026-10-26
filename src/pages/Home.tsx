import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Photo } from '../components/Photo'
import { ScrollTrigger } from '../lib/gsap'
import { useEvents, useMenu, useSettings } from '../lib/content'
import { formatDate, tl, todayISO } from '../lib/util'
import { BurgerScene } from '../scenes/BurgerScene'
import { DrinksScene, type Drink } from '../scenes/DrinksScene'
import { HeroScene } from '../scenes/HeroScene'
import { usePageMeta } from '../lib/usePageMeta'

const drinkPlan: { match: string; note: string }[] = [
  { match: 'Cold Brew', note: '18 saatte demlenir, portakal ve çubuk tarçınla servis edilir.' },
  { match: 'Ice Latte', note: 'Espresso, süt ve bol buz.' },
  { match: 'Ice Matcha Latte', note: 'Matcha ve soğuk süt.' },
  { match: 'Ice Mocha', note: 'Espresso, çikolata ve süt.' },
  { match: 'Ice Chai Latte', note: 'Tarçınla servis edilir.' },
]

export function Home() {
  usePageMeta("Botta Bloom | Adana Cemalpaşa'da kahve, mutfak ve çiçek", "Botta Bloom, Adana Cemalpaşa'da kahve, el yapımı mutfak ve çiçeklerin bir arada olduğu butik kafe. Menüyü inceleyin, etkinlikleri görün, damga kartıyla kahve kazanın.")
  const { data: s } = useSettings()
  const { data: menu } = useMenu()
  const { data: events } = useEvents()

  // Veri geldikçe sayfa yüksekliği değişebilir; kaydırma noktalarını yeniden hesapla.
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 300)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => clearTimeout(t)
  }, [menu, events])

  const burger = menu.items.find((i) => i.name === "Etli Mini Burger 5'li")
  const drinks: Drink[] = drinkPlan.map((d) => {
    const item = menu.items.find((i) => i.name === d.match)
    return { name: item?.name ?? d.match, note: item?.description || d.note, price: item?.price }
  })
  const featured = menu.items.filter((i) => i.featured && i.available).slice(0, 6)
  const upcoming = events.filter((e) => e.active && e.date >= todayISO()).slice(0, 3)

  return (
    <>
      <HeroScene title={s.heroTitle} text={s.heroText} />
      <BurgerScene price={burger?.price} />
      <DrinksScene drinks={drinks} />

      <div className="scene scene-plain">
        <div className="wrap">
          {featured.length > 0 && (
            <section className="section">
              <div className="section-head">
                <h2>En çok sevilenler</h2>
                <Link to="/menu" className="link">Tüm menü</Link>
              </div>
              <div className="featured-grid">
                {featured.map((i) => (
                  <article key={i.id} className="featured-card">
                    <Photo src={i.image} alt={i.name} />
                    <h3>{i.name}</h3>
                    <span className="price">{tl(i.price)}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section className="section">
            <div className="section-head">
              <h2>Yaklaşan etkinlikler</h2>
              <Link to="/etkinlikler" className="link">Hepsi</Link>
            </div>
            {upcoming.length === 0 ? (
              <p className="muted">Şimdilik planlı etkinlik yok. Yenilerini Instagram'dan da duyuruyoruz.</p>
            ) : (
              <div className="event-list">
                {upcoming.map((e) => (
                  <article key={e.id} className="event-row">
                    <Photo src={e.image} alt={e.title} className="photo-thumb" />
                    <div>
                      <h3>{e.title}</h3>
                      <p className="muted">{formatDate(e.date)}{e.time && ` · ${e.time}`}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="section rewards-teaser">
            <h2>Her {s.stampGoal}. ziyarette: {s.rewardText.toLowerCase()}</h2>
            <p>Google hesabınızla giriş yapın, her siparişte damga toplayın, kampanya kuponlarını telefonunuzdan alın.</p>
            <Link className="btn btn-primary" to="/sadakat">Kartımı aç</Link>
          </section>
        </div>
      </div>
    </>
  )
}
