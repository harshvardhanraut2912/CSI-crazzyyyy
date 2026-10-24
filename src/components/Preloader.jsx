import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const lines = ['> booting XENIA.core ...', '> injecting chaos.dll ...', '> calibrating hype levels ...', '> loading 1000+ minds ...', '> ACCESS GRANTED ⚡']

export default function Preloader({ onDone }) {
  const root = useRef(), [n, setN] = useState(0), [shown, setShown] = useState(0)
  useEffect(() => {
    const o = { v: 0 }
    const tl = gsap.timeline()
    tl.to(o, { v: 100, duration: 2.6, ease: 'power2.inOut', onUpdate: () => {
      setN(Math.round(o.v)); setShown(Math.min(lines.length, Math.floor(o.v / 20) + 1))
    } })
    tl.to('.pre-count', { scale: 1.4, duration: .15, yoyo: true, repeat: 3 })
    tl.to('.pre-inner', { opacity: 0, duration: .3 })
    tl.to('.pre-panel', { yPercent: -100, duration: .9, stagger: .08, ease: 'expo.inOut' })
    tl.add(() => onDone(), '-=.5')
    tl.set(root.current, { display: 'none' })
    return () => tl.kill()
  }, [])
  return (
    <div ref={root} className="pre">
      {[0, 1, 2, 3, 4].map(i => <div key={i} className="pre-panel" style={{ left: i * 20 + '%' }} />)}
      <div className="pre-inner">
        <div className="pre-count glitch" data-text={n + '%'}>{n}%</div>
        <div className="pre-log">{lines.slice(0, shown).map(l => <div key={l}>{l}</div>)}</div>
      </div>
    </div>
  )
}
