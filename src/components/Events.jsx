import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const events = [
  { n: '01', t: 'HACKSTORM', d: '24-hour hackathon. Ship something insane before the sun comes up.', c: '#c8ff00' },
  { n: '02', t: 'ROBO WARS', d: 'Metal. Sparks. Pure destruction. Last bot rolling wins.', c: '#ff0080' },
  { n: '03', t: 'CAPTURE THE FLAG', d: 'Hack, crack, exploit. Climb the leaderboard in real time.', c: '#00f0ff' },
  { n: '04', t: 'PROMPT ARENA', d: 'Out-prompt the machine. AI vs creativity showdown.', c: '#a855ff' },
  { n: '05', t: 'PIXEL CLASH', d: 'Esports finals under the big screen. Bring your squad.', c: '#ff7a00' },
  { n: '06', t: 'UI/UX RUMBLE', d: 'Design sprint, brutal critique, one winner.', c: '#ffee00' },
]

function Card({ e }) {
  const el = useRef()
  const move = (ev) => {
    const r = el.current.getBoundingClientRect()
    const x = (ev.clientX - r.left) / r.width - .5, y = (ev.clientY - r.top) / r.height - .5
    gsap.to(el.current, { rotateY: x * 24, rotateX: -y * 24, duration: .4 })
    el.current.style.setProperty('--mx', (x + .5) * 100 + '%'); el.current.style.setProperty('--my', (y + .5) * 100 + '%')
  }
  const leave = () => gsap.to(el.current, { rotateX: 0, rotateY: 0, duration: .8, ease: 'elastic.out(1,.5)' })
  return (
    <div className="card-wrap">
      <div ref={el} className="card" data-hover onMouseMove={move} onMouseLeave={leave} style={{ '--c': e.c }}>
        <div className="card-num">{e.n}</div>
        <h3 className="glitch" data-text={e.t}>{e.t}</h3>
        <p>{e.d}</p>
        <div className="card-foot"><span>REGISTER</span><b>↗</b></div>
      </div>
    </div>
  )
}

export default function Events() {
  const sec = useRef(), track = useRef()
  useEffect(() => {
    const ctx = gsap.context(() => {
      const dist = () => track.current.scrollWidth - innerWidth + innerWidth * .1
      gsap.to(track.current, { x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: sec.current, pin: true, scrub: .6, end: () => '+=' + dist(), invalidateOnRefresh: true } })
      gsap.to('.ev-bg', { xPercent: -30, ease: 'none', scrollTrigger: { trigger: sec.current, scrub: true, end: () => '+=' + dist() } })
    }, sec)
    return () => ctx.revert()
  }, [])
  return (
    <section id="events" ref={sec} className="events">
      <div className="ev-bg">EVENTS EVENTS EVENTS</div>
      <div ref={track} className="ev-track">
        <div className="ev-title"><div className="tag">// 02 — THE ARENA</div><h2>PICK<br />YOUR<br />BATTLE</h2></div>
        {events.map(e => <Card key={e.n} e={e} />)}
      </div>
    </section>
  )
}
