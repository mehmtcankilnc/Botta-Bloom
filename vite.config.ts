import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/** Yayın adresini bulur: SITE_URL, yoksa Firebase proje kimliğinden https://<proje>.web.app */
function siteUrl(env: Record<string, string>) {
  const raw = env.VITE_SITE_URL || (env.VITE_FIREBASE_PROJECT_ID ? `https://${env.VITE_FIREBASE_PROJECT_ID}.web.app` : 'http://localhost:5173')
  return raw.replace(/\/+$/, '')
}

/** index.html'deki %SITE_URL% yerlerini doldurur; robots.txt ve sitemap.xml üretir. */
function seo(url: string): Plugin {
  const pages = ['/', '/menu', '/etkinlikler']
  return {
    name: 'botta-seo',
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', url),
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /sadakat\n\nSitemap: ${url}/sitemap.xml\n`,
      })
      const day = new Date().toISOString().slice(0, 10)
      const urls = pages
        .map((p) => `  <url><loc>${url}${p}</loc><lastmod>${day}</lastmod><priority>${p === '/' ? '1.0' : '0.8'}</priority></url>`)
        .join('\n')
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return { plugins: [react(), seo(siteUrl(env))] }
})
