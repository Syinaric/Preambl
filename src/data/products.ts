import type { DieParams } from '@/scene/DieMaterial'

export interface SpecRow {
  label: string
  value: string
  /** Short mono annotation shown under the value. */
  note?: string
}

export interface Product {
  slug: string
  /** Display name. */
  name: string
  family: string
  status: 'in-development' | 'sampling' | 'production'
  tagline: string
  description: string[]
  useCases: string[]
  specs: SpecRow[]
  /** Parameters for the procedural die so each product looks distinct. */
  die: DieParams
}

/* Naming: the first chip is "Preambl-0", generation zero. Later generations
 * can follow as Preambl-1, Preambl-2, and so on. */
const TBD = 'TBD' // TODO(real-data)

export const products: Product[] = [
  {
    slug: 'preambl-0',
    name: 'Preambl-0',
    family: 'Vision',
    status: 'in-development',
    tagline: 'A convolutional network, cast in silicon.',
    description: [
      'Our first chip runs a convolutional neural network for image and vision inference with every weight living in the silicon. There is no external weight memory, no fetch, and no bus to wait on.',
      'It does one job: look at an image and answer, in a tight power envelope, at a latency that does not depend on memory traffic. The behaviour is identical on every unit, which makes it straightforward to certify and deploy.',
    ],
    useCases: [
      'Always-on visual wake and presence detection',
      'Industrial inspection and defect classification',
      'Privacy-first cameras that never upload frames',
      'Battery-powered sensors that need vision',
      'Companion inference next to a host processor',
    ],
    specs: [
      { label: 'Model type', value: 'CNN', note: 'convolutional neural network' },
      { label: 'Task', value: 'Image classification', note: 'vision inference' },
      { label: 'Weights', value: 'In the silicon', note: 'no external weight memory' },
      { label: 'Input resolution', value: TBD }, // TODO(real-data)
      { label: 'Throughput', value: TBD, note: 'frames / s' }, // TODO(real-data)
      { label: 'Latency', value: TBD, note: 'per inference' }, // TODO(real-data)
      { label: 'Power', value: TBD, note: 'typical, active' }, // TODO(real-data)
      { label: 'Process node', value: TBD }, // TODO(real-data)
      { label: 'Package', value: TBD }, // TODO(real-data)
      { label: 'Interface', value: TBD, note: 'host + sensor' }, // TODO(real-data)
      { label: 'Operating temp.', value: TBD }, // TODO(real-data)
    ],
    die: { seed: 7, blocks: 4, cellScale: 150, centerScale: 30, hum: 0.8 },
  },
  // Future products: add an entry here and the page renders a grid automatically.
]
