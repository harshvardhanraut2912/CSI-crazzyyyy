import { useEffect, useState } from 'react'

const msg = '● REGISTRATIONS OPEN ✦ 30+ EVENTS ✦ ₹5L+ PRIZE POOL ✦ NO SLEEP. ONLY CODE. ✦ BRING YOUR SQUAD ✦ TYPE "help" IN THE TERMINAL ✦ TRY THE KONAMI CODE ✦ '
export default function Ticker() {
  const [t, setT] = useState('')
  useEffect(() => {
    const f = () => setT(new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' }))
    f(); const id = setInterval(f, 1000); return () => clearInterval(id)
  }, [])
  return (
    <div className="ticker">
      <div className="tick-track">{[0, 1].map(k => <div key={k} className="tick-half">{[0, 1, 2].map(j => <span key={j}>{msg}</span>)}</div>)}</div>
      <div className="clock">IST {t}</div>
    </div>
  )
}
