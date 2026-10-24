import { useEffect, useRef } from 'react'

const chars = 'アイウエオカキクケコサシスセソ0123456789XENIA{}<>/*+=#'
export default function MatrixRain({ boost = false }) {
  const ref = useRef(), boostRef = useRef(boost)
  boostRef.current = boost
  useEffect(() => {
    const c = ref.current, x = c.getContext('2d'), parent = c.parentElement
    let W, H, cols, drops, vis = true
    const fs = 16
    const size = () => { W = c.width = parent.clientWidth; H = c.height = parent.clientHeight; cols = Math.floor(W / fs); drops = Array.from({ length: cols }, () => Math.random() * -50) }
    size(); addEventListener('resize', size)
    const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting }); io.observe(parent)
    let raf, f = 0
    const loop = () => {
      raf = requestAnimationFrame(loop)
      if (!vis) return
      f++; if (f % (boostRef.current ? 1 : 2)) return
      x.fillStyle = 'rgba(5,0,15,.12)'; x.fillRect(0, 0, W, H)
      x.font = fs + 'px JetBrains Mono, monospace'
      for (let i = 0; i < cols; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)]
        x.fillStyle = Math.random() > .975 ? '#fff' : (boostRef.current ? '#00f0ff' : '#c8ff00')
        x.fillText(ch, i * fs, drops[i] * fs)
        if (drops[i] * fs > H && Math.random() > .975) drops[i] = 0
        drops[i] += boostRef.current ? 1.6 : 1
      }
    }
    loop()
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', size) }
  }, [])
  return <canvas ref={ref} className="rain" />
}
