import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { CatmullRomCurve3, Vector3 } from 'three'
import { scene as S } from '@/tokens'
import { easeInOut, smoothstep } from './math'

/**
 * Scroll-scrubbed camera path.
 *  progress 0        → straight down, chip ~60–70% of viewport
 *  progress 0..0.4   → dolly in (transistor detail becomes readable)
 *  progress 0.4..1   → arc down and around to a low three-quarter view
 * One Catmull-Rom spline, arc-length parameterised, eased end to end.
 */
const PATH = [
  new Vector3(0, 8.9, 0.001),
  new Vector3(0, 6.7, 0.001),
  new Vector3(0, 4.55, 0.001), // end of dolly
  new Vector3(1.35, 3.3, 2.5),
  new Vector3(2.95, 1.42, 3.45), // ~18° elevation, ~40° azimuth
]

const UP_TOP = new Vector3(0, 0, -1)
const UP_SIDE = new Vector3(0, 1, 0)

export default function CameraRig({ progress }: { progress: () => number }) {
  const { camera, size } = useThree()

  const { curve, dollyFrac } = useMemo(() => {
    const c = new CatmullRomCurve3(PATH, false, 'centripetal', 0.5)
    const lengths = c.getLengths(400)
    const total = lengths[lengths.length - 1]
    // spline param at the 3rd control point (index 2 of 4 segments) = 0.5
    const atDolly = lengths[Math.round(0.5 * 400)]
    return { curve: c, dollyFrac: atDolly / total }
  }, [])

  const tmp = useMemo(
    () => ({ pos: new Vector3(), target: new Vector3(), up: new Vector3() }),
    [],
  )

  useFrame(({ clock }) => {
    const p = Math.min(1, Math.max(0, progress()))
    const e = easeInOut(p)
    // remap so the dolly ends exactly at the token's dollyEnd
    const d = S.dollyEnd
    const u = e < d ? (e / d) * dollyFrac : dollyFrac + ((e - d) / (1 - d)) * (1 - dollyFrac)
    curve.getPointAt(Math.min(0.9999, u), tmp.pos)

    // look-at target drifts slightly for a cinematic feel
    const drift = smoothstep(0.4, 1, p)
    const t = clock.elapsedTime
    // top view: target shifted so the chip sits below the headline (screen-up is -z there);
    // final view: target lowered so the chip rises clear of the closing line.
    const topShift = 0.32 * (1 - smoothstep(0.1, 0.5, p))
    tmp.target.set(
      0.12 * drift + Math.sin(t * 0.27) * 0.012,
      0.06 * drift - 0.42 * drift,
      -0.08 * drift - topShift + Math.cos(t * 0.21) * 0.012,
    )

    // portrait viewports: back off so the package stays in frame
    const aspect = size.width / size.height
    const k = aspect < 1 ? Math.min(1.9, Math.pow(1 / aspect, 0.85)) : 1
    tmp.pos.sub(tmp.target).multiplyScalar(k).add(tmp.target)

    // blend the up vector: looking straight down needs an explicit up
    const upMix = smoothstep(0.35, 0.65, u)
    tmp.up.copy(UP_TOP).lerp(UP_SIDE, upMix).normalize()
    camera.up.copy(tmp.up)
    camera.position.copy(tmp.pos)
    camera.lookAt(tmp.target)
  })

  return null
}
