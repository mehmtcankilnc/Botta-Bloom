import { useState } from 'react'
import { Field } from '../../components/Field'
import { ImageField } from '../../components/ImageField'
import { removeEvent, saveEvent, useEvents } from '../../lib/content'
import type { CafeEvent } from '../../lib/types'
import { formatDate, todayISO, uid } from '../../lib/util'

const blank = (): CafeEvent => ({ id: uid(), title: '', description: '', date: todayISO(), time: '', image: '', active: true })

export function EventsAdmin() {
  const { data, loading, reload } = useEvents()
  const [edit, setEdit] = useState<CafeEvent | null>(null)
  const [msg, setMsg] = useState('')

  const run = async (fn: () => Promise<void>, ok: string) => {
    setMsg('')
    try {
      await fn()
      await reload()
      setMsg(ok)
    } catch {
      setMsg('İşlem yapılamadı. Yönetici yetkinizi kontrol edin.')
    }
  }

  return (
    <div>
      <div className="section-head">
        <h2>Etkinlikler</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setEdit(blank())}>Yeni etkinlik</button>
      </div>
      {msg && <p role="status" className="muted">{msg}</p>}
      {loading && <p className="muted">Yükleniyor…</p>}

      {edit && (
        <form
          className="admin-form card"
          onSubmit={(e) => {
            e.preventDefault()
            const ev = edit
            setEdit(null)
            void run(() => saveEvent(ev), 'Kaydedildi')
          }}
        >
          <Field label="Etkinlik adı"><input required value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
          <div className="two-col">
            <Field label="Tarih"><input required type="date" value={edit.date} onChange={(e) => setEdit({ ...edit, date: e.target.value })} /></Field>
            <Field label="Saat"><input type="time" value={edit.time} onChange={(e) => setEdit({ ...edit, time: e.target.value })} /></Field>
          </div>
          <Field label="Açıklama">
            <textarea rows={3} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
          </Field>
          <ImageField value={edit.image} onChange={(v) => setEdit({ ...edit, image: v })} />
          <label className="check"><input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Sitede göster</label>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">Kaydet</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEdit(null)}>Vazgeç</button>
          </div>
        </form>
      )}

      <div className="admin-list">
        {[...data].reverse().map((e) => (
          <article key={e.id} className="admin-row">
            <div>
              <h3>{e.title} {!e.active && <span className="tag">Gizli</span>}</h3>
              <p className="muted">{formatDate(e.date)}{e.time && ` · ${e.time}`}</p>
            </div>
            <div className="row-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setEdit(e)}>Düzenle</button>
              <button className="btn btn-ghost btn-sm danger" onClick={() => confirm(`“${e.title}” silinsin mi?`) && run(() => removeEvent(e.id), 'Silindi')}>Sil</button>
            </div>
          </article>
        ))}
        {!loading && data.length === 0 && <p className="muted">Henüz etkinlik yok. Instagram'daki etkinlikleri buraya ekleyin.</p>}
      </div>
    </div>
  )
}
