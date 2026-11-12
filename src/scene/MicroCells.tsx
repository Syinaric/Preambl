import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { InstancedMesh, MeshStandardMaterial, Object3D } from 'three'
import { color, scene as S } from '@/tokens'
import { CHIP } from './Chip'
import { smoothstep } from './math'

/**
 * A shallow layer of real micro-geometry over the centre functional block
 * only (the zoom focus point). The shader forces that block to a known cell
 * pitch (`uCenterScale`) so these gates line up with the painted ones and
 * add true parallax when the camera dollies in. LOD: hidden when far.
 */
export default function MicroCells({ progress, centerScale = 36, blocks = 5 }: { progress: () => number; centerScale?: number; blocks?: number }) {
  const ref = useRef<InstancedMesh>(null)
  const count = centerScale * centerScale
  const active = CHIP.die * (1 - 2 * CHIP.margin)
  const block = active / blocks
  const cell = block / centerScale

  const mat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: color.graphiteHi,
        metalness: 0.9,
        roughness: 0.35,
        envMapIntensity: 0.6,
        emissive: color.accent,
        emissiveIntensity: 0,
      }),
    [],
  )

  useEffect(() => {
    const o = new Object3D()
    const half = block / 2
    let i = 0
    for (let y = 0; y < centerScale; y++) {
      for (let x = 0; x < centerScale; x++) {
        o.position.set(-half + (x + 0.5) * cell, CHIP.dieH + 0.0008 + 0.0012, -half + (y + 0.5) * cell)
        o.updateMatrix()
        ref.current?.setMatrixAt(i++, o.matrix)
      }
    }
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true
    return () => mat.dispose()
  }, [block, cell, centerScale, mat])

  useFrame(({ camera }) => {
    const m = ref.current
    if (!m) return
    const dist = camera.position.length()
    m.visible = dist < 6.4
    mat.emissiveIntensity = smoothstep(S.powerStart + 0.25, S.powerFull, progress()) * 0.7
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} material={mat} frustumCulled={false}>
      <boxGeometry args={[cell * 0.22, 0.0024, cell * 0.6]} />
    </instancedMesh>
  )
}
