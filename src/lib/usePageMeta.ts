import { useEffect } from 'react'

function setMeta(sel: string, attr: string, value: string) {
  const el = document.head.querySelector(sel)
  if (el) el.setAttribute(attr, value)
}

/** Sayfa başına başlık, açıklama ve canonical adresini günceller (tek sayfa uygulamada SEO için). */
export function usePageMeta(title: string, description: string, opts: { noindex?: boolean } = {}) {
  useEffect(() => {
    const full = title.includes('Botta Bloom') ? title : `${title} | Botta Bloom`
    document.title = full
    const url = `${window.location.origin}${window.location.pathname}`
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', full)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('meta[name="twitter:title"]', 'content', full)
    setMeta('meta[name="twitter:description"]', 'content', description)
    setMeta('link[rel="canonical"]', 'href', url)
    setMeta('meta[name="robots"]', 'content', opts.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
  }, [title, description, opts.noindex])
}
