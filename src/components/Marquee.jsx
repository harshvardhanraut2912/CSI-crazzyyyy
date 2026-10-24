import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const words = ['HACKATHON', 'CODE', 'ROBO WARS', 'GAMING', 'AI', 'CTF', 'DESIGN', 'WEB3']
export default function Marquee() {
  const a = useRef(), b = useRef()
  useEffect(() => {
    const t1 = gsap.to(a.current, { xPercent: -50, repeat: -1, duration: 25, ease: 'none' })
    const t2 = gsap.fromTo(b.current, { xPercent: -50 }, { xPercent: 0, repeat: -1, duration: 30, ease: 'none' })
    const st = ScrollTrigger.create({ onUpdate: (s) => {
      const v = s.getVelocity() / 300
      gsap.to([t1, t2], { timeScale: 1 + Math.abs(v) * 3, duration: .2, overwrite: true })
      gsap.to('.marq', { skewX: -Math.max(-12, Math.min(12, v)), duration: .3 })
      gsap.to([t1, t2], { timeScale: 1, duration: 1, delay: .2 })
    } })
    return () => { t1.kill(); t2.kill(); st.kill() }
  }, [])
  const row = (r, cls) => (
    <div className={'marq ' + cls}><div ref={r} className="marq-track">
      {Array(4).fill(words).flat().map((w, i) => <span key={i}>{w}<i>✦</i></span>)}
    </div></div>
  )
  return <section className="marquee">{row(a, 'solid')}{row(b, 'outline')}</section>
}
