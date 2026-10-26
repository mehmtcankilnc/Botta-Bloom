import { useLayoutEffect, type RefObject } from 'react'
import { gsap } from './gsap'

export const HEADER_H = 64

/**
 * Sabitlenen (sticky) bir sahneyi kaydırmaya bağlar.
 * Hareketi azalt ayarı açıksa animasyon kurulmaz, sahne son haliyle gösterilir.
 */
export function useScene(
  ref: RefObject<HTMLElement | null>,
  build: (root: HTMLElement, tl: gsap.core.Timeline) => void,
) {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: `top top+=${HEADER_H}`, end: 'bottom bottom', scrub: 0.6 },
      })
      build(root, tl)
    })

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const tl = gsap.timeline()
      build(root, tl)
      tl.progress(1)
    })

    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
