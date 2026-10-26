import { useEffect, useState } from 'react'
import { Field } from '../../components/Field'
import { ImageField } from '../../components/ImageField'
import { saveMenu, useMenu } from '../../lib/content'
import { seedMenu } from '../../lib/seed'
import type { MenuDoc, MenuItem } from '../../lib/types'
import { tl, uid } from '../../lib/util'

function move<T>(arr: T[], from: number, to: number) {
  if (to < 0 || to >= arr.length) return arr
  const a = [...arr]
  a.splice(to, 0, a.splice(from, 1)[0])
  return a
}

export function MenuAdmin() {
  const { data, loading } = useMenu()
  const [menu, setMenu] = useState<MenuDoc>(data)
  const [dirty, setDirty] = useState(false)
  const [msg, setMsg] = useState('')
  const [cat, setCat] = useState('')
  const [open, setOpen] = useState('')

  useEffect(() => {
    setMenu(data)
    setCat((c) => c || data.categories[0]?.id || '')
  }, [data])

  const change = (m: MenuDoc) => {
    setMenu(m)
    setDirty(true)
    setMsg('')
  }

  const setItem = (id: string, patch: Partial<MenuItem>) =>
    change({ ...menu, items: menu.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })

  const addItem = () => {
    if (!cat) return
    const item: MenuItem = { id: uid(), name: 'Yeni ürün', description: '', price: 0, categoryId: cat, image: '', featured: false, available: true }
    change({ ...menu, items: [...menu.items, item] })
    setOpen(item.id)
  }

  const moveItem = (id: string, dir: -1 | 1) => {
    const siblings = menu.items.filter((i) => i.categoryId === cat)
    const idx = siblings.findIndex((i) => i.id === id)
    const target = siblings[idx + dir]
    if (!target) return
    const a = menu.items.findIndex((i) => i.id === id)
    const b = menu.items.findIndex((i) => i.id === target.id)
    change({ ...menu, items: move(menu.items, a, b) })
  }

  const save = async () => {
    setMsg('')
    try {
      await saveMenu(menu)
      setDirty(false)
      setMsg('Menü kaydedildi, sitede yayında.')
    } catch {
      setMsg('Kaydedilemedi. Yönetici yetkinizi ve bağlantıyı kontrol edin.')
    }
  }

  if (loading) return <p className="muted">Yükleniyor…</p>

  const items = menu.items.filter((i) => i.categoryId === cat)

  return (
    <div>
      <div className="section-head">
        <h2>Menü</h2>
        <div className="row-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => confirm('Mevcut menü silinip Trendyol Go menüsü yüklensin mi?') && (change(seedMenu), setCat(seedMenu.categories[0].id))}
          >
            Trendyol Go menüsünü yükle
          </button>
          <button className="btn btn-primary btn-sm" disabled={!dirty} onClick={save}>Kaydet ve yayınla</button>
        </div>
      </div>
      {msg && <p role="status" className="muted">{msg}</p>}
      {dirty && <p className="notice">Kaydedilmemiş değişiklikler var.</p>}

      <div className="chips">
        {menu.categories.map((c) => (
          <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`} onClick={() => setCat(c.id)}>{c.name}</button>
        ))}
        <button
          className="chip"
          onClick={() => {
            const name = prompt('Yeni kategori adı (örn. Sıcak Kahveler, Çiçek Aranjmanları)')?.trim()
            if (name) {
              const c = { id: uid(), name }
              change({ ...menu, categories: [...menu.categories, c] })
              setCat(c.id)
            }
          }}
        >
          + Kategori
        </button>
      </div>

      {cat && (
        <div className="cat-tools">
          <button className="btn btn-ghost btn-sm" onClick={() => {
            const cur = menu.categories.find((c) => c.id === cat)!
            const name = prompt('Kategori adı', cur.name)?.trim()
            if (name) change({ ...menu, categories: menu.categories.map((c) => (c.id === cat ? { ...c, name } : c)) })
          }}>Adı değiştir</button>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            const i = menu.categories.findIndex((c) => c.id === cat)
            change({ ...menu, categories: move(menu.categories, i, i - 1) })
          }}>Öne al</button>
          <button className="btn btn-ghost btn-sm" onClick={() => {
            const i = menu.categories.findIndex((c) => c.id === cat)
            change({ ...menu, categories: move(menu.categories, i, i + 1) })
          }}>Arkaya al</button>
          <button className="btn btn-ghost btn-sm danger" onClick={() => {
            if (items.length) return alert('Önce kategorideki ürünleri silin veya başka kategoriye taşıyın.')
            if (confirm('Kategori silinsin mi?')) {
              const rest = menu.categories.filter((c) => c.id !== cat)
              change({ ...menu, categories: rest })
              setCat(rest[0]?.id ?? '')
            }
          }}>Kategoriyi sil</button>
          <button className="btn btn-primary btn-sm" onClick={addItem}>+ Ürün ekle</button>
        </div>
      )}

      <div className="admin-list">
        {items.map((i) => (
          <article key={i.id} className="admin-row column">
            <div className="admin-row-top">
              <div>
                <h3>{i.name} {i.featured && <span className="tag">Öne çıkan</span>} {!i.available && <span className="tag">Tükendi</span>}</h3>
                <p className="muted">{tl(i.price)}</p>
              </div>
              <div className="row-actions">
                <button className="btn btn-ghost btn-sm" aria-label="Yukarı" onClick={() => moveItem(i.id, -1)}>↑</button>
                <button className="btn btn-ghost btn-sm" aria-label="Aşağı" onClick={() => moveItem(i.id, 1)}>↓</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setOpen(open === i.id ? '' : i.id)}>{open === i.id ? 'Kapat' : 'Düzenle'}</button>
              </div>
            </div>

            {open === i.id && (
              <div className="admin-form">
                <Field label="Ürün adı"><input value={i.name} onChange={(e) => setItem(i.id, { name: e.target.value })} /></Field>
                <div className="two-col">
                  <Field label="Fiyat (₺)"><input type="number" min={0} value={i.price} onChange={(e) => setItem(i.id, { price: Number(e.target.value) || 0 })} /></Field>
                  <Field label="Kategori">
                    <select value={i.categoryId} onChange={(e) => setItem(i.id, { categoryId: e.target.value })}>
                      {menu.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </Field>
                </div>
                <Field label="Açıklama"><textarea rows={3} value={i.description} onChange={(e) => setItem(i.id, { description: e.target.value })} /></Field>
                <ImageField value={i.image} onChange={(v) => setItem(i.id, { image: v })} />
                <div className="checks">
                  <label className="check"><input type="checkbox" checked={i.available} onChange={(e) => setItem(i.id, { available: e.target.checked })} /> Satışta</label>
                  <label className="check"><input type="checkbox" checked={i.featured} onChange={(e) => setItem(i.id, { featured: e.target.checked })} /> Ana sayfada öne çıkar</label>
                </div>
                <button className="btn btn-ghost btn-sm danger" onClick={() => confirm(`“${i.name}” silinsin mi?`) && change({ ...menu, items: menu.items.filter((x) => x.id !== i.id) })}>Ürünü sil</button>
              </div>
            )}
          </article>
        ))}
        {items.length === 0 && <p className="muted">Bu kategoride ürün yok.</p>}
      </div>
    </div>
  )
}
