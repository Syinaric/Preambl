import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing'
import { BlendFunction, DepthOfFieldEffect, ToneMappingMode } from 'postprocessing'
import { Vector2 } from 'three'
import { smoothstep } from './math'

interface Props {
  progress: () => number
  mobile?: boolean
  /** Depth of field only ramps in at the final angle; off on mobile. */
  dof?: boolean
}

export default function Effects({ progress, mobile = false, dof = true }: Props) {
  const dofRef = useRef<DepthOfFieldEffect>(null)
  const caOffset = useMemo(() => new Vector2(0.0007, 0.0007), [])

  useFrame(() => {
    if (dofRef.current) dofRef.current.bokehScale = smoothstep(0.72, 1, progress()) * 2.4
  })

  const useDof = dof && !mobile
  return (
    <EffectComposer multisampling={mobile ? 0 : 4} enableNormalPass={false}>
      {/* threshold tuned so only energised areas bloom, not the metal */}
      <Bloom mipmapBlur intensity={1.25} luminanceThreshold={0.72} luminanceSmoothing={0.28} radius={0.72} />
      {useDof ? <DepthOfField ref={dofRef} target={[0, 0.05, 0]} focalLength={0.045} bokehScale={0} height={480} /> : <></>}
      <ChromaticAberration offset={caOffset} radialModulation modulationOffset={0.45} blendFunction={BlendFunction.NORMAL} />
      <Vignette eskil={false} offset={0.22} darkness={0.62} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
