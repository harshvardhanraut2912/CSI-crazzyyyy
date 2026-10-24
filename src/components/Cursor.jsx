import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dot = useRef(), ring = useRef()
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return
    const dx = gsap.quickTo(dot.current, 'x', { duration: .05 }), dy = gsap.quickTo(dot.current, 'y', { duration: .05 })
    const rx = gsap.quickTo(ring.current, 'x', { duration: .45, ease: 'power3' }), ry = gsap.quickTo(ring.current, 'y', { duration: .45, ease: 'power3' })
    const move = (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY) }
    const over = (e) => ring.current.classList.toggle('big', !!e.target.closest('a,button,[data-hover]'))
    addEventListener('mousemove', move); addEventListener('mouseover', over)
    // click shockwave
    const click = (e) => {
      const s = document.createElement('div'); s.className = 'shock'
      s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'
      document.body.appendChild(s)
      gsap.fromTo(s, { scale: 0, opacity: 1 }, { scale: 14, opacity: 0, duration: .9, ease: 'power2.out', onComplete: () => s.remove() })
    }
    addEventListener('click', click)
    return () => { removeEventListener('mousemove', move); removeEventListener('mouseover', over); removeEventListener('click', click) }
  }, [])
  return (<><div ref={ring} className="cur-ring" /><div ref={dot} className="cur-dot" /></>)
}
