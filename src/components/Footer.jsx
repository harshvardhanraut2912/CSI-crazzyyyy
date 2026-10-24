import { useEffect } from 'react'
import { useRef } from 'react'
import gsap from 'gsap'
import Magnetic from './Magnetic.jsx'
import { burst, ripple, chaos, fx } from '../state.js'

export default function Footer() {
  const cv = useRef()
  useEffect(() => {
    const c = cv.current, x = c.getContext('2d'), pts = []
    const size = () => { c.width = c.offsetWidth; c.height = c.offsetHeight }
    size(); addEventListener('resize', size)
    const move = (e) => {
      const r = c.getBoundingClientRect()
      if (e.clientY < r.top || e.clientY > r.bottom) return
      for (let i = 0; i < 3; i++) pts.push({ x: e.clientX - r.left, y: e.clientY - r.top, vx: (Math.random() - .5) * 4, vy: (Math.random() - .5) * 4 - 1, l: 1, h: 70 + Math.random() * 260 })
    }
    addEventListener('mousemove', move)
    let raf
    const loop = () => {
      x.fillStyle = 'rgba(5,0,15,.18)'; x.fillRect(0, 0, c.width, c.height)
      x.globalCompositeOperation = 'lighter'
      for (let i = pts.length - 1; i >= 0; i--) {
        const p = pts[i]; p.x += p.vx; p.y += p.vy; p.vy += .05; p.l -= .014
        if (p.l <= 0) { pts.splice(i, 1); continue }
        x.fillStyle = `hsla(${p.h},100%,60%,${p.l})`; x.beginPath(); x.arc(p.x, p.y, 2 + p.l * 6, 0, 7); x.fill()
      }
      x.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const ctx = gsap.context(() => {
      gsap.from('.f-huge span', { yPercent: 120, stagger: .06, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.footer', start: 'top 60%' } })
      gsap.to('.f-huge .acid', { y: -14, stagger: { each: .1, yoyo: true, repeat: -1 }, duration: .6, ease: 'sine.inOut' })
    })
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', move); removeEventListener('resize', size); ctx.revert() }
  }, [])

  const reg = (e) => {
    const r = e.currentTarget.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2
    burst(cx, cy, 90); ripple(cx, cy); chaos(5000)
  }
  const words = ['SEE YOU AT XENIA', 'NO SLEEP', 'ONLY CODE', 'CSI 2026']
  return (
    <footer id="register" className="footer">
      <canvas ref={cv} className="trail" />
      <div className="f-content">
        <div className="tag">// 08 — YOUR MOVE</div>
        <h2 className="f-huge">{'JOIN THE'.split('').map((c, i) => <span key={i}>{c === ' ' ? '\u00A0' : c}</span>)}<br />{'CHAOS'.split('').map((c, i) => <span key={i} className="acid">{c}</span>)}</h2>
        <Magnetic strength={.6}><a href="#" className="btn huge" onClick={reg}>REGISTER NOW ⚡</a></Magnetic>
        <button className="rocket" data-hover onClick={() => fx.lenis?.scrollTo(0, { duration: 3 })}>🚀 BACK TO TOP</button>
        <div className="f-row"><span>© 2026 CSI — XENIA</span><span><a href="#">Instagram</a> · <a href="#">LinkedIn</a> · <a href="#">Discord</a></span><span>Built with ☠ & caffeine</span></div>
        <div className="f-marq"><div>{[0, 1].map(k => <div key={k} className="f-half">{[0, 1, 2].map(j => words.map(w => <span key={w + j}>{w} ✦ </span>))}</div>)}</div></div>
      </div>
    </footer>
  )
}
