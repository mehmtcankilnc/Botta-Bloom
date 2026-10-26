import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { Bloom, Daisy, Peony, Tulip } from '../scenes/HeroScene'

const H = 340 // sabit yükseklik; genişlik kutunun oranına göre değişir
const SOIL = 26
const MAX = 16
const KINDS = ['peony', 'daisy', 'tulip'] as const
type Kind = (typeof KINDS)[number]

interface Flower { id: number; x: number; /* 0-1 arası oran */ h: number; kind: Kind; bend: number }

let nextId = 1
const rand = (a: number, b: number) => a + Math.random() * (b - a)
const make = (x: number): Flower => ({
  id: nextId++,
  x,
  h: rand(90, 200),
  kind: KINDS[Math.floor(Math.random() * KINDS.length)],
  bend: rand(-22, 22),
})

const seed = (): Flower[] => [0.07, 0.19, 0.32, 0.44, 0.57, 0.69, 0.81, 0.93].map((x) => make(x + rand(-0.025, 0.025)))

function soilPath(W: number) {
  const y = H - SOIL + 4
  let d = `M0 ${y}`
  const step = 110
  d += ` Q${step / 2} ${y - 10} ${step} ${y}`
  for (let x = step * 2; x < W + step; x += step) d += ` T${x} ${y}`
  return `${d} V${H + 6} H0 Z`
}

function Head({ kind }: { kind: Kind }) {
  return kind === 'peony' ? <Peony /> : kind === 'daisy' ? <Daisy /> : <Tulip />
}

function Plant({ f, W }: { f: Flower; W: number }) {
  const scale = f.kind === 'peony' ? 0.5 : f.kind === 'daisy' ? 0.55 : 0.6
  const tipX = f.bend
  return (
    <g transform={`translate(${f.x * W} ${H - SOIL / 2})`} data-id={f.id} data-fx={f.x}>
      <g className="sway">
        <path
          className="g-stem"
          d={`M0 0 C${f.bend * 0.2} ${-f.h * 0.35} ${f.bend} ${-f.h * 0.65} ${tipX} ${-f.h}`}
          pathLength={1}
          fill="none"
          stroke="#7C9A66"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <g className="g-leaf" transform={`translate(${f.bend * 0.3} ${-f.h * 0.4}) rotate(${f.bend > 0 ? -30 : -150})`}>
          <path d="M0 0 C12 -18 34 -19 44 -4 C32 12 12 13 0 0 Z" fill="#7C9A66" stroke="#2A1B17" strokeWidth="2" strokeLinejoin="round" />
        </g>
        <g transform={`translate(${tipX} ${-f.h})`}>
          <Bloom x={0} y={0} s={scale} free>
            <Head kind={f.kind} />
          </Bloom>
        </g>
      </g>
    </g>
  )
}

