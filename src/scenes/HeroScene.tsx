import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../lib/gsap'
import { useScene } from '../lib/useScene'

const INK = '#2A1B17'
const LEAF = 'M0 0 C18 -30 54 -32 72 -6 C54 20 18 22 0 0 Z'

function Petals({ n, rx, ry, off, fill, rot = 0 }: { n: number; rx: number; ry: number; off: number; fill: string; rot?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, k) => (
        <g key={k} transform={`rotate(${rot + (360 / n) * k}) translate(0 ${-off})`}>
          <ellipse className="petal" data-off={off} rx={rx} ry={ry} fill={fill} stroke={INK} strokeWidth="2.5" />
        </g>
      ))}
    </>
  )
}

/** Dıştaki g konumu ve boyutu sabit tutar, içteki .head GSAP ile açılır. */
export function Bloom({ x, y, s = 1, children, free = false }: { x: number; y: number; s?: number; children: ReactNode; free?: boolean }) {
  // free: sahne animasyonuna bağlı olmayan, sabit konumlu çiçek (ör. bardak süsü)
  return (
    <g className={free ? undefined : 'bloom'} data-s={s} transform={free ? `translate(${x} ${y})` : undefined}>
      <g transform={`scale(${s})`}>
        <g className="head">{children}</g>
      </g>
    </g>
  )
}

export function Peony() {
  return (
    <>
      <Petals n={9} rx={30} ry={46} off={42} fill="#B8245F" />
      <Petals n={8} rx={25} ry={36} off={28} fill="#D2457F" rot={20} />
      <Petals n={6} rx={20} ry={26} off={16} fill="#E86B9E" rot={10} />
      <circle r="11" fill="#F4D9E4" stroke={INK} strokeWidth="2.5" />
    </>
  )
}

export function Daisy() {
  return (
    <>
      <Petals n={12} rx={9} ry={26} off={32} fill="#FBF9FB" />
      <circle r="15" fill="#E9A23B" stroke={INK} strokeWidth="2.5" />
    </>
  )
}

export function Tulip() {
  return (
    <>
      <Petals n={3} rx={20} ry={38} off={22} fill="#E86B9E" rot={-40} />
      <Petals n={1} rx={22} ry={44} off={26} fill="#D2457F" />
    </>
  )
}

function Leaf({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <g className="leaf-in">
        <path d={LEAF} fill="#7C9A66" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M4 0 C24 -2 44 -4 62 -6" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </g>
  )
}

const stems = [
  'M300 520 C298 420 250 330 205 250',
  'M300 520 C300 400 290 300 292 185',
  'M300 520 C305 430 360 340 410 270',
  'M300 520 C290 450 200 410 140 365',
  'M300 520 C312 455 400 420 465 390',
]

