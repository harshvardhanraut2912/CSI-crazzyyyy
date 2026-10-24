import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const text = 'XENIA is where raw code meets pure chaos. Three days. Dozens of battles. One stage that rewrites the rules of what a college fest can feel like. Build it. Break it. Own it.'
export default function About() {
  const ref = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.w', { opacity: .1, y: 20, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: .06, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'bottom 55%', scrub: true } })
      gsap.to('.orb', { rotate: 360, scrollTrigger: { trigger: ref.current, scrub: true, start: 'top bottom', end: 'bottom top' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="about" ref={ref} className="about">
      <div className="orb"><span>✦</span><span>⚡</span><span>✦</span><span>⚡</span></div>
      <div className="tag">// 01 — WHAT IS THIS</div>
      <p className="about-text">{text.split(' ').map((w, i) => <span className="w" key={i}>{w} </span>)}</p>
    </section>
  )
}