export function FooterGarden({ name }: { name: string }) {
  const [flowers, setFlowers] = useState<Flower[]>(seed)
  const [W, setW] = useState(1200)
  const svg = useRef<SVGSVGElement>(null)
  const seen = useRef<Set<number>>(new Set())
  const visible = useRef(false)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Kutunun en-boy oranına göre görünüm genişliğini ayarla: boşluk ve kırpılma olmasın
  useEffect(() => {
    const el = svg.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      if (width > 0 && height > 0) setW(Math.round((H * width) / height))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Yeni eklenen çiçekleri büyüt (ilk yüklemede ekrana girince)
  useLayoutEffect(() => {
    const root = svg.current
    if (!root) return
    root.querySelectorAll<SVGGElement>('g[data-id]').forEach((el) => {
      const id = Number(el.dataset.id)
      if (seen.current.has(id)) return
      if (!visible.current && id < nextId - 100) return
      seen.current.add(id)
      const stem = el.querySelector('.g-stem')
      const leaf = el.querySelector('.g-leaf')
      const head = el.querySelector('.head')
      const petals = el.querySelectorAll('.petal')
      if (reduce.current) return
      const tl = gsap.timeline()
      tl.fromTo(stem, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.out' })
        .fromTo(leaf, { scale: 0, transformOrigin: '0% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.3)
        .fromTo(head, { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.7, ease: 'back.out(1.8)' }, 0.5)
        .fromTo(petals, { scale: 0.5 }, { scale: 1, duration: 0.5, stagger: 0.004 }, 0.55)
    })
  }, [flowers])

  // Başlangıç bahçesi: ekrana girince açılsın
  useEffect(() => {
    const root = svg.current
    if (!root) return
    const els = root.querySelectorAll<SVGGElement>('g[data-id]')
    // İlk render'da görünmeyen bahçeyi gizle, ekrana girince oynat
    if (!reduce.current) gsap.set(els, { autoAlpha: 0 })
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        visible.current = true
        io.disconnect()
        els.forEach((el, i) => {
          gsap.set(el, { autoAlpha: 1 })
          const stem = el.querySelector('.g-stem')
          const leaf = el.querySelector('.g-leaf')
          const head = el.querySelector('.head')
          const petals = el.querySelectorAll('.petal')
          if (reduce.current) return
          const tl = gsap.timeline({ delay: i * 0.1 })
          tl.fromTo(stem, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' })
            .fromTo(leaf, { scale: 0, transformOrigin: '0% 50%' }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.4)
            .fromTo(head, { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.8)' }, 0.6)
            .fromTo(petals, { scale: 0.5 }, { scale: 1, duration: 0.5, stagger: 0.004 }, 0.65)
        })
      },
      { threshold: 0.3 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  // Fare/parmak yönüne doğru eğilme
  useEffect(() => {
    const root = svg.current
    if (!root || reduce.current) return
    const move = (e: PointerEvent) => {
      const r = root.getBoundingClientRect()
      const fx = (e.clientX - r.left) / r.width
      root.querySelectorAll<SVGGElement>('.sway').forEach((el) => {
        const base = Number((el.parentNode as Element).getAttribute('data-fx') ?? 0)
        const d = Math.max(-1, Math.min(1, ((fx - base) * (r.width / 1200)) * 4.6))
        gsap.to(el, { rotation: d * 11, transformOrigin: '50% 100%', duration: 0.6, ease: 'power3.out', overwrite: 'auto' })
      })
    }
    const leave = () => gsap.to(root.querySelectorAll('.sway'), { rotation: 0, duration: 1, ease: 'elastic.out(1,0.5)' })
    root.addEventListener('pointermove', move)
    root.addEventListener('pointerleave', leave)
    return () => {
      root.removeEventListener('pointermove', move)
      root.removeEventListener('pointerleave', leave)
    }
  }, [])

  const plant = (fx: number) =>
    setFlowers((fs) => [...fs.slice(fs.length >= MAX ? 1 : 0), make(Math.max(0.03, Math.min(0.97, fx)))])

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    plant((e.clientX - r.left) / r.width)
  }

  return (
    <div className="garden">
      <div className="garden-stage">
      <svg
        ref={svg}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax meet"
        className="garden-svg"
        onPointerDown={onPointerDown}
        role="img"
        aria-label="Etkileşimli çiçek bahçesi: tıklayarak çiçek ekleyebilirsiniz"
      >
        {flowers.map((f) => (
          <Plant key={f.id} f={f} W={W} />
        ))}
        {/* Toprak: sapların alt ucu bunun içine gömülür */}
        <path d={soilPath(W)} fill="#4A2F23" />
        {[0.05, 0.14, 0.24, 0.34, 0.44, 0.53, 0.63, 0.73, 0.83, 0.93].map((fx, i) => (
          <circle key={fx} cx={fx * W} cy={H - 9 - (i % 3) * 5} r={2.2 + (i % 2)} fill="#6A4635" />
        ))}
      </svg>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} {name}</p>
        <p className="sr-only" aria-live="polite">Bahçede {flowers.length} çiçek var.</p>
        <div className="garden-actions">
          <button className="garden-btn" onClick={() => plant(rand(0.05, 0.95))}>Çiçek ekle</button>
          <button className="garden-btn" onClick={() => setFlowers([])} disabled={flowers.length === 0}>Bahçeyi temizle</button>
        </div>
      </div>
    </div>
  )
}
