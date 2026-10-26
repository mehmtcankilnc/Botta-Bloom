export const tl = (n: number) => `${n.toLocaleString('tr-TR')} ₺`

export const uid = () => Math.random().toString(36).slice(2, 10)

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export function shortCode(len = 6) {
  let s = ''
  for (let i = 0; i < len; i++) s += ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  return s
}

export function formatDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })
}

export const todayISO = () => {
  const d = new Date()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}
