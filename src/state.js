// shared mutable FX state + tiny event helpers
export const fx = { chaos: 0, hue: 0, sound: false, lenis: null, active: false, heroP: 0 }
export const burst = (x, y, n = 30) => window.dispatchEvent(new CustomEvent('xenia:burst', { detail: { x, y, n } }))
export const ripple = (x, y) => window.dispatchEvent(new CustomEvent('xenia:ripple', { detail: { x, y } }))
export const chaos = (ms) => window.dispatchEvent(new CustomEvent('xenia:chaos', { detail: { ms } }))
