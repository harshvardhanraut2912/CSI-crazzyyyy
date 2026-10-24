import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MatrixRain from './MatrixRain.jsx'
import { fx, chaos } from '../state.js'
import { EVENT_DATE } from '../config.js'

const sleep = (ms) => new Promise(r => setTimeout(r, ms))
const EVENTS = ['HACKSTORM', 'ROBO WARS', 'CAPTURE THE FLAG', 'PROMPT ARENA', 'PIXEL CLASH', 'UI/UX RUMBLE']

export default function Terminal() {
  const [lines, setLines] = useState([]), [val, setVal] = useState(''), [neo, setNeo] = useState(false)
  const body = useRef(), box = useRef(), input = useRef(), alive = useRef(true), hist = useRef([]), hi = useRef(-1)

  const push = (...l) => setLines(p => [...p, ...l.map(t => typeof t === 'string' ? { t, c: '' } : t)])
  const typeLine = async (text, c = '') => {
    setLines(p => [...p, { t: '', c }])
    for (let i = 1; i <= text.length && alive.current; i++) {
      setLines(p => { const q = [...p]; q[q.length - 1] = { t: text.slice(0, i), c }; return q })
      await sleep(16)
    }
  }

  useEffect(() => {
    alive.current = true
    const st = ScrollTrigger.create({
      trigger: box.current, start: 'top 75%', once: true,
      onEnter: async () => {
        await typeLine('$ xenia --status', 'cmd'); await sleep(200)
        push({ t: '> registrations ........ OPEN', c: 'ok' }); await sleep(200)
        push({ t: '> chaos level .......... MAXIMUM', c: 'err' }); await sleep(200)
        push({ t: '> sleep required ....... NONE', c: 'ok' }); await sleep(400)
        await typeLine('$ _ type "help" to play with me', 'cmd')
      },
    })
    return () => { alive.current = false; st.kill() }
  }, [])

  useEffect(() => { body.current.scrollTop = body.current.scrollHeight }, [lines])

  const run = async (raw) => {
    const cmd = raw.trim(), [c0, ...rest] = cmd.toLowerCase().split(/\s+/)
    push({ t: '$ ' + cmd, c: 'cmd' })
    if (!cmd) return
    hist.current.unshift(cmd); hi.current = -1
    switch (c0) {
      case 'help': push('commands:', '  events   — list the battles', '  date     — time until XENIA', '  register — teleport to sign-up', '  chaos    — ☠', '  matrix   — wake up, Neo', '  hack     — try it', '  whoami · sudo · clear'); break
      case 'events': EVENTS.forEach((e, i) => push({ t: `  [0${i + 1}] ${e}`, c: 'ok' })); break
      case 'date': {
        const ms = EVENT_DATE - Date.now()
        push(ms > 0 ? { t: `> T-minus ${Math.floor(ms / 864e5)} days ${Math.floor(ms % 864e5 / 36e5)} hrs. Get ready.`, c: 'ok' } : { t: '> IT IS HAPPENING. NOW.', c: 'err' }); break
      }
      case 'register': push({ t: '> teleporting ...', c: 'ok' }); setTimeout(() => fx.lenis?.scrollTo(document.getElementById('register'), { duration: 2.5 }), 500); break
      case 'chaos': push({ t: '> unleashing ☠', c: 'err' }); chaos(8000); break
      case 'matrix': setNeo(n => !n); push({ t: '> there is no spoon.', c: 'ok' }); break
      case 'whoami': push('a legend in the making.'); break
      case 'sudo': push({ t: 'nice try 😈  permission denied.', c: 'err' }); break
      case 'clear': setLines([]); break
      case 'hack': {
        for (const s of ['bypassing firewall ........ [██░░░░░░]', 'cracking mainframe ........ [█████░░░]', 'injecting memes ........... [████████]']) { push({ t: s, c: 'ok' }); await sleep(450) }
        push({ t: 'ACCESS GRANTED. just kidding — come compete for real.', c: 'err' }); break
      }
      default: push({ t: `command not found: ${c0} — try "help"`, c: 'err' })
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter') { run(val); setVal('') }
    if (e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); hi.current = Math.min(hi.current + 1, hist.current.length - 1); setVal(hist.current[hi.current] || '') }
    if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); hi.current = Math.max(hi.current - 1, -1); setVal(hist.current[hi.current] || '') }
    e.stopPropagation()   // keep Konami listener from seeing typing
  }

  return (
    <section id="terminal" className="term-sec">
      <MatrixRain boost={neo} />
      <div className="tag" style={{ position: 'relative' }}>// 02 — HACK THE PAGE</div>
      <h2 className="sec-title" style={{ position: 'relative', textAlign: 'center' }}>TALK TO <span className="outline">THE MACHINE</span></h2>
      <div ref={box} className="term" data-hover onClick={() => input.current.focus()}>
        <div className="term-bar"><i /><i /><i /><span>xenia@csi:~</span></div>
        <div ref={body} className="term-body" data-lenis-prevent>
          {lines.map((l, i) => <div key={i} className={l.c}>{l.t}</div>)}
          <div className="term-in"><span className="cmd">$</span>
            <input ref={input} value={val} onChange={e => setVal(e.target.value)} onKeyDown={onKey} spellCheck={false} autoComplete="off" placeholder="type a command..." />
          </div>
        </div>
      </div>
    </section>
  )
}
