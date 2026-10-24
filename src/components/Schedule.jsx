import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const days = [
  ['DAY 01', 'IGNITION', [['09:00', 'Opening Ceremony', 'Lights. Fire. Keynote. Let the chaos begin.'], ['11:00', 'Hackstorm Kickoff', '24 hours on the clock — problem statements drop.'], ['15:00', 'CTF Begins', 'Flags are hidden. Leaderboard goes live.'], ['20:00', 'Neon Night', 'Music, lasers, networking.']]],
  ['DAY 02', 'MAYHEM', [['10:00', 'Robo Wars Qualifiers', 'Bots enter the arena. Not all leave.'], ['13:00', 'Prompt Arena', 'Humans vs machines. Creativity wins.'], ['17:00', 'Pixel Clash', 'Esports group stage on the big screen.'], ['22:00', 'DJ Night', 'Because you earned it.']]],
  ['DAY 03', 'FINAL BOSS', [['09:00', 'Hackstorm Demos', 'Pitch it. Defend it. Ship it.'], ['12:00', 'Grand Finals', 'Robo Wars + Pixel Clash + CTF showdown.'], ['16:00', 'Prize Ceremony', 'Glory, trophies and cash.'], ['18:00', 'Closing', 'Until XENIA returns.']]],
]

export default function Schedule() {
  const ref = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: '.sch-wrap', start: 'top 60%', end: 'bottom 60%', scrub: true }
      gsap.to('.sch-fill', { scaleY: 1, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.sch-dot', { top: '0%' }, { top: '100%', ease: 'none', scrollTrigger: st })
      gsap.utils.toArray('.sch-row').forEach((r, i) => {
        const dir = r.classList.contains('l') ? -1 : 1
        gsap.from(r, { opacity: 0, x: dir * 140, rotateY: dir * -50, scale: .85, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: r, start: 'top 88%' } })
      })
      gsap.utils.toArray('.sch-day').forEach(d => gsap.from(d, { scale: 0, rotate: -12, duration: .9, ease: 'back.out(2.5)', scrollTrigger: { trigger: d, start: 'top 85%' } }))
    }, ref)
    return () => ctx.revert()
  }, [])
  let n = 0
  return (
    <section id="schedule" ref={ref} className="sch">
      <div className="tag">// 05 — THE PLAN</div>
      <h2 className="sec-title">72 HOURS <span className="outline">OF MADNESS</span></h2>
      <div className="sch-wrap">
        <div className="sch-line"><div className="sch-fill" /></div>
        <div className="sch-dot" />
        {days.map(([d, name, items]) => (
          <div key={d} className="sch-block">
            <div className="sch-day"><small>{d}</small>{name}</div>
            {items.map(([t, h, p]) => (
              <div key={t + h} className={'sch-row ' + (n++ % 2 ? 'r' : 'l')} data-hover>
                <div className="sch-time">{t}</div><h4>{h}</h4><p>{p}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
