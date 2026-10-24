import { useEffect, useRef, useState } from 'react'

const secs = [['top', 'HOME'], ['about', 'ABOUT'], ['terminal', 'TERMINAL'], ['events', 'EVENTS'], ['tracks', 'TRACKS'], ['schedule', 'SCHEDULE'], ['prizes', 'PRIZES'], ['countdown', 'T-MINUS'], ['register', 'JOIN']]

export default function Progress() {
  const bar = useRef(), [act, setAct] = useState(0), [pct, setPct] = useState(0)
  useEffect(() => {
    let raf
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight
        const p = max > 0 ? scrollY / max : 0
        bar.current.style.transform = `scaleX(${p})`
        setPct(Math.round(p * 100))
        let a = 0
        secs.forEach(([id], i) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= innerHeight * .5) a = i })
        setAct(a)
      })
    }
    addEventListener('scroll', on, { passive: true }); on()
    return () => removeEventListener('scroll', on)
  }, [])
  return (
    <>
      <div ref={bar} className="pbar" />
      <div className="side">
        {secs.map(([id, l], i) => <a key={id} href={'#' + id} className={i === act ? 'act' : ''}><span>{String(i).padStart(2, '0')} {l}</span><i /></a>)}
      </div>
      <div className="pct">{String(pct).padStart(3, '0')}<small>%</small></div>
    </>
  )
}
