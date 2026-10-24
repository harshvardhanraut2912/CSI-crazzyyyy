import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const tracks = [['🧠', 'AI / ML', '#c8ff00'], ['🌐', 'WEB', '#00f0ff'], ['🛡️', 'CYBER', '#ff0080'], ['🤖', 'ROBOTICS', '#ff7a00'], ['🎮', 'GAMING', '#a855ff'], ['🎨', 'DESIGN', '#ffee00'], ['⛓️', 'WEB3', '#00ff9d'], ['☁️', 'CLOUD', '#4da3ff']]

export default function Ring3D() {
  const sec = useRef(), ring = useRef(), tilt = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ring.current, { rotateY: -540, ease: 'none', scrollTrigger: { trigger: sec.current, pin: true, scrub: .8, end: '+=2600' } })
      gsap.to('.tracks-bg', { xPercent: -40, ease: 'none', scrollTrigger: { trigger: sec.current, scrub: true, end: '+=2600' } })
      gsap.to(tilt.current, { y: -14, repeat: -1, yoyo: true, duration: 2.2, ease: 'sine.inOut' })
    }, sec)
    const mv = (e) => gsap.to(tilt.current, { rotateX: -8 + (e.clientY / innerHeight - .5) * -18, rotateZ: (e.clientX / innerWidth - .5) * 6, duration: 1, ease: 'power3' })
    addEventListener('mousemove', mv)
    return () => { removeEventListener('mousemove', mv); ctx.revert() }
  }, [])
  return (
    <section id="tracks" ref={sec} className="tracks">
      <div className="tracks-bg">TRACKS TRACKS TRACKS</div>
      <div className="tag tracks-tag">// 04 — EIGHT DOMAINS</div>
      <div ref={tilt} className="ring-tilt">
        <div ref={ring} className="ring">
          {tracks.map(([e, n, c], i) => (
            <div key={n} className="ring-item" style={{ '--i': i, '--c': c }} data-hover>
              <div className="ring-emo">{e}</div>
              <div><div className="tag" style={{ color: c }}>TRACK 0{i + 1}</div><h3 className="glitch" data-text={n}>{n}</h3></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
