import { useMemo, useState } from 'react'
import { Photo } from '../components/Photo'
import { useMenu, useSettings } from '../lib/content'
import { tl } from '../lib/util'
import { usePageMeta } from '../lib/usePageMeta'

export function MenuPage() {
  usePageMeta('Menü', "Botta Bloom menüsü: taze demlenen kahveler, soğuk içecekler, el yapımı mini burger ve tatlılar. Adana Cemalpaşa'da.")
  const { data: menu, loading } = useMenu()
  const { data: s } = useSettings()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')

  const groups = useMemo(() => {
    const needle = q.trim().toLocaleLowerCase('tr')
    return menu.categories
      .filter((c) => cat === 'all' || c.id === cat)
      .map((c) => ({
        ...c,
        items: menu.items.filter(
          (i) =>
            i.categoryId === c.id &&
            (!needle || (i.name + ' ' + i.description).toLocaleLowerCase('tr').includes(needle)),
        ),
      }))
      .filter((g) => g.items.length > 0)
  }, [menu, cat, q])

  return (
    <div className="page">
      <h1>Menü</h1>

      <div className="menu-tools">
        <div className="chips" role="tablist" aria-label="Kategoriler">
          <button className={`chip ${cat === 'all' ? 'on' : ''}`} onClick={() => setCat('all')}>Tümü</button>
          {menu.categories.map((c) => (
            <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>
              {c.name}
            </button>
          ))}
        </div>
        <input
          type="search"
          className="search"
          placeholder="Menüde ara"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Menüde ara"
        />
      </div>

      {loading && <p className="muted">Menü yükleniyor…</p>}
      {!loading && groups.length === 0 && <p className="muted">Aramanızla eşleşen ürün bulunamadı.</p>}

      {groups.map((g) => (
        <section key={g.id} className="menu-group">
          <h2>{g.name}</h2>
          <div className="menu-grid">
            {g.items.map((i) => (
              <article key={i.id} className={`menu-item ${i.available ? '' : 'sold-out'}`}>
                <Photo src={i.image} alt={i.name} className="photo-thumb" />
                <div className="menu-item-body">
                  <h3>{i.name}</h3>
                  {i.description && <p>{i.description}</p>}
                </div>
                <div className="menu-item-price">
                  {i.available ? tl(i.price) : <span className="muted">Tükendi</span>}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {s.orderUrl && (
        <p className="order-note">
          Eve sipariş için <a href={s.orderUrl} target="_blank" rel="noreferrer">Trendyol Go'da bizi bulun</a>. Yerinde fiyatlar değişebilir.
        </p>
      )}
    </div>
  )
}
