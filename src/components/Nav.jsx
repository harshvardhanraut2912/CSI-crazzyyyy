import { useRef } from 'react'
import Magnetic from './Magnetic.jsx'

const CH = '!<>-_\\/[]{}—=+*^?#01'
function Scr({ href, children }) {
  const ref = useRef(), id = useRef()
  const run = () => {
    clearInterval(id.current); let f = 0
    id.current = setInterval(() => {
      ref.current.textContent = children.split('').map((c, i) => i < f ? c : CH[Math.floor(Math.random() * CH.length)]).join('')
      if (++f > children.length) { clearInterval(id.current); ref.current.textContent = children }
    }, 35)
  }
  return <a ref={ref} href={href} onMouseEnter={run}>{children}</a>
}

export default function Nav() {
  return (
    <nav className="nav">
      <a href="#top" className="logo glitch" data-text="CSI/XENIA">CSI<span>/</span>XENIA</a>
      <div className="nav-links">
        <Scr href="#about">About</Scr><Scr href="#events">Events</Scr><Scr href="#tracks">Tracks</Scr>
        <Scr href="#schedule">Schedule</Scr><Scr href="#prizes">Prizes</Scr>
        <Magnetic><a href="#register" className="btn small">Register</a></Magnetic>
      </div>
    </nav>
  )
}
