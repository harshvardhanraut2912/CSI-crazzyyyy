import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { fx, burst, ripple } from '../state.js'
import { blip, initHoverSounds } from '../sound.js'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export default function Dock() {
  const [snd, setSnd] = useState(false), [on, setOn] = useState(false)
  const toast = useRef(), tl = useRef(), stop = useRef(null)

  const say = (m) => {
    toast.current.textContent = m
    tl.current?.kill()
    tl.current = gsap.timeline()
      .fromTo(toast.current, { opacity: 0, scale: 2.2, y: -30 }, { opacity: 1, scale: 1, y: 0, duration: .4, ease: 'back.out(3)' })
      .to(toast.current, { opacity: 0, duration: .5, delay: 1.8 })
  }

  const start = (msg = '☠ CHAOS MODE ☠', ms = 7000) => {
    if (fx.active) return
    fx.active = true; setOn(true); say(msg)
    document.body.classList.add('chaos')
    const root = document.documentElement, t0 = performance.now()
    const tick = () => {
      const e = performance.now() - t0, h = (e * .35) % 360
      root.style.setProperty('--acid', `hsl(${h},100%,55%)`)
      root.style.setProperty('--pink', `hsl(${(h + 120) % 360},100%,55%)`)
      root.style.setProperty('--cyan', `hsl(${(h + 240) % 360},100%,55%)`)
      fx.hue = e * .004
    }
    gsap.ticker.add(tick)
    gsap.to(fx, { chaos: 1, duration: .6 })
    const iv = setInterval(() => {
      const x = Math.random() * innerWidth, y = Math.random() * innerHeight
      burst(x, y, 18); ripple(x, y); blip(200 + Math.random() * 800, .08, 'sawtooth', .04)
    }, 260)
    stop.current = setTimeout(() => {
      clearInterval(iv); gsap.ticker.remove(tick)
      gsap.to(fx, { chaos: 0, hue: Math.ceil(fx.hue / 6.2832) * 6.2832, duration: 1, onComplete: () => { fx.hue = 0 } })
      ;['--acid', '--pink', '--cyan'].forEach(v => root.style.removeProperty(v))
      document.body.classList.remove('chaos'); fx.active = false; setOn(false)
    }, ms)
  }

  useEffect(() => {
    const offSnd = initHoverSounds()
    const onChaos = (e) => start(undefined, e.detail?.ms || 7000)
    addEventListener('xenia:chaos', onChaos)
    let seq = []
    const key = (e) => {
      seq = [...seq, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-10)
      if (seq.join() === KONAMI.join()) { start('🎮 KONAMI UNLOCKED — GOD MODE', 12000); seq = [] }
    }
    addEventListener('keydown', key)
    return () => { offSnd(); removeEventListener('xenia:chaos', onChaos); removeEventListener('keydown', key) }
  }, [])

  return (
    <>
      <div ref={toast} className="toast" />
      <div className="dock">
        <button data-hover className={snd ? 'on' : ''} onClick={() => { fx.sound = !snd; setSnd(!snd); if (!snd) blip(900, .15, 'square', .05) }}>{snd ? '🔊 SOUND ON' : '🔇 SOUND OFF'}</button>
        <button data-hover className={on ? 'on' : ''} onClick={() => start()}>☠ CHAOS</button>
      </div>
    </>
  )
}
