import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { EVENT_DATE } from '../config.js'

function Unit({ v, label }) {
  const ref = useRef(), prev = useRef(v)
  useEffect(() => {
    if (prev.current !== v) {
      gsap.fromTo(ref.current, { rotateX: -90, opacity: 0, y: -20 }, { rotateX: 0, opacity: 1, y: 0, duration: .5, ease: 'back.out(2)' })
      prev.current = v
    }
  }, [v])
  return (
    <div className="cd-unit"><div ref={ref} className="cd-num glitch" data-text={String(v).padStart(2, '0')}>{String(v).padStart(2, '0')}</div><div className="tag">{label}</div></div>
  )
}

export default function Countdown() {
  const [t, setT] = useState(0)
  useEffect(() => {
    const f = () => setT(Math.max(0, EVENT_DATE - Date.now()))
    f(); const id = setInterval(f, 1000); return () => clearInterval(id)
  }, [])
  const s = Math.floor(t / 1000)
  return (
    <section id="countdown" className="countdown">
      <div className="tag">// 07 — T-MINUS</div>
      <div className="cd">
        <Unit v={Math.floor(s / 86400)} label="DAYS" />
        <Unit v={Math.floor(s % 86400 / 3600)} label="HRS" />
        <Unit v={Math.floor(s % 3600 / 60)} label="MIN" />
        <Unit v={s % 60} label="SEC" />
      </div>
    </section>
  )
}
