import { useEffect, useRef, useState } from 'react'
import ChipScene from '@/scene/ChipScene'
import { scene as S } from '@/tokens'

/**
 * Dev-only route (/dev/chip): scrub uProgress and the camera path with a
 * slider, tweak die parameters, and capture the final powered frame as the
 * no-WebGL fallback PNG (save it to public/fallback/chip-final.png).
 */
export default function DevChip() {
  const [progress, setProgress] = useState(1)
  const [auto, setAuto] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [camera, setCamera] = useState<'rig' | 'orbit'>('rig')
  const [seed, setSeed] = useState(0)
  const [blocks, setBlocks] = useState(5)
  const [cellScale, setCellScale] = useState(170)
  const ref = useRef(progress)
  ref.current = progress
  const canvas = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!auto) return
    let raf = 0
    let dir = 1
    const tick = () => {
      setProgress((p) => {
        let n = p + dir * 0.0035
        if (n > 1) {
          n = 1
          dir = -1
        }
        if (n < 0) {
          n = 0
          dir = 1
        }
        return n
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [auto])

  const download = () => {
    const c = canvas.current
    if (!c) return
    const a = document.createElement('a')
    a.download = 'chip-final.png'
    a.href = c.toDataURL('image/png')
    a.click()
  }

  const power = Math.min(1, Math.max(0, (progress - S.powerStart) / (S.powerFull - S.powerStart)))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--color-bg0)' }}>
      <ChipScene
        key={`${camera}-${mobile}`}
        progress={() => ref.current}
        params={{ seed, blocks, cellScale }}
        mobile={mobile}
        cameraRig={camera === 'rig'}
        orbit={camera === 'orbit'}
        preserveDrawingBuffer
        onCreatedCanvas={(el) => (canvas.current = el)}
      />
      <div className="mono" style={panel}>
        <strong style={{ color: 'var(--color-text)' }}>/dev/chip</strong>
        <label>
          progress {progress.toFixed(3)} · power {power.toFixed(2)}
          <input type="range" min={0} max={1} step={0.001} value={progress} onChange={(e) => setProgress(+e.target.value)} />
        </label>
        <label>
          seed {seed}
          <input type="range" min={0} max={20} step={1} value={seed} onChange={(e) => setSeed(+e.target.value)} />
        </label>
        <label>
          blocks {blocks}
          <input type="range" min={3} max={8} step={1} value={blocks} onChange={(e) => setBlocks(+e.target.value)} />
        </label>
        <label>
          cells/edge {cellScale}
          <input type="range" min={80} max={260} step={2} value={cellScale} onChange={(e) => setCellScale(+e.target.value)} />
        </label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button style={btn} onClick={() => setAuto((a) => !a)}>
            {auto ? 'stop' : 'auto-scrub'}
          </button>
          <button style={btn} onClick={() => setCamera((c) => (c === 'rig' ? 'orbit' : 'rig'))}>
            cam: {camera}
          </button>
          <button style={btn} onClick={() => setMobile((m) => !m)}>
            {mobile ? 'lite' : 'full'} shader
          </button>
          <button style={{ ...btn, borderColor: 'var(--color-amber)' }} onClick={download}>
            download PNG
          </button>
        </div>
        <span style={{ color: 'var(--color-text-mute)' }}>Save the PNG to public/fallback/chip-final.png</span>
      </div>
    </div>
  )
}

const panel: React.CSSProperties = {
  position: 'absolute',
  left: 16,
  bottom: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: 14,
  width: 300,
  background: 'rgba(10,4,7,0.8)',
  border: '1px solid var(--color-line-hi)',
  textTransform: 'none',
  letterSpacing: '0.04em',
  fontSize: 11,
  color: 'var(--color-text-dim)',
}
const btn: React.CSSProperties = {
  border: '1px solid var(--color-line-hi)',
  padding: '6px 10px',
  color: 'var(--color-text)',
  fontFamily: 'inherit',
  fontSize: 11,
}
