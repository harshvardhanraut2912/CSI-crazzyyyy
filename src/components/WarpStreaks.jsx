import { useEffect, useRef } from 'react'
import { fx } from '../state.js'

// radial star streaks: gentle drift at rest, full warp-speed while XENIA flies through
export default function WarpStreaks() {
  const ref = useRef()
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d'), parent = c.parentElement, pr = Math.min(devicePixelRatio, 1.5)
    let W, H
    const size = () => { W = parent.clientWidth; H = parent.clientHeight; c.width = W * pr; c.height = H * pr; x.setTransform(pr, 0, 0, pr, 0, 0) }
    size(); addEventListener('resize', size)
    const S = Array.from({ length: innerWidth < 700 ? 140 : 320 }, () => ({ a: Math.random() * 6.283, r: Math.random(), v: .2 + Math.random() * .8, h: Math.random() }))
    let raf
    const loop = () => {
      raf = requestAnimationFrame(loop)
      const rect = parent.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > innerHeight) return
      const w = Math.pow(fx.heroP, 1.3)
      x.clearRect(0, 0, W, H)
      const cx = W / 2, cy = H / 2, R = Math.hypot(cx, cy)
      x.globalCompositeOperation = 'lighter'; x.lineCap = 'round'
      for (const s of S) {
        s.r += (.002 + s.v * .004) * (1 + s.r * 3) * (1 + w * 22)
        if (s.r > 1.1) { s.r = Math.random() * .05; s.a = Math.random() * 6.283 }
        const r0 = Math.max(0, s.r - (.004 + w * .22 * s.v) * (1 + s.r * 2))
        const cos = Math.cos(s.a), sin = Math.sin(s.a)
        const col = s.h < .5 ? '200,230,255' : s.h < .8 ? '0,240,255' : '255,0,128'
        x.strokeStyle = `rgba(${col},${Math.min(1, (.15 + s.r) * (.35 + w * 1.2))})`
        x.lineWidth = .6 + s.r * (1.2 + w * 3)
        x.beginPath(); x.moveTo(cx + cos * r0 * R, cy + sin * r0 * R); x.lineTo(cx + cos * s.r * R, cy + sin * s.r * R); x.stroke()
      }
    }
    loop()
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size) }
  }, [])
  return <canvas ref={ref} className="warp" />
}
