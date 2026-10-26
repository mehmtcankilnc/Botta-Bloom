import { useRef, useState } from 'react'
import { uploadImage, uploadsReady } from '../lib/cloudinary'
import { Photo } from './Photo'

/** Admin için fotoğraf alanı: adres yapıştır ya da dosya yükle. */
export function ImageField({ value, onChange, label = 'Fotoğraf' }: { value: string; onChange: (v: string) => void; label?: string }) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const pick = async (file?: File) => {
    if (!file) return
    setBusy(true)
    setErr('')
    try {
      onChange(await uploadImage(file))
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Yüklenemedi')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="field image-field">
      <span className="field-label">{label}</span>
      <div className="image-field-row">
        <Photo src={value} alt="" className="photo-thumb" />
        <div className="image-field-controls">
          <input
            type="url"
            placeholder="Fotoğraf adresi (https://...)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {uploadsReady ? (
            <>
              <button type="button" className="btn btn-ghost btn-sm" disabled={busy} onClick={() => input.current?.click()}>
                {busy ? 'Yükleniyor…' : 'Bilgisayardan yükle'}
              </button>
              <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
            </>
          ) : (
            <small className="muted">Dosya yüklemek için Cloudinary ayarı gerekir (README).</small>
          )}
          {err && <small className="error-text">{err}</small>}
        </div>
      </div>
    </div>
  )
}
