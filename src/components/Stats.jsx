import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const stats = [['2500', '+', 'PARTICIPANTS'], ['30', '+', 'EVENTS'], ['3', '', 'DAYS OF CHAOS'], ['5', 'L', 'PRIZE POOL ₹']]
export default function Stats() {
  const ref = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      // count-up (width is reserved by a hidden ghost number, so nothing shifts or overlaps)
      gsap.utils.toArray('.num').forEach(el => {
        const o = { v: 0 }, end = +el.dataset.v
        gsap.to(o, { v: end, duration: 2.4, ease: 'expo.out', onUpdate: () => (el.textContent = Math.round(o.v)),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      })
      // 2D-only entrance (the old rotateX squashed the text and made it look broken mid-animation)
      gsap.from('.stat', { y: 80, opacity: 0, scale: .92, stagger: .12, duration: 1, ease: 'expo.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true } })
      // ring pulses only run while a stat is on screen
      gsap.utils.toArray('.stat').forEach(s => ScrollTrigger.create({ trigger: s, start: 'top 95%', end: 'bottom 5%', toggleClass: { targets: s, className: 'live' } }))
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={ref} className="stats">
      {stats.map(([v, s, l]) => (
        <div className="stat" key={l} data-hover>
          <div className="big-num">
            <span className="num-wrap"><span className="num-ghost" aria-hidden="true">{v}</span><span className="num" data-v={v}>0</span></span>
            {s && <span className="suf">{s}</span>}
          </div>
          <div className="tag">{l}</div>
        </div>
      ))}
    </section>
  )
}
