import { useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, OrbitControls } from '@react-three/drei'
import { color, scene as S } from '@/tokens'
import Chip from './Chip'
import CameraRig from './CameraRig'
import Effects from './Effects'
import Floor from './Floor'
import MicroCells from './MicroCells'
import type { DieParams } from './DieMaterial'

export interface ChipSceneProps {
  progress: () => number
  params?: DieParams
  mobile?: boolean
  /** When false the frame loop is paused (hero scrolled out of view). */
  active?: boolean
  /** Scroll-driven camera path (home hero). */
  cameraRig?: boolean
  /** Limited drag-to-orbit with slow idle rotation (products). */
  orbit?: boolean
  /** Fires after the first frames have rendered (shaders compiled). */
  onReady?: () => void
  preserveDrawingBuffer?: boolean
  dof?: boolean
  micro?: boolean
  className?: string
  onCreatedCanvas?: (el: HTMLCanvasElement) => void
}

function ReadySignal({ onReady }: { onReady?: () => void }) {
  const frames = useRef(0)
  const fired = useRef(false)
  useFrame(() => {
    if (fired.current) return
    frames.current += 1
    if (frames.current >= 3) {
      fired.current = true
      onReady?.()
    }
  })
  return null
}

/** Generated low-key studio environment: no HDR download, same palette. */
function StudioEnv() {
  return (
    <Environment resolution={256} frames={1} background={false}>
      <Lightformer form="rect" intensity={1.5} color="#f6ecf0" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[9, 9, 1]} />
      <Lightformer form="rect" intensity={1.1} color="#f2dde4" position={[-6, 2, -2]} rotation-y={Math.PI / 2} scale={[8, 2.2, 1]} />
      <Lightformer form="rect" intensity={0.7} color={color.accentHi} position={[6, 1.2, 3]} rotation-y={-Math.PI / 2} scale={[6, 1.2, 1]} />
      <Lightformer form="ring" intensity={0.5} color={color.amber} position={[2, 3, -7]} scale={2.4} />
    </Environment>
  )
}

function OrbitSetup() {
  const { camera } = useThree()
  useEffect(() => {
    camera.position.set(2.7, 1.7, 3.1)
    camera.up.set(0, 1, 0)
    camera.lookAt(0, 0, 0)
  }, [camera])
  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      autoRotate
      autoRotateSpeed={0.5}
      enableDamping
      dampingFactor={0.06}
      minPolarAngle={0.95}
      maxPolarAngle={1.35}
      minAzimuthAngle={-0.75}
      maxAzimuthAngle={1.25}
      target={[0, 0, 0]}
    />
  )
}

export default function ChipScene({
  progress,
  params,
  mobile = false,
  active = true,
  cameraRig = false,
  orbit = false,
  onReady,
  preserveDrawingBuffer = false,
  dof = true,
  micro = true,
  className,
  onCreatedCanvas,
}: ChipSceneProps) {
  const dieParams = { lite: mobile, ...params }
  return (
    <Canvas
      className={className}
      dpr={[1, mobile ? 1.5 : S.maxDpr]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 32, near: 0.05, far: 80, position: [0, 8.9, 0.001] }}
      gl={{ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer, stencil: false }}
      onCreated={({ gl }) => onCreatedCanvas?.(gl.domElement)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <color attach="background" args={[color.bg0]} />
      <ambientLight intensity={0.18} color="#f2e6ea" />
      <directionalLight position={[3, 7, 2]} intensity={1.1} color="#f6ecf0" />
      <directionalLight position={[-4, 2.5, -3]} intensity={0.35} color={color.accentHi} />
      <StudioEnv />
      <Chip progress={progress} params={dieParams} />
      {micro && !mobile ? <MicroCells progress={progress} centerScale={params?.centerScale} blocks={params?.blocks} /> : null}
      <Floor progress={progress} />
      {cameraRig ? <CameraRig progress={progress} /> : null}
      {orbit ? <OrbitSetup /> : null}
      <Effects progress={progress} mobile={mobile} dof={dof} />
      <ReadySignal onReady={onReady} />
    </Canvas>
  )
}
