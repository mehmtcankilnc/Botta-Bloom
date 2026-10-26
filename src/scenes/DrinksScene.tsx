import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { HEADER_H } from '../lib/useScene'
import { tl as tlira } from '../lib/util'
import { Bloom, Daisy, Peony, Tulip } from './HeroScene'

const INK = '#2A1B17'

export interface Drink { name: string; note: string; price?: number }

interface GlassProps { id: string; layers: { y: number; color: string }[]; garnish: 'peony' | 'daisy' | 'tulip'; foam?: string }

function Glass({ id, layers, garnish, foam }: GlassProps) {
  const body = 'M22 56 L138 56 L127 330 Q126 346 110 346 H50 Q34 346 33 330 Z'
  return (
    <svg viewBox="0 0 160 380" className="glass" aria-hidden="true">
      <defs>
        <clipPath id={`clip-${id}`}><path d={body} /></clipPath>
      </defs>
      <ellipse cx="80" cy="366" rx="52" ry="8" fill="#000" opacity="0.14" />
      <rect x="104" y="6" width="9" height="150" rx="4.5" fill="#FBF9FB" stroke={INK} strokeWidth="3" transform="rotate(12 108 80)" />
      <g clipPath={`url(#clip-${id})`}>
        <rect x="0" y="56" width="160" height="300" fill="#FBF9FB" opacity="0.7" />
        {layers.map((l, i) => (
          <rect key={i} x="0" y={l.y} width="160" height={360 - l.y} fill={l.color} />
        ))}
        {foam && <rect x="0" y="62" width="160" height="26" fill={foam} />}
        <rect x="44" y="76" width="30" height="30" rx="7" fill="#fff" opacity="0.5" transform="rotate(-12 59 91)" stroke="#fff" strokeWidth="2" />
        <rect x="76" y="96" width="30" height="30" rx="7" fill="#fff" opacity="0.45" transform="rotate(14 91 111)" stroke="#fff" strokeWidth="2" />
        <path d="M44 120 L51 316" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
      </g>
      <path d={body} fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <ellipse cx="80" cy="56" rx="58" ry="8" fill="none" stroke={INK} strokeWidth="4" />
      <svg x="0" y="0" width="160" height="380" viewBox="0 0 160 380" overflow="visible">
        <Bloom x={34} y={52} s={0.36} free>
          {garnish === 'peony' ? <Peony /> : garnish === 'daisy' ? <Daisy /> : <Tulip />}
        </Bloom>
      </svg>
    </svg>
  )
}

const glasses: GlassProps[] = [
  { id: 'cold', layers: [{ y: 96, color: '#3A2218' }], garnish: 'daisy' },
  { id: 'latte', layers: [{ y: 100, color: '#7A4B34' }, { y: 190, color: '#F1E3D3' }], garnish: 'peony' },
  { id: 'matcha', layers: [{ y: 100, color: '#8DAE5C' }, { y: 200, color: '#FBF9FB' }], garnish: 'tulip', foam: '#A7C477' },
  { id: 'mocha', layers: [{ y: 104, color: '#F1E3D3' }, { y: 150, color: '#5A3326' }, { y: 250, color: '#3A2218' }], garnish: 'peony' },
  { id: 'chai', layers: [{ y: 100, color: '#C58F5E' }], garnish: 'daisy', foam: '#EBD3B2' },
]

export function DrinksScene({ drinks }: { drinks: Drink[] }) {
  const ref = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)
  const n = glasses.length

  useEffect(() => {
    const root = ref.current
    const el = track.current
    if (!root || !el) return
    const mm = gsap.matchMedia()

    const place = (p: number) => {
      const pos = p * (n - 1)
      const spacing = Math.min(el.clientWidth * 0.3, 260)
      gsap.utils.toArray<HTMLElement>('.glass-wrap', el).forEach((g, i) => {
        const d = i - pos
        const a = Math.min(Math.abs(d), 2)
        gsap.set(g, {
          x: d * spacing,
          scale: 1 - a * 0.2,
          rotationZ: d * 9,
          rotationY: d * -22,
          opacity: a > 1.6 ? 0 : 1 - a * 0.3,
          zIndex: 10 - Math.round(a * 4),
        })
      })
      const idx = Math.round(pos)
      setActive((cur) => (cur === idx ? cur : idx))
    }

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      place(0)
      st.current = ScrollTrigger.create({
        trigger: root,
        start: `top top+=${HEADER_H}`,
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => place(self.progress),
      })
    })
    mm.add('(prefers-reduced-motion: reduce)', () => place(0))

    return () => {
      mm.revert()
      st.current = null
    }
  }, [n])

  const go = (i: number) => {
    const s = st.current
    if (!s) return setActive(i)
    window.scrollTo({ top: s.start + (i / (n - 1)) * (s.end - s.start), behavior: 'smooth' })
  }

  const d = drinks[active] ?? drinks[0]

  return (
    <section className="scene scene-drinks" ref={ref} aria-label="Kahve">
      <div className="scene-stick">
        <div className="scene-copy drink-copy">
          <h2>Soğuk kahvelerin yanına bir çiçek</h2>
          <div className="drink-info" aria-live="polite">
            <h3>{d?.name}</h3>
            <p>{d?.note}</p>
            {d?.price ? <span className="scene-price">{tlira(d.price)}</span> : null}
          </div>
          <div className="drink-dots" role="tablist" aria-label="İçecekler">
            {glasses.map((g, i) => (
              <button key={g.id} role="tab" aria-selected={active === i} aria-label={drinks[i]?.name} className={active === i ? 'on' : ''} onClick={() => go(i)} />
            ))}
          </div>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/menu">Tüm içecekler</Link>
          </div>
        </div>
        <div className="drink-stage" ref={track}>
          {glasses.map((g) => (
            <div className="glass-wrap" key={g.id}>
              <Glass {...g} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
