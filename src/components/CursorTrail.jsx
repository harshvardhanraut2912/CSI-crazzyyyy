import { useEffect, useRef } from 'react'

export default function CursorTrail() {
  const ref = useRef()
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return
    const c = ref.current, x = c.getContext('2d'), pr = 1
    const size = () => { c.width = innerWidth * pr; c.height = innerHeight * pr; x.setTransform(pr, 0, 0, pr, 0, 0) }
    size(); addEventListener('resize', size)
    const P = []; let hue = 0, lx = 0, ly = 0
    const burst = (px, py, n) => {
      n = Math.min(n, 40)
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283, s = 2 + Math.random() * 9
        P.push({ x: px, y: py, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 3, l: 1, d: .008 + Math.random() * .012, s: 4 + Math.random() * 7, h: Math.random() * 360, type: 1, r: Math.random() * 6, vr: (Math.random() - .5) * .4 })
      }
    }
    const move = (e) => {
      hue = (hue + 5) % 360
      const dist = Math.hypot(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY
      const n = Math.min(4, 1 + Math.floor(dist / 25))
      for (let i = 0; i < n; i++) P.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - .5) * 2.5, vy: (Math.random() - .5) * 2.5 + .4, l: 1, d: .03 + Math.random() * .02, s: 3 + Math.random() * 7, h: hue, type: 0 })
    }
    const click = (e) => burst(e.clientX, e.clientY, 26)
    const onBurst = (e) => burst(e.detail.x, e.detail.y, e.detail.n)
    const mv = (e) => { move(e); if (P.length > 160) P.splice(0, P.length - 160); wake() }
    const cl = (e) => { click(e); wake() }
    const ob = (e) => { onBurst(e); wake() }
    addEventListener('mousemove', mv, { passive: true }); addEventListener('click', cl); addEventListener('xenia:burst', ob)
    let raf = 0
    const wake = () => { if (!raf) raf = requestAnimationFrame(loop) }
    const loop = () => {
      raf = P.length ? requestAnimationFrame(loop) : 0
      x.clearRect(0, 0, innerWidth, innerHeight)
      x.globalCompositeOperation = 'lighter'
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i]; p.x += p.vx; p.y += p.vy; p.l -= p.d
        if (p.type) { p.vy += .22; p.vx *= .985; p.r += p.vr } else { p.vx *= .96; p.vy *= .96 }
        if (p.l <= 0) { P.splice(i, 1); continue }
        x.fillStyle = x.strokeStyle = `hsla(${p.h},100%,60%,${p.l})`
        if (p.type) { x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore() }
        else {
          const s = p.s * p.l; x.lineWidth = 1.5; x.beginPath()
          x.moveTo(p.x - s, p.y); x.lineTo(p.x + s, p.y); x.moveTo(p.x, p.y - s); x.lineTo(p.x, p.y + s); x.stroke()
        }
      }
    }
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('mousemove', mv); removeEventListener('click', cl); removeEventListener('xenia:burst', ob) }
  }, [])
  return <canvas ref={ref} className="trail-fx" />
}