export function HeroScene({ title, text }: { title: string; text: string }) {
  const ref = useRef<HTMLElement>(null)

  useScene(ref, (root, tl) => {
    const q = gsap.utils.selector(root)
    const paths = q('.stem') as unknown as SVGPathElement[]
    const blooms = q('.bloom') as unknown as SVGGElement[]
    const START = 0 // açılışta hiçbir çiçek görünmez, kaydırınca büyür

    // Her sap, ucundaki çiçek başıyla birlikte aynı noktadan ilerler.
    paths.forEach((path, i) => {
      const L = path.getTotalLength()
      const g = blooms[i]
      const head = g.querySelector('.head') as SVGGElement
      const o = { t: START }
      const apply = () => {
        const pt = path.getPointAtLength(o.t * L)
        path.style.strokeDashoffset = String(1 - o.t)
        gsap.set(g, { x: pt.x, y: pt.y })
        gsap.set(head, { scale: o.t, rotation: (1 - o.t) * -30 })
      }
      apply()
      tl.to(o, { t: 1, duration: 1, ease: 'power1.out', onUpdate: apply }, i * 0.1)
    })

    tl.fromTo(q('.leaf-in'), { scale: 0, transformOrigin: '0% 59%' }, { scale: 1, duration: 0.7, stagger: 0.08 }, 0.25).fromTo(
      q('.petal'),
      { scale: 0.45, y: (_i: number, el: Element) => Number((el as SVGElement).dataset.off) * 0.8 },
      { scale: 1, y: 0, duration: 0.9, stagger: 0.006 },
      0.45,
    )

    // Açılışta fincan büyük durur (boşluk kalmaz), çiçekler açarken yerine küçülür
    tl.fromTo(q('.cup-zoom'), { scale: window.innerWidth <= 820 ? 1.15 : 1.22, svgOrigin: '300 650' }, { scale: 1, svgOrigin: '300 650', duration: 1.1, ease: 'power2.out' }, 0)

    // Buhar kaydırınca solar; ayrıca çiçeklerin hepsi kaydırmanın ilk üçte birinde açılsın (hızlı)
    tl.to(q('.steam, .invite'), { opacity: 0, duration: 0.25 }, 0)
    tl.to({}, { duration: tl.duration() * 2 }, 0)
  })

  // Boşta duran fincan: nefes alma, buhar, göz kırpma, imleci takip
  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const q = gsap.utils.selector(root)
    const ctx = gsap.context(() => {
      gsap.set(q('.cup'), { svgOrigin: '300 650' })
      gsap.to(q('.cup'), { scaleY: 1.025, scaleX: 0.99, duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to(q('.cup'), { rotation: 1.6, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to(q('.cup-shadow'), { scaleX: 0.94, opacity: 0.08, svgOrigin: '300 668', duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.to(q('.coffee-glint'), { x: 40, opacity: 0.15, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      q('.steam path').forEach((el, i) => {
        gsap.fromTo(el, { y: 0, opacity: 0, scaleY: 0.6, svgOrigin: `${el.getAttribute('data-x')} 500` },
          { y: -70, opacity: 0.7, scaleY: 1.1, duration: 2.6, ease: 'sine.out', repeat: -1, delay: i * 0.8, yoyo: false,
            keyframes: [{ opacity: 0, y: 0 }, { opacity: 0.7, y: -30, duration: 1 }, { opacity: 0, y: -80, duration: 1.6 }] })
      })
      gsap.timeline({ repeat: -1, repeatDelay: 3.2 }).to(q('.eye-blink'), { scaleY: 0.08, svgOrigin: '300 572', duration: 0.08, yoyo: true, repeat: 1 })
      // Davet: tabaktan dışarı yayılan halkalar ve ara sıra küçük zıplama
      gsap.fromTo(q('.ring'), { scale: 1, opacity: 0.55, svgOrigin: '300 650' }, { scale: 1.1, opacity: 0, duration: 2.2, ease: 'sine.out', repeat: -1, stagger: 1.1 })
      gsap.timeline({ repeat: -1, repeatDelay: 4.5, delay: 3 }).to(q('.cup-pop'), { y: -14, duration: 0.18, ease: 'power2.out' }).to(q('.cup-pop'), { y: 0, duration: 0.5, ease: 'bounce.out' })
      gsap.to(q('.sparkle'), { scale: 1.3, opacity: 1, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.4, transformOrigin: '50% 50%' })
    }, root)

    // Gözler imleci izler
    const look = q('.eye-look')
    const cupEl = q(".cup")[0] as unknown as SVGGElement
    const lx = gsap.quickTo(look, 'x', { duration: 0.4 })
    const ly = gsap.quickTo(look, 'y', { duration: 0.4 })
    const onMove = (e: PointerEvent) => {
      const r = cupEl.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) / Math.max(300, window.innerWidth / 2)
      const dy = (e.clientY - (r.top + r.height / 2)) / Math.max(300, window.innerHeight / 2)
      lx(Math.max(-1, Math.min(1, dx)) * 7)
      ly(Math.max(-1, Math.min(1, dy)) * 5)
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      ctx.revert()
    }
  }, [])

  // Üzerine gelince fincan büyür, gülümser: tıklanabilir olduğunu hissettirir
  const hover = (on: boolean) => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const q = gsap.utils.selector(root)
    gsap.to(q('.cup-pop'), { scale: on ? 1.06 : 1, svgOrigin: '300 650', duration: 0.35, ease: 'back.out(2.5)', overwrite: 'auto' })
    gsap.to(q('.mouth-open'), { opacity: on ? 1 : 0, duration: 0.15 })
    gsap.to(q('.mouth'), { opacity: on ? 0 : 1, duration: 0.15 })
  }

  // Fincana dokununca çiçek ve kalp saçılır
  const burst = () => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const layer = root.querySelector('.burst') as SVGGElement
    const cup = root.querySelector('.cup') as SVGGElement
    gsap.fromTo(cup, { y: 0 }, { y: -22, duration: 0.16, yoyo: true, repeat: 1, ease: 'power2.out', overwrite: false })
    const cols = ['#B8245F', '#D2457F', '#E86B9E', '#FBF9FB', '#E9A23B', '#7C9A66']
    for (let i = 0; i < 16; i++) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')
      el.setAttribute('rx', String(7 + Math.random() * 7))
      el.setAttribute('ry', String(12 + Math.random() * 10))
      el.setAttribute('fill', cols[i % cols.length])
      el.setAttribute('stroke', INK)
      el.setAttribute('stroke-width', '2')
      layer.appendChild(el)
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4
      const d = 140 + Math.random() * 230
      gsap.fromTo(el, { x: 300, y: 515, scale: 0, rotation: Math.random() * 360 },
        { x: 300 + Math.cos(a) * d, y: 515 + Math.sin(a) * d, scale: 1, rotation: '+=' + (Math.random() * 300 - 150), duration: 0.7, ease: 'power3.out' })
      gsap.to(el, { y: '+=' + (120 + Math.random() * 120), opacity: 0, duration: 1.2, delay: 0.7, ease: 'power1.in', onComplete: () => el.remove() })
    }
  }

  return (
    <section className="scene scene-hero" ref={ref} aria-label="Botta Bloom">
      <div className="scene-stick">
        <div className="scene-copy">
          <h1>{title}</h1>
          <p>{text}</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/menu">Menüye bak</Link>
            <Link className="btn btn-ghost" to="/sadakat">Sadakat kartı</Link>
          </div>
        </div>
        <svg className="scene-art" viewBox="0 0 600 720" role="img" aria-label="Fincandan çıkan çiçek buketi">
          <ellipse className="cup-shadow" cx="300" cy="668" rx="200" ry="16" fill={INK} opacity="0.12" />
          {stems.map((d, i) => (
            <path key={i} className="stem" d={d} pathLength={1} fill="none" stroke="#4F6647" strokeWidth="7" strokeLinecap="round" />
          ))}
          <Leaf x={288} y={420} r={-150} />
          <Leaf x={296} y={380} r={-20} />
          <Leaf x={250} y={470} r={-170} />
          <Leaf x={330} y={440} r={-10} />
          <Leaf x={236} y={330} r={-120} />
          <Leaf x={365} y={350} r={-60} />
          <Bloom x={205} y={245} s={0.62}><Peony /></Bloom>
          <Bloom x={292} y={170} s={1}><Peony /></Bloom>
          <Bloom x={410} y={262} s={0.66}><Daisy /></Bloom>
          <Bloom x={138} y={352} s={0.7}><Tulip /></Bloom>
          <Bloom x={466} y={378} s={0.55}><Daisy /></Bloom>

          {/* Işıltılar */}
          {[[130, 250], [480, 230], [90, 470], [520, 500]].map(([x, y], i) => (
            <path key={i} className="sparkle" d={`M${x} ${y - 12} Q${x} ${y} ${x + 12} ${y} Q${x} ${y} ${x} ${y + 12} Q${x} ${y} ${x - 12} ${y} Q${x} ${y} ${x} ${y - 12} Z`} fill="#E9A23B" stroke={INK} strokeWidth="1.5" opacity="0.5" />
          ))}

          <g className="cup-zoom">
          {/* Buhar */}
          <g className="steam" fill="none" stroke="#B9A6B0" strokeWidth="6" strokeLinecap="round">
            {[250, 300, 350].map((x) => (
              <path key={x} data-x={x} d={`M${x} 500 C${x - 16} 470 ${x + 16} 450 ${x} 420`} />
            ))}
          </g>

          {/* Fincan */}
          <g className="invite" fill="none" stroke="#B8245F" strokeWidth="3" style={{ pointerEvents: 'none' }}>
            <ellipse className="ring" cx="300" cy="650" rx="210" ry="26" />
            <ellipse className="ring" cx="300" cy="650" rx="210" ry="26" />
          </g>
          <g className="cup-pop" onClick={burst} onPointerEnter={() => hover(true)} onPointerLeave={() => hover(false)} style={{ cursor: 'pointer' }}>
          <g className="cup">
          <ellipse cx="300" cy="650" rx="210" ry="26" fill="#FBF9FB" stroke={INK} strokeWidth="4" />
            <path d="M410 548 C470 540 470 612 404 606" fill="none" stroke={INK} strokeWidth="16" strokeLinecap="round" />
            <path d="M410 548 C470 540 470 612 404 606" fill="none" stroke="#F4D9E4" strokeWidth="8" strokeLinecap="round" />
            <path d="M190 520 H410 C410 592 380 640 300 640 C220 640 190 592 190 520 Z" fill="#F4D9E4" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <path d="M214 560 C218 596 236 620 262 628" fill="none" stroke="#FBF9FB" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
            <ellipse cx="300" cy="520" rx="110" ry="17" fill="#4A2C22" stroke={INK} strokeWidth="4" />
            <ellipse className="coffee-glint" cx="262" cy="515" rx="26" ry="4" fill="#FBF9FB" opacity="0.4" />
            {/* Yüz */}
            <g className="eye-look">
              <g className="eye-blink">
                <ellipse cx="258" cy="574" rx="7" ry="9" fill={INK} />
                <ellipse cx="342" cy="574" rx="7" ry="9" fill={INK} />
                <circle cx="260" cy="570" r="2.4" fill="#FBF9FB" />
                <circle cx="344" cy="570" r="2.4" fill="#FBF9FB" />
              </g>
            </g>
            <ellipse cx="236" cy="596" rx="14" ry="8" fill="#E86B9E" opacity="0.45" />
            <ellipse cx="364" cy="596" rx="14" ry="8" fill="#E86B9E" opacity="0.45" />
            <path className="mouth" d="M286 592 Q300 608 314 592" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
            <path className="mouth-open" d="M282 590 Q300 622 318 590 Z" fill="#B8245F" stroke={INK} strokeWidth="4" strokeLinejoin="round" opacity="0" />
          </g>
          </g>
          <g className="burst" style={{ pointerEvents: 'none' }} />
          </g>
        </svg>
      </div>
    </section>
  )
}
