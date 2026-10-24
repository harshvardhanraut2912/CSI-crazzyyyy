import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fx } from './state.js'
import Preloader from './components/Preloader.jsx'
import ShaderBG from './components/ShaderBG.jsx'
import Cursor from './components/Cursor.jsx'
import CursorTrail from './components/CursorTrail.jsx'
import Nav from './components/Nav.jsx'
import Progress from './components/Progress.jsx'
import Ticker from './components/Ticker.jsx'
import Glitcher from './components/Glitcher.jsx'
import Dock from './components/Dock.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Terminal from './components/Terminal.jsx'
import Events from './components/Events.jsx'
import Ring3D from './components/Ring3D.jsx'
import Stats from './components/Stats.jsx'
import Schedule from './components/Schedule.jsx'
import Prizes from './components/Prizes.jsx'
import Countdown from './components/Countdown.jsx'
import Footer from './components/Footer.jsx'
import Reveals from './components/Reveals.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.085 })
    fx.lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    if (!ready) lenis.stop(); else lenis.start()
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [ready])

  // smooth anchor navigation (pin-spacer aware)
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest?.('a[href^="#"]'); if (!a) return
      e.preventDefault()
      const h = a.getAttribute('href'); if (h === '#' || !fx.lenis) return
      if (h === '#top') return fx.lenis.scrollTo(0, { duration: 2 })
      let el = document.querySelector(h); if (!el) return
      if (el.parentElement?.classList.contains('pin-spacer')) el = el.parentElement
      fx.lenis.scrollTo(el, { duration: 2.2 })
    }
    addEventListener('click', onClick)
    return () => removeEventListener('click', onClick)
  }, [])

  useEffect(() => {
    if (!ready) return
    const r = () => ScrollTrigger.refresh()
    const id = setTimeout(r, 400)
    document.fonts?.ready.then(r)
    addEventListener('load', r)
    return () => { clearTimeout(id); removeEventListener('load', r) }
  }, [ready])

  return (
    <>
      <ShaderBG />
      <div className="grain" /><div className="vig" /><div className="scan" />
      <Glitcher />
      <Cursor />
      <CursorTrail />
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <Nav />
      <Progress />
      <Dock />
      <Ticker />
      <Reveals ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Terminal />
        <Events />
        <Ring3D />
        <Stats />
        <Schedule />
        <Prizes />
        <Countdown />
        <Footer />
      </main>
    </>
  )
}
