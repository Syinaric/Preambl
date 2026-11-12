import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import {
  InstancedMesh,
  Matrix4,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PointLight,
} from 'three'
import { color, scene as S } from '@/tokens'
import { DieMaterial, type DieParams } from './DieMaterial'
import { smoothstep } from './math'

/** Chip dimensions in world units — shared with MicroCells and the camera rig. */
export const CHIP = {
  die: 2,
  dieH: 0.09,
  pkg: 2.7,
  pkgH: 0.16,
  padsPerSide: 22,
  padRadius: 1.19,
  margin: 0.052, // must match `margin` in die.glsl
}

interface ChipProps {
  /** Accessor for 0..1 progress (read every frame, no React state). */
  progress: () => number
  params?: DieParams
}

const RADIAL = [0, Math.PI / 2, Math.PI, -Math.PI / 2]

export default function Chip({ progress, params }: ChipProps) {
  const dieMat = useMemo(() => new DieMaterial(params), [])
  useEffect(() => {
    if (params) dieMat.setParams(params)
  }, [params, dieMat])
  useEffect(() => () => dieMat.dispose(), [dieMat])

  const padMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: color.silver,
        metalness: 1,
        roughness: 0.4,
        emissive: color.accent,
        emissiveIntensity: 0,
        envMapIntensity: 0.55,
      }),
    [],
  )
  const leadMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: color.silver,
        metalness: 1,
        roughness: 0.45,
        emissive: color.accentHi,
        emissiveIntensity: 0,
        envMapIntensity: 0.5,
      }),
    [],
  )
  const dieBodyMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: color.graphiteHi,
        metalness: 0.92,
        roughness: 0.3,
        envMapIntensity: 1.2,
      }),
    [],
  )
  const pkgMat = useMemo(
    () =>
      new MeshPhysicalMaterial({
        color: '#14080D',
        metalness: 0.35,
        roughness: 0.62,
        clearcoat: 0.35,
        clearcoatRoughness: 0.45,
        envMapIntensity: 0.9,
      }),
    [],
  )

  const pads = useRef<InstancedMesh>(null)
  const leads = useRef<InstancedMesh>(null)
  const spill = useRef<PointLight>(null)
  const count = CHIP.padsPerSide * 4

  // Lay out pads and lead-frame wires around the die perimeter.
  useEffect(() => {
    const m = new Matrix4()
    const rot = new Matrix4()
    const pos = new Matrix4()
    const tilt = new Matrix4()
    const rise = CHIP.dieH + 0.006
    const drop = 0.012
    const r0 = CHIP.die / 2 - 0.02
    const r1 = CHIP.padRadius - 0.02
    const ang = Math.atan2(rise - drop, r1 - r0)
    let i = 0
    for (let s = 0; s < 4; s++) {
      rot.makeRotationY(RADIAL[s])
      for (let k = 0; k < CHIP.padsPerSide; k++) {
        const along = -0.91 + (k / (CHIP.padsPerSide - 1)) * 1.82
        // pad on the package
        pos.makeTranslation(CHIP.padRadius, 0.004, along)
        m.multiplyMatrices(rot, pos)
        pads.current?.setMatrixAt(i, m)
        // lead from die edge down to the pad
        pos.makeTranslation((r0 + r1) / 2, (rise + drop) / 2, along)
        tilt.makeRotationZ(-ang)
        m.multiplyMatrices(rot, pos).multiply(tilt)
        leads.current?.setMatrixAt(i, m)
        i++
      }
    }
    if (pads.current) pads.current.instanceMatrix.needsUpdate = true
    if (leads.current) leads.current.instanceMatrix.needsUpdate = true
    return () => {
      padMat.dispose()
      leadMat.dispose()
      dieBodyMat.dispose()
      pkgMat.dispose()
    }
  }, [padMat, leadMat, dieBodyMat, pkgMat])

  useFrame(({ clock }) => {
    const p = progress()
    const t = clock.elapsedTime
    dieMat.uniforms.uProgress.value = p
    dieMat.uniforms.uTime.value = t
    const power = smoothstep(S.powerStart, S.powerFull, p)
    const edge = smoothstep(0.18, 0.46, p)
    padMat.emissiveIntensity = edge * 1.6
    leadMat.emissiveIntensity = edge * 0.9
    if (spill.current) {
      spill.current.intensity = power * (5.5 + Math.sin(t * 1.7) * 0.35)
    }
  })

  return (
    <group>
      {/* package / substrate */}
      <RoundedBox args={[CHIP.pkg, CHIP.pkgH, CHIP.pkg]} radius={0.035} smoothness={4} position-y={-CHIP.pkgH / 2} material={pkgMat} />
      {/* die body: gives the side faces + bevel seen at the final angle */}
      <RoundedBox args={[CHIP.die, CHIP.dieH, CHIP.die]} radius={0.012} smoothness={3} position-y={CHIP.dieH / 2} material={dieBodyMat} />
      {/* die surface: procedural transistor field */}
      <mesh rotation-x={-Math.PI / 2} position-y={CHIP.dieH + 0.0008} material={dieMat}>
        <planeGeometry args={[CHIP.die, CHIP.die]} />
      </mesh>
      {/* bond pads on the package */}
      <instancedMesh ref={pads} args={[undefined, undefined, count]} material={padMat}>
        <boxGeometry args={[0.07, 0.008, 0.038]} />
      </instancedMesh>
      {/* lead-frame wires */}
      <instancedMesh ref={leads} args={[undefined, undefined, count]} material={leadMat}>
        <boxGeometry args={[Math.hypot(CHIP.padRadius - CHIP.die / 2, CHIP.dieH), 0.004, 0.011]} />
      </instancedMesh>
      {/* energy spill onto the package and floor */}
      <pointLight ref={spill} position={[0, 0.9, 0]} color={color.accent} intensity={0} distance={7} decay={2} />
    </group>
  )
}
