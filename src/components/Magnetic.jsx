import { useRef } from 'react'
import gsap from 'gsap'
export default function Magnetic({ children, strength = .4 }) {
  const el = useRef()
  const move = (e) => {
    const r = el.current.getBoundingClientRect()
    gsap.to(el.current, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: .4, ease: 'power3' })
  }
  const leave = () => gsap.to(el.current, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.4)' })
  return <span ref={el} onMouseMove={move} onMouseLeave={leave} style={{ display: 'inline-block' }}>{children}</span>
}
