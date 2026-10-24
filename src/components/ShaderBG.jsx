import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { fx } from '../state.js'

const LOW = matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4
const frag = `
precision highp float;
#define OCT ${LOW ? 3 : 5}
uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse; uniform float uScroll; uniform float uBoost; uniform float uHue; uniform float uChaos;
uniform vec3 uRip[5];
vec3 hash3(vec2 p){ vec3 q=vec3(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)),dot(p,vec2(419.2,371.9))); return fract(sin(q)*43758.5453);}
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  float a=hash3(i).x,b=hash3(i+vec2(1,0)).x,c=hash3(i+vec2(0,1)).x,d=hash3(i+vec2(1,1)).x;
  return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<OCT;i++){ v+=a*noise(p); p=mat2(1.6,1.2,-1.2,1.6)*p; a*=.5;} return v;}
vec3 hue(vec3 c,float a){ const vec3 k=vec3(.57735); float ca=cos(a); return c*ca+cross(k,c)*sin(a)+k*dot(k,c)*(1.-ca); }
void main(){
  vec2 uv=gl_FragCoord.xy/uRes; vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
  vec2 m=(uMouse-.5*uRes)/uRes.y;
  float d=length(p-m);
  p += (p-m)*.18*exp(-d*4.)*(1.+uBoost*2.);
  // click shockwaves
  float ring=0.;
  for(int i=0;i<5;i++){
    vec3 r=uRip[i]; float age=uTime-r.z;
    if(age>0. && age<3.){
      vec2 c=(r.xy-.5*uRes)/uRes.y; vec2 dv=p-c; float dd=length(dv);
      float w=exp(-pow((dd-age*.9)*14.,2.))*(1.-age/3.);
      p+=normalize(dv+1e-5)*w*.07; ring+=w;
    }
  }
  float t=uTime*(.12+uChaos*.35);
  vec2 q=vec2(fbm(p*2.+t), fbm(p*2.+vec2(5.2,1.3)-t));
  vec2 r2=vec2(fbm(p*2.+4.*q+vec2(1.7,9.2)+t*1.5), fbm(p*2.+4.*q+vec2(8.3,2.8)-t*1.2));
  float f=fbm(p*2.+4.*r2 + uScroll*.0006);
  vec3 c1=vec3(.02,.0,.08), c2=vec3(.55,.0,1.), c3=vec3(.78,1.,.0), c4=vec3(1.,.0,.5);
  vec3 col=mix(c1,c2,smoothstep(.15,.65,f));
  col=mix(col,c4,smoothstep(.55,.95,length(q))*.7);
  col=mix(col,c3,smoothstep(.75,1.1,length(r2)*f*1.6)*.9);
  col += vec3(.78,1.,.0)*.12/(d*d*40.+.25)*(.5+uBoost);
  col += vec3(1.,.9,.6)*ring*.55;
  // synthwave grid floor
  float hz=.4;
  if(uv.y<hz){
    float k=hz-uv.y; float z=.09/k;
    vec2 g=vec2((uv.x-.5)*z*3., z+uTime*.5+uScroll*.0015);
    vec2 gl=abs(fract(g)-.5);
    float line=smoothstep(.45,.5,max(gl.x,gl.y));
    col += mix(vec3(0.,.94,1.),vec3(1.,0.,.5),uv.x)*line*smoothstep(0.,.12,k)*.32;
  }
  col += vec3(1.,0.,.5)*exp(-abs(uv.y-hz)*28.)*.18;
  col=hue(col,uHue);
  // subtle blue tint + slight dim so the title pops
  col=mix(col,col*vec3(.78,.92,1.22)+vec3(0.,.012,.05),.5);
  col*=.82+.18*sin(gl_FragCoord.y*1.5+uTime*4.);
  col*=smoothstep(1.3,.2,length(uv-.5)*1.4);
  gl_FragColor=vec4(col*.74,1.);
}`

export default function ShaderBG() {
  const ref = useRef()
  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ canvas: ref.current, antialias: false })
    let q = LOW ? .6 : 1
    const basePR = Math.min(devicePixelRatio, 1.25)
    renderer.setPixelRatio(basePR * q)
    const scene = new THREE.Scene()
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const rips = Array.from({ length: 5 }, () => new THREE.Vector3(0, 0, -100))
    const u = {
      uTime: { value: 0 }, uRes: { value: new THREE.Vector2() },
      uMouse: { value: new THREE.Vector2() }, uScroll: { value: 0 }, uBoost: { value: 0 },
      uHue: { value: 0 }, uChaos: { value: 0 }, uRip: { value: rips },
    }
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ uniforms: u, fragmentShader: frag, vertexShader: 'void main(){gl_Position=vec4(position,1.);}' })))
    const resize = () => {
      renderer.setPixelRatio(basePR * q)
      renderer.setSize(innerWidth, innerHeight, false)
      renderer.domElement.style.width = '100%'; renderer.domElement.style.height = '100%'
      const pr = renderer.getPixelRatio()
      u.uRes.value.set(innerWidth * pr, innerHeight * pr)
    }
    resize()
    const target = new THREE.Vector2(innerWidth / 2, innerHeight / 2)
    const onMove = (e) => target.set(e.clientX, innerHeight - e.clientY)
    let ri = 0
    const addRip = (x, y) => {
      const pr = renderer.getPixelRatio()
      rips[ri % 5].set(x * pr, (innerHeight - y) * pr, performance.now() / 1000); ri++
    }
    const onClick = (e) => addRip(e.clientX, e.clientY)
    const onRip = (e) => addRip(e.detail.x, e.detail.y)
    addEventListener('mousemove', onMove); addEventListener('resize', resize)
    addEventListener('click', onClick); addEventListener('xenia:ripple', onRip)
    u.uMouse.value.set(innerWidth / 2, innerHeight / 2).multiplyScalar(renderer.getPixelRatio())
    let raf, last = scrollY, boost = 0, lastT = 0, acc = 0, n = 0
    const loop = (t) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) return
      const dt = t - lastT
      if (LOW && dt < 33) return            // 30fps cap on weak devices
      lastT = t
      // adaptive resolution: drop render scale if frames are slow
      if (dt < 200) { acc += dt; n++ }
      if (n >= 40) { const avg = acc / n; acc = 0; n = 0; if (avg > (LOW ? 40 : 24) && q > .4) { q = Math.max(.4, q - .15); resize() } }
      u.uTime.value = t / 1000
      const pr = renderer.getPixelRatio()
      u.uMouse.value.lerp(target.clone().multiplyScalar(pr), .08)
      boost = boost * .93 + Math.min(Math.abs(scrollY - last) / 60, 1) * .07
      last = scrollY
      u.uBoost.value = boost + fx.heroP * (1 - fx.heroP) * 4.5; u.uScroll.value = scrollY
      u.uHue.value = fx.hue; u.uChaos.value = fx.chaos
      renderer.render(scene, cam)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('mousemove', onMove); removeEventListener('resize', resize)
      removeEventListener('click', onClick); removeEventListener('xenia:ripple', onRip)
      renderer.dispose()
    }
  }, [])
  return <canvas ref={ref} className="bg" />
}
