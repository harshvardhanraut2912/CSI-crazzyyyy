import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fx } from '../state.js'

const CH = '!<>-_/[]{}=+*^?#01'
const FINE = matchMedia('(pointer: fine)').matches
const CALM = matchMedia('(prefers-reduced-motion: reduce)').matches
const LOW = !FINE || (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4

// split text nodes into inline-block letters (words stay unbroken), keeping child elements intact
function split(node, out) {
  for (const c of [...node.childNodes]) {
    if (c.nodeType === 3) {
      const frag = document.createDocumentFragment()
      c.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return
        if (/^\s+$/.test(w)) return frag.appendChild(document.createTextNode(' '))
        const word = document.createElement('span'); word.className = 'wd'; word.setAttribute('aria-hidden', 'true')
        for (const ch of w) { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; word.appendChild(s); out.push(s) }
        frag.appendChild(word)
      })
      c.replaceWith(frag)
    } else if (c.nodeType === 1) split(c, out)
  }
}
const fmt = (n) => n.toLocaleString('en-IN')

// scroll-driven extras, all transform/opacity based and cheap enough for phones
export default function Reveals({ ready }) {
  useEffect(() => {
    if (!ready || CALM) return
    const cleanups = []
    const ctx = gsap.context(() => {
      // 1) section titles: letters pop in with a twist
      const titles = []
      document.querySelectorAll('.sec-title').forEach(el => {
        el.setAttribute('aria-label', el.textContent)
        const chars = []; split(el, chars); titles.push({ el, chars })
        gsap.from(chars, { y: 70, opacity: 0, rotate: (i) => (i % 2 ? 10 : -10), scale: .6, stagger: { each: .03, from: 'start' }, duration: .9, ease: 'back.out(2.2)',
          clearProps: 'transform,opacity', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      })

      // 2) tags: decode text + neon underline wipe
      document.querySelectorAll('.tag').forEach(el => {
        if (el.closest('.hero') || el.children.length || el.textContent.length > 40) return
        const text = el.textContent, o = { p: 0 }
        if (el.parentElement.tagName === 'SECTION' && getComputedStyle(el).position === 'static') el.classList.add('wipe')
        ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => {
          el.classList.add('in')
          gsap.to(o, { p: 1, duration: .9, ease: 'none', onUpdate: () => {
            el.textContent = text.split('').map((c, i) => c === ' ' || i < o.p * text.length ? c : CH[(Math.random() * CH.length) | 0]).join('')
          }, onComplete: () => { el.textContent = text } })
        } })
      })

      // 3) prize amounts count up
      document.querySelectorAll('.pz b').forEach(b => {
        const end = +b.textContent.replace(/[^\d]/g, ''); if (!end) return
        const o = { v: 0 }
        gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: () => (b.textContent = '₹' + fmt(Math.round(o.v))),
          scrollTrigger: { trigger: b, start: 'top 92%', once: true } })
      })
    })

    if (FINE && !LOW) {
      // 4) scroll-speed RGB split on titles (only active while scrolling fast)
      const root = document.documentElement
      let cur = 0, on = false
      const tick = () => {
        const target = Math.min(Math.abs(fx.lenis?.velocity || 0) * .35, 7)
        cur += (target - cur) * .18
        const v = cur < .15 ? 0 : cur
        if (v) root.style.setProperty('--rgb', v.toFixed(2))
        if ((v > 0) !== on) { on = v > 0; root.classList.toggle('vel', on) }
      }
      gsap.ticker.add(tick); cleanups.push(() => { gsap.ticker.remove(tick); root.classList.remove('vel') })

      // 5) cursor gravity: title letters shy away from the pointer
      const letters = [...document.querySelectorAll('.sec-title .ch')]
      let ev = null, raf = 0, dirty = new Set()
      const run = () => {
        raf = 0
        const { clientX: mx, clientY: my } = ev
        const now = new Set()
        for (const s of letters) {
          const r = s.getBoundingClientRect()
          if (r.bottom < 0 || r.top > innerHeight) continue
          const cx = r.left + r.width / 2 - (s._x || 0), cy = r.top + r.height / 2 - (s._y || 0)
          const dx = cx - mx, dy = cy - my, d2 = dx * dx + dy * dy
          if (d2 < 22000) {
            const d = Math.sqrt(d2) || 1, f = (1 - d / 148) * 34
            s._x = dx / d * f; s._y = dy / d * f; s.style.translate = `${s._x.toFixed(1)}px ${s._y.toFixed(1)}px`; now.add(s)
          } else if (s._x || s._y) { s._x = s._y = 0; s.style.translate = '' }
        }
        dirty = now
      }
      const mv = (e) => { ev = e; if (!raf) raf = requestAnimationFrame(run) }
      addEventListener('mousemove', mv, { passive: true })
      cleanups.push(() => { removeEventListener('mousemove', mv); cancelAnimationFrame(raf) })

      // 6) cursor spotlight inside cards
      const sp = (e) => {
        const t = e.target.closest?.('.stat,.sch-row'); if (!t) return
        const r = t.getBoundingClientRect()
        t.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%')
        t.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%')
      }
      addEventListener('mousemove', sp, { passive: true })
      cleanups.push(() => removeEventListener('mousemove', sp))
    }

    ScrollTrigger.refresh()
    return () => { cleanups.forEach(f => f()); ctx.revert() }
  }, [ready])
  return null
}
