import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { fx } from '../state.js'

const vert = `
attribute float aSeed; attribute float aSize;
uniform float uTime, uScroll, uPR, uWarp; uniform vec2 uMouse;
varying float vSeed; varying float vA;
void main(){
  vec3 p=position;
  p.z=mod(p.z+uTime*(8.+aSeed*10.)+uScroll*.04+uWarp*140.,200.)-200.;
  p.x+=sin(uTime*.5+aSeed*20.)*2.; p.y+=cos(uTime*.4+aSeed*30.)*2.;
  vec4 mv=modelViewMatrix*vec4(p,1.);
  vec4 clip=projectionMatrix*mv;
  vec2 ndc=clip.xy/clip.w; vec2 dd=ndc-uMouse;
  float f=exp(-dot(dd,dd)*10.)*.25;
  clip.xy+=normalize(dd+vec2(1e-4))*f*clip.w;
  gl_Position=clip;
  gl_PointSize=min(aSize*uPR*(220./-mv.z),60.);
  vSeed=aSeed;
  vA=smoothstep(-200.,-140.,p.z)*(1.-smoothstep(-8.,-1.,p.z));
}`
const frag = `
varying float vSeed; varying float vA;
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,0.,d); a*=a;
  vec3 col=mix(vec3(.78,1.,0.),vec3(1.,0.,.5),step(.5,vSeed));
  col=mix(col,vec3(0.,.94,1.),step(.8,vSeed));
  gl_FragColor=vec4(col,a*vA);
}`

export default function ParticleField() {
  const ref = useRef()
  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ canvas: ref.current, alpha: true, antialias: false })
    const pr = Math.min(devicePixelRatio, 1.5)
    renderer.setPixelRatio(pr); renderer.setSize(innerWidth, innerHeight, false)
    const scene = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, .1, 400)
    const N = innerWidth < 700 ? 1500 : 4500
    const pos = new Float32Array(N * 3), seed = new Float32Array(N), size = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - .5) * 240; pos[i * 3 + 1] = (Math.random() - .5) * 150; pos[i * 3 + 2] = Math.random() * 200
      seed[i] = Math.random(); size[i] = Math.random() * 2 + .6
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    const u = { uTime: { value: 0 }, uScroll: { value: 0 }, uPR: { value: pr }, uWarp: { value: 0 }, uMouse: { value: new THREE.Vector2(9, 9) } }
    const pts = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: u, vertexShader: vert, fragmentShader: frag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    scene.add(pts)
    const m = new THREE.Vector2(9, 9), mt = new THREE.Vector2(9, 9)
    const onMove = (e) => mt.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
    const resize = () => { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix() }
    addEventListener('mousemove', onMove); addEventListener('resize', resize)
    let raf
    const loop = (t) => {
      u.uTime.value = t / 1000; u.uScroll.value = scrollY; u.uWarp.value = fx.heroP
      m.lerp(mt, .1); u.uMouse.value.copy(m)
      pts.rotation.z = scrollY * .0003 + (m.x < 5 ? m.x * .05 : 0)
      pts.rotation.y = m.x < 5 ? m.x * .12 : 0
      renderer.render(scene, cam)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(raf); removeEventListener('mousemove', onMove); removeEventListener('resize', resize); g.dispose(); renderer.dispose() }
  }, [])
  return <canvas ref={ref} className="pf" />
}
