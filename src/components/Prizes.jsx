import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const rows = [['🏆', 'GRAND CHAMPION', '₹1,00,000'], ['🥈', 'RUNNER UP', '₹60,000'], ['🤖', 'BEST ROBOT', '₹40,000'], ['🧠', 'BEST AI HACK', '₹40,000'], ['🎮', 'ESPORTS KING', '₹30,000'], ['🎨', 'DESIGN LEGEND', '₹25,000']]

export default function Prizes() {
  const ref = useRef(), fl = useRef(), [emo, setEmo] = useState('🏆')
  useEffect(() => {
    gsap.set(fl.current, { scale: 0, opacity: 0 })
    const qx = gsap.quickTo(fl.current, 'x', { duration: .4, ease: 'power3' }), qy = gsap.quickTo(fl.current, 'y', { duration: .4, ease: 'power3' })
    const mv = (e) => { qx(e.clientX); qy(e.clientY) }
    addEventListener('mousemove', mv)
    const ctx = gsap.context(() => {
      gsap.from('.pz', { y: 80, opacity: 0, stagger: .1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.pz-list', start: 'top 80%' } })
      gsap.to('.pz-count', { scale: 1.08, repeat: -1, yoyo: true, duration: .8, ease: 'sine.inOut' })
    }, ref)
    return () => { removeEventListener('mousemove', mv); ctx.revert() }
  }, [])
  const enter = (e) => { setEmo(e); gsap.to(fl.current, { scale: 1, opacity: 1, rotate: (Math.random() - .5) * 30, duration: .4, ease: 'back.out(3)' }) }
  const leave = () => gsap.to(fl.current, { scale: 0, opacity: 0, duration: .25 })
  return (
    <section id="prizes" ref={ref} className="prizes">
      <div className="rays" />
      <div className="tag" style={{ position: 'relative' }}>// 06 — THE LOOT</div>
      <h2 className="sec-title" style={{ position: 'relative' }}>PRIZE POOL <span className="pz-count acid-t">₹5L+</span></h2>
      <div className="pz-list">
        {rows.map(([e, t, a]) => (
          <div key={t} className="pz" data-hover onMouseEnter={() => enter(e)} onMouseLeave={leave}><span>{t}</span><b>{a}</b></div>
        ))}
      </div>
      <div ref={fl} className="pz-float">{emo}</div>
    </section>
  )
}
