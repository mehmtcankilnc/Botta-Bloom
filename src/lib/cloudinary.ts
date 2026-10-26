const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined
const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined

export const uploadsReady = Boolean(cloud && preset)

/** Fotoğrafı Cloudinary'ye yükler, optimize edilmiş (WebP/AVIF, max 1000px) adresi döner. */
export async function uploadImage(file: File): Promise<string> {
  if (!cloud || !preset) throw new Error('Fotoğraf yükleme ayarlanmamış')
  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', preset)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body })
  if (!res.ok) throw new Error('Fotoğraf yüklenemedi')
  const data = await res.json()
  return (data.secure_url as string).replace('/upload/', '/upload/f_auto,q_auto,w_1000/')
}
