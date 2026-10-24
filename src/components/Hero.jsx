import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Magnetic from './Magnetic.jsx'
import HeroShape from './HeroShape.jsx'
import { fx } from '../state.js'

const CH = '!<>-_\\/[]{}—=+*^?#01'
function scramble(el, text, dur = 1.2) {
  const o = { p: 0 }
  gsap.to(o, { p: 1, duration: dur, ease: 'none', onUpdate: () => {
    el.textContent = text.split('').map((c, i) => c === ' ' ? ' ' : i < o.p * text.length ? c : CH[Math.floor(Math.random() * CH.length)]).join('')
  } })
}
const stickers = [['</ CODE >', -36, -30, .5, '#c8ff00'], ['⚡ 30+ EVENTS', 24, -34, .9, '#ff0080'], ['3 DAYS', -40, 24, .7, '#00f0ff'], ['01 10 11', 28, 30, 1.2, '#a855ff'], ['★ CSI', -4, -44, .4, '#ffee00']]

export default function Hero({ ready }) {
  const root = useRef(), title = useRef(), sub = useRef()

  // ENTRANCE: XENIA rushes in from deep space toward you
  useEffect(() => {
    if (!ready) return
    gsap.fromTo('.hl', { scale: .04, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.9, stagger: .09, ease: 'expo.out' })
    gsap.fromTo('.hero-fade', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 1, stagger: .15 })
    gsap.fromTo('.stk', { scale: 0, rotate: -120, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1.1, stagger: .12, delay: 1.3, ease: 'back.out(2.2)' })
    scramble(sub.current, 'THE ULTIMATE TECH FEST BY CSI — ENTER THE GLITCH', 1.8)
    const iv = setInterval(() => {
      const ls = gsap.utils.toArray('.hl'), l = ls[Math.floor(Math.random() * ls.length)]
      if (fx.heroP > .02 || document.hidden) return
      gsap.timeline().to(l, { skewX: 35, scale: 1.12, filter: 'drop-shadow(8px 0 0 #ff0080) drop-shadow(-8px 0 0 #00f0ff)', duration: .06, yoyo: true, repeat: 5 })
        .set(l, { clearProps: 'filter,skewX,scale' })
    }, 2600)
    gsap.to('.hl', { y: -18, duration: .5, stagger: { each: .08, yoyo: true, repeat: 1 }, delay: 2.4, ease: 'sine.inOut' })
    return () => clearInterval(iv)
  }, [ready])

  // MOUSE PARALLAX (skipped on touch, throttled to one update per frame)
  useEffect(() => {
    if (matchMedia('(pointer: coarse)').matches) return
    let ev = null, raf = 0
    const apply = () => {
      raf = 0
      if (fx.heroP > .5) return
      const x = ev.clientX / innerWidth - .5, y = ev.clientY / innerHeight - .5
      gsap.to(title.current, { rotateY: x * 22, rotateX: -y * 22, duration: .8, ease: 'power3', overwrite: 'auto' })
      gsap.to('.hl', { x: (i) => x * (i - 2.5) * 30, duration: .8, ease: 'power3', overwrite: 'auto' })
      gsap.to('.stk', { x: (i, el) => -x * el.dataset.d * 90, y: (i, el) => -y * el.dataset.d * 90, duration: 1, ease: 'power3', overwrite: 'auto' })
    }
    const move = (e) => { ev = e; if (!raf) raf = requestAnimationFrame(apply) }
    addEventListener('mousemove', move, { passive: true })
    return () => { removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])

  // SCROLL: pin the hero, XENIA flies THROUGH the screen -> blur -> gone
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current, start: 'top top', end: '+=170%', pin: true, scrub: .7,
          anticipatePin: 1, invalidateOnRefresh: true, refreshPriority: 100,
          onUpdate: (s) => { fx.heroP = s.progress },
          onLeaveBack: () => { fx.heroP = 0 },
        },
      })
      // letters rush toward the camera, fanning out to the sides (kept readable, no giant blobs)
      tl.to('.mask', { scale: (i) => 4.2 + Math.abs(i - 2) * 1.4, rotation: (i) => (i - 2) * 3, ease: 'power3.in', duration: 1 }, 0)
        .to('.mask', { x: (i) => (i - 2) * innerWidth * .3, ease: 'power2.in', duration: 1 }, 0)
        .to('.mask', { opacity: 0, ease: 'power1.in', duration: .25 }, .74)
        // echo outlines = speed trails
        .to('.e1', { opacity: .85, scale: .78, duration: .25, ease: 'power2.out' }, .06)
        .to('.e2', { opacity: .7, scale: .58, duration: .3, ease: 'power2.out' }, .1)
        // everything else gets sucked away
        .to('.meta-out', { opacity: 0, y: -50, duration: .2 }, 0)
        .to('.stk-out', { scale: 3, opacity: 0, x: (i) => (i % 2 ? 1 : -1) * innerWidth * .55, y: (i) => (i < 2 ? -1 : 1) * innerHeight * .35, ease: 'power2.in', duration: .55 }, 0)
        .to('.hero-glow', { scale: 2.4, opacity: 0, duration: .8 }, .1)
        // flash as the letters pass through the lens
        .fromTo('.hero-flash', { opacity: 0 }, { opacity: .55, ease: 'power2.out', duration: .08 }, .66)
        .to('.hero-flash', { opacity: 0, ease: 'power2.in', duration: .26 }, .74)
    }, root)
    return () => { ctx.revert(); fx.heroP = 0 }
  }, [])

  return (
    <section id="top" ref={root} className="hero">
      <HeroShape />
      <div className="hero-glow" />
      <div className="hero-flash" />
      {stickers.map(([t, x, y, d, c], i) => (
        <div key={t} className="stk" data-d={d} style={{ left: `${50 + x}%`, top: `${50 + y}%`, '--c': c, '--dl': i * .6 + 's' }}>
          <div className="stk-out"><span>{t}</span></div>
        </div>
      ))}
      <div className="badge-wrap hero-fade">
        <div className="badge-out meta-out">
          <svg viewBox="0 0 200 200"><defs><path id="circ" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
            <text><textPath href="#circ">SCROLL • CHAOS • XENIA • CSI • 2026 • </textPath></text></svg>
          <b>↓</b>
        </div>
      </div>
      <div className="hero-in">
        <div className="meta-out"><div className="hero-fade tag">◉ CSI PRESENTS // EDITION 2026</div></div>
        <h1 ref={title} className="xenia">
          {'XENIA'.split('').map((c, i) => (
            <span key={i} className="mask"><span className="hl glitch" data-text={c} data-hover>{c}</span><span className="echo e1" aria-hidden>{c}</span><span className="echo e2" aria-hidden>{c}</span></span>
          ))}
        </h1>
        <p ref={sub} className="hero-sub meta-out" />
        <div className="meta-out"><div className="hero-fade hero-cta">
          <Magnetic><a href="#register" className="btn">Claim your spot →</a></Magnetic>
          <Magnetic><a href="#events" className="btn ghost">Explore events</a></Magnetic>
        </div></div>
      </div>
      <div className="scroll-hint hero-fade"><div className="sh-out meta-out">SCROLL<span /></div></div>
    </section>
  )
}
