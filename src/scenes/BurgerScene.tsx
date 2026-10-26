import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../lib/gsap'
import { useScene } from '../lib/useScene'
import { tl as tlira } from '../lib/util'

const INK = '#2A1B17'
const BUN = '#C98B4A'


const ingredients = [
  { name: 'El yapımı mini ekmek', color: BUN },
  { name: 'Botta özel sos', color: '#E8A27C' },
  { name: 'Göbek marul', color: '#7C9A66' },
  { name: 'Domates', color: '#C93A4A' },
  { name: 'Cheddar', color: '#E9A23B' },
  { name: 'El yapımı köfte, 150 gr', color: '#5A3326' },
]

function Layer({ id, y0, spread, children }: { id: string; y0: number; spread: number; children: React.ReactNode }) {
  return (
    <g transform={`translate(280 ${y0})`}>
      <g className="layer" data-id={id} data-spread={spread}>{children}</g>
    </g>
  )
}

export function BurgerScene({ price }: { price?: number }) {
  const ref = useRef<HTMLElement>(null)

  useScene(ref, (root, tl) => {
    const q = gsap.utils.selector(root)
    tl.fromTo(
      q('.layer'),
      { y: 0, rotation: 0 },
      { y: (_i: number, el: Element) => Number((el as SVGElement).dataset.spread), rotation: (i: number) => (i % 2 ? 2.5 : -2.5), duration: 1, ease: 'power2.inOut' },
      0.05,
    ).fromTo(q('.ing li'), { autoAlpha: 0, x: 28 }, { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.16, ease: 'power2.out' }, 0.35)
  })

  return (
    <section className="scene scene-burger" ref={ref} aria-label="Mutfak">
      <div className="scene-stick">
        <div className="scene-copy">
          <h2>Ekmeği de sosu da mutfakta</h2>
          <p>
            Mini burger'in her katı Botta mutfağında hazırlanıyor. Kaydırın, katlara bakın.
          </p>
          <ul className="ing" aria-label="İçindekiler">
            {ingredients.map((i) => (
              <li key={i.name}>
                <span className="dot" style={{ background: i.color }} aria-hidden="true" />
                {i.name}
              </li>
            ))}
          </ul>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/menu">Burgerleri gör</Link>
            {price ? <span className="scene-price">5'li {tlira(price)}</span> : null}
          </div>
        </div>

        <svg className="scene-art" viewBox="0 -80 560 720" role="img" aria-label="Katlarına ayrılan mini burger">
          <ellipse cx="280" cy="610" rx="170" ry="12" fill="#000" opacity="0.25" />

          <Layer id="bun-bottom" y0={410} spread={176}>
            <path d="M-140 -8 H140 C148 -8 150 0 148 12 C144 36 120 44 90 44 H-90 C-120 44 -144 36 -148 12 C-150 0 -148 -8 -140 -8 Z" fill={BUN} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          </Layer>

          <Layer id="patty" y0={372} spread={116}>
            <rect x="-150" y="-22" width="300" height="46" rx="23" fill="#5A3326" stroke={INK} strokeWidth="4" />
            {[-100, -50, 0, 50, 100].map((x) => (
              <ellipse key={x} cx={x} cy={x % 100 ? 2 : -4} rx="9" ry="4" fill="#3E2218" />
            ))}
          </Layer>

          <Layer id="cheese" y0={338} spread={58}>
            <path d="M-152 -8 H152 L134 14 L104 4 L72 30 L42 6 L-16 6 L-56 28 L-92 6 L-132 16 Z" fill="#E9A23B" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          </Layer>

          <Layer id="tomato" y0={312} spread={4}>
            {[-98, 0, 98].map((x) => (
              <g key={x}>
                <rect x={x - 46} y="-13" width="92" height="26" rx="13" fill="#C93A4A" stroke={INK} strokeWidth="4" />
                <rect x={x - 30} y="-6" width="60" height="8" rx="4" fill="#E26A74" />
              </g>
            ))}
          </Layer>

          <Layer id="lettuce" y0={288} spread={-52}>
            <path
              d="M-155 0 q15.5 -24 31 0 t31 0 t31 0 t31 0 t31 0 t31 0 t31 0 t31 0 t31 0 t31 0 v10 q-15.5 24 -31 0 t-31 0 t-31 0 t-31 0 t-31 0 t-31 0 t-31 0 t-31 0 t-31 0 t-31 0 Z"
              fill="#7C9A66"
              stroke={INK}
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </Layer>

          <Layer id="sauce" y0={262} spread={-108}>
            <rect x="-140" y="-10" width="280" height="22" rx="11" fill="#E8A27C" stroke={INK} strokeWidth="4" />
            {[-96, -20, 64].map((x, i) => (
              <path key={x} d={`M${x} 10 v${14 + i * 4} a8 8 0 0 0 16 0 v-${14 + i * 4}`} fill="#E8A27C" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            ))}
          </Layer>

          <Layer id="bun-top" y0={232} spread={-170}>
            <path d="M-150 4 C-150 -90 -85 -122 0 -122 C85 -122 150 -90 150 4 C150 14 140 18 130 18 H-130 C-140 18 -150 14 -150 4 Z" fill={BUN} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M-110 -40 C-100 -80 -60 -100 -20 -102" fill="none" stroke="#E3AE72" strokeWidth="9" strokeLinecap="round" />
            {[[-60, -78, -20], [-10, -96, 10], [46, -82, 30], [86, -50, 50], [-96, -48, -40], [20, -60, -15]].map(([x, y, r]) => (
              <ellipse key={`${x}${y}`} cx={x} cy={y} rx="9" ry="4.5" transform={`rotate(${r} ${x} ${y})`} fill="#F6E3B8" stroke={INK} strokeWidth="2" />
            ))}
          </Layer>
        </svg>
      </div>
    </section>
  )
}

