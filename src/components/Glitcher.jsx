import { useEffect, useRef } from 'react'

export default function Glitcher() {
  const ref = useRef()
  useEffect(() => {
    let to, off
    const run = () => {
      const el = ref.current
      el.innerHTML = ''
      const n = 4 + Math.floor(Math.random() * 6)
      for (let i = 0; i < n; i++) {
        const d = document.createElement('div')
        d.style.top = Math.random() * 100 + '%'; d.style.height = 2 + Math.random() * 70 + 'px'
        el.appendChild(d)
      }
      el.classList.add('on'); document.body.classList.add('gl')
      off = setTimeout(() => { el.classList.remove('on'); document.body.classList.remove('gl') }, 160 + Math.random() * 220)
      to = setTimeout(run, 5000 + Math.random() * 8000)
    }
    to = setTimeout(run, 6000)
    return () => { clearTimeout(to); clearTimeout(off) }
  }, [])
  return <div ref={ref} className="tear" />
}
