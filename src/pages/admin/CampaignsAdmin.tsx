import { useState } from 'react'
import { Field } from '../../components/Field'
import { removeCampaign, saveCampaign, useCampaigns } from '../../lib/content'
import type { Campaign } from '../../lib/types'
import { uid } from '../../lib/util'

const blank = (): Campaign => ({ id: uid(), title: '', description: '', discountText: '', active: true, endsAt: '' })

export function CampaignsAdmin() {
  const { data, loading, reload } = useCampaigns()
  const [edit, setEdit] = useState<Campaign | null>(null)
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
        <h2>Kampanyalar</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setEdit(blank())}>Yeni kampanya</button>
      </div>
      <p className="muted">Aktif kampanyalar Sadakat sayfasında görünür; üyeler “Kuponu al” ile kod alır, kodu Kasa sekmesinden kullandırırsınız.</p>
      {msg && <p role="status" className="muted">{msg}</p>}
      {loading && <p className="muted">Yükleniyor…</p>}

      {edit && (
        <form
          className="admin-form card"
          onSubmit={(e) => {
            e.preventDefault()
            const c = edit
            setEdit(null)
            void run(() => saveCampaign(c), 'Kaydedildi')
          }}
        >
          <Field label="Başlık"><input required value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
          <Field label="İndirim metni" hint="Örn. %15 indirim, Ücretsiz tatlı">
            <input required value={edit.discountText} onChange={(e) => setEdit({ ...edit, discountText: e.target.value })} />
          </Field>
          <Field label="Açıklama">
            <textarea rows={2} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} />
          </Field>
          <Field label="Bitiş tarihi (boş bırakılabilir)">
            <input type="date" value={edit.endsAt} onChange={(e) => setEdit({ ...edit, endsAt: e.target.value })} />
          </Field>
          <label className="check"><input type="checkbox" checked={edit.active} onChange={(e) => setEdit({ ...edit, active: e.target.checked })} /> Aktif</label>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit">Kaydet</button>
            <button className="btn btn-ghost" type="button" onClick={() => setEdit(null)}>Vazgeç</button>
          </div>
        </form>
      )}

      <div className="admin-list">
        {data.map((c) => (
          <article key={c.id} className="admin-row">
            <div>
              <h3>{c.title} <span className="tag">{c.discountText}</span></h3>
              <p className="muted">{c.description}{c.endsAt && ` · ${c.endsAt}`}</p>
            </div>
            <div className="row-actions">
              <label className="check">
                <input type="checkbox" checked={c.active} onChange={(e) => run(() => saveCampaign({ ...c, active: e.target.checked }), e.target.checked ? 'Kampanya açıldı' : 'Kampanya kapatıldı')} />
                Aktif
              </label>
              <button className="btn btn-ghost btn-sm" onClick={() => setEdit(c)}>Düzenle</button>
              <button className="btn btn-ghost btn-sm danger" onClick={() => confirm(`“${c.title}” silinsin mi?`) && run(() => removeCampaign(c.id), 'Silindi')}>Sil</button>
            </div>
          </article>
        ))}
        {!loading && data.length === 0 && <p className="muted">Henüz kampanya yok. “Yeni kampanya” ile başlayın.</p>}
      </div>
    </div>
  )
}
