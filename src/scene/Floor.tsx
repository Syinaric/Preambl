import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Color, ShaderMaterial } from 'three'
import { color, scene as S } from '@/tokens'
import { CHIP } from './Chip'
import { smoothstep } from './math'

const vert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`
const frag = /* glsl */ `
uniform float uPower; uniform float uTime; uniform vec3 uAccent; uniform vec3 uBg; uniform vec3 uGrid;
varying vec2 vUv;
void main(){
  vec2 p = (vUv - .5) * 40.;
  float r = length(p);
  // contact shadow under the package
  float sq = max(abs(p.x), abs(p.y));
  float shadow = smoothstep(2.4, 1.3, sq) * .75;
  // energy spill
  float glow = exp(-r * r * .14) * uPower * (1. + .06 * sin(uTime * 1.7));
  // fine grid, fading with distance
  vec2 g = abs(fract(p * .5) - .5) / fwidth(p * .5);
  float line = 1. - min(min(g.x, g.y), 1.);
  float grid = line * exp(-r * .11);
  vec3 col = uBg * (1. - shadow);
  col += uGrid * grid * (.45 + uPower * .35);
  col += uAccent * glow * .32;
  gl_FragColor = vec4(col, 1.);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

export default function Floor({ progress }: { progress: () => number }) {
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uPower: { value: 0 },
          uTime: { value: 0 },
          uAccent: { value: new Color(color.accent) },
          uBg: { value: new Color(color.bg1) },
          uGrid: { value: new Color(color.line) },
        },
      }),
    [],
  )
  useFrame(({ clock }) => {
    mat.uniforms.uPower.value = smoothstep(S.powerStart, S.powerFull, progress())
    mat.uniforms.uTime.value = clock.elapsedTime
  })
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-CHIP.pkgH - 0.002} material={mat}>
      <planeGeometry args={[40, 40]} />
    </mesh>
  )
}
