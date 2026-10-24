import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { fx } from '../state.js'

export default function HeroShape() {
  const ref = useRef()
  useEffect(() => {
    const el = ref.current, parent = el.parentElement
    const LOW = matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency || 8) <= 4
    const renderer = new THREE.WebGLRenderer({ canvas: el, alpha: true, antialias: false, powerPreference: 'low-power' })
    renderer.setPixelRatio(Math.min(devicePixelRatio, LOW ? 1 : 1.25))
    const cam = new THREE.PerspectiveCamera(50, 1, .1, 100); cam.position.z = 6.5
    const scene = new THREE.Scene()
    const uni = { uTime: { value: 0 }, uBoost: { value: 0 } }
    const mat = (a, b, op) => new THREE.ShaderMaterial({
      transparent: true, wireframe: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { ...uni, uA: { value: new THREE.Color(a) }, uB: { value: new THREE.Color(b) }, uOp: { value: op } },
      vertexShader: `uniform float uTime,uBoost; varying float vY;
        void main(){ vec3 p=position+normal*sin(position.y*3.+uTime*1.5)*.12*(1.+uBoost*3.)+normal*sin(position.x*4.-uTime)*.08;
        vY=p.y; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.); }`,
      fragmentShader: `uniform vec3 uA,uB; uniform float uOp; varying float vY;
        void main(){ gl_FragColor=vec4(mix(uA,uB,smoothstep(-1.5,1.5,vY)),uOp); }`,
    })
    const group = new THREE.Group(); scene.add(group)
    const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.25, .38, LOW ? 80 : 120, LOW ? 10 : 16, 2, 3), mat('#c8ff00', '#ff0080', .9))
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(2.7, 1), mat('#00f0ff', '#8a2be2', .35))
    const core = new THREE.Mesh(new THREE.OctahedronGeometry(.55), new THREE.MeshBasicMaterial({ color: '#ffffff', wireframe: true }))
    group.add(knot, ico, core)
    const rings = []
    ;[[3.5, '#c8ff00', 0], [4.0, '#ff0080', 1], [4.5, '#00f0ff', 2]].forEach(([r, c, i]) => {
      const holder = new THREE.Group()
      holder.add(new THREE.Mesh(new THREE.TorusGeometry(r, .012, 6, LOW ? 90 : 140), new THREE.MeshBasicMaterial({ color: c })))
      const orb = new THREE.Mesh(new THREE.SphereGeometry(.12, 12, 12), new THREE.MeshBasicMaterial({ color: c }))
      orb.position.x = r; holder.add(orb)
      holder.rotation.set(i * 1.1, i * .7, i * .4); holder.userData = { orb, r, s: 1 + i * .4 }
      group.add(holder); rings.push(holder)
    })
    const resize = () => {
      const w = parent.clientWidth, h = parent.clientHeight
      renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix()
    }
    resize(); addEventListener('resize', resize)
    const mt = { x: 0, y: 0 }, m = { x: 0, y: 0 }
    const onMove = (e) => { mt.x = e.clientX / innerWidth - .5; mt.y = e.clientY / innerHeight - .5 }
    addEventListener('mousemove', onMove)
    let raf, last = scrollY, boost = 0, lastVis = -1
    const loop = (ts) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return
      const hp = fx.heroP, vis = Math.max(0, 1 - hp * 1.25)
      if (vis !== lastVis) { el.style.opacity = vis; lastVis = vis }
      if (vis <= 0) return
      const t = ts / 1000
      boost = boost * .92 + Math.min(Math.abs(scrollY - last) / 50, 1) * .08; last = scrollY
      uni.uTime.value = t; uni.uBoost.value = boost
      m.x += (mt.x - m.x) * .06; m.y += (mt.y - m.y) * .06
      knot.rotation.x = t * .35 + hp * 5; knot.rotation.y = t * .5 + hp * 8
      ico.rotation.x = -t * .15; ico.rotation.y = -t * .22
      core.rotation.x = t * 1.2; core.rotation.y = t * .9
      rings.forEach((h) => { const { orb, r, s } = h.userData; orb.position.set(Math.cos(t * s) * r, Math.sin(t * s) * r, 0); h.rotation.z += .002 * s })
      group.rotation.y = m.x * 1.2; group.rotation.x = m.y * .8
      const sc = 1 + hp * 2.2; group.scale.setScalar(sc)
      renderer.render(scene, cam)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', resize); removeEventListener('mousemove', onMove); renderer.dispose() }
  }, [])
  return <canvas ref={ref} className="hero-shape" />
}
