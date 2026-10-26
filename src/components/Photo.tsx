import { useState } from 'react'

/** Kemerli (çiçekçi vitrini) fotoğraf çerçevesi. Fotoğraf yoksa ya da açılmazsa çiçek motifi gösterir. */
export function Photo({ src, alt, className = '' }: { src?: string; alt: string; className?: string }) {
  const [broken, setBroken] = useState(false)
  return (
    <div className={`photo ${className}`}>
      {src && !broken ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setBroken(true)} />
      ) : (
        <svg viewBox="0 0 64 64" aria-hidden="true" className="photo-fallback">
          <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="32" cy="28" r="4" />
            <path d="M32 24c-6-10 4-14 0-18-4 4 6 8 0 18Zm4 4c10-6 14 4 18 0-4-4-8 6-18 0Zm-4 4c6 10-4 14 0 18 4-4-6-8 0-18Zm-4-4c-10 6-14-4-18 0 4 4 8-6 18 0Z" />
            <path d="M32 36v22M32 48c-6-2-9-6-9-10M32 52c5-1 9-4 10-8" />
          </g>
        </svg>
      )}
    </div>
  )
}
