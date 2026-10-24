import { fx } from './state.js'
let ctx
export function blip(freq = 600, dur = .06, type = 'square', vol = .03) {
  if (!fx.sound) return
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime
    o.type = type
    o.frequency.setValueAtTime(freq, t)
    o.frequency.exponentialRampToValueAtTime(freq * 1.8, t + dur)
    g.gain.setValueAtTime(vol, t)
    g.gain.exponentialRampToValueAtTime(.0001, t + dur)
    o.connect(g).connect(ctx.destination)
    o.start(); o.stop(t + dur)
  } catch {}
}
export function initHoverSounds() {
  let last = null
  const over = (e) => {
    const t = e.target.closest?.('a,button,[data-hover]')
    if (t && t !== last) blip(700 + Math.random() * 500, .05, 'square', .02)
    last = t || null
  }
  const click = () => blip(160, .2, 'sawtooth', .05)
  addEventListener('mouseover', over); addEventListener('click', click)
  return () => { removeEventListener('mouseover', over); removeEventListener('click', click) }
}
