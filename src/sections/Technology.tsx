import BottleneckDiagram from '@/graphics/BottleneckDiagram'
import EmbeddedDiagram from '@/graphics/EmbeddedDiagram'
import MetricGauges from '@/graphics/MetricGauges'
import GenerationsTimeline from '@/graphics/GenerationsTimeline'
import DeviceSilhouettes from '@/graphics/DeviceSilhouettes'
import Section from './Section'
import Divider from './Divider'
import ClosingCTA from './ClosingCTA'

/**
 * The long-form explainer under the hero. Copy aimed at a smart
 * non-specialist. Nothing here describes how weights are embedded.
 * TODO(confidential-review): final read of all copy before launch.
 */
export default function Technology() {
  return (
    <div id="technology" className="technology">
      <Divider variant={0} />

      <Section
        index="01 / 05"
        eyebrow="The bottleneck"
        title={
          <>
            Inference is mostly <em>waiting</em>.
          </>
        }
        graphic={(play) => <BottleneckDiagram play={play} />}
      >
        <p className="lead reveal">
          A neural network is a set of numbers called weights. To use the model, a chip has to pull those weights out of memory and bring them to the circuits that do the math. Every time. For every input.
        </p>
        <p className="body reveal">
          On today's hardware that movement, not the arithmetic, is where most of the time and most of the energy goes. The compute sits ready while weights trickle across a long, hungry bus. The faster the math gets, the more obvious the wait becomes.
        </p>
      </Section>

      <Divider variant={1} />

      <Section
        index="02 / 05"
        eyebrow="The idea"
        title={<>What if the model was the chip?</>}
        graphic={(play) => <EmbeddedDiagram play={play} />}
        reverse
      >
        <p className="lead reveal">
          Preambl puts the weights in the silicon itself. The model is not loaded onto the chip. The model <em>is</em> the chip.
        </p>
        <p className="body reveal">
          With nothing to fetch, there is no memory bus to wait on and no energy spent moving numbers around. Data comes in, flows through a fabric that already knows its weights, and a result comes out. The architecture is simpler because the hardest part of inference, feeding the compute, no longer exists.
        </p>
        {/* TODO(confidential-review): the paragraph above is intentionally conceptual. */}
      </Section>

      <Divider variant={2} />

      <Section
        index="03 / 05"
        eyebrow="Why it matters"
        title={<>Faster, cooler, cheaper, and private.</>}
        graphic={(play) => <MetricGauges play={play} />}
      >
        <p className="lead reveal">
          Remove the weight traffic and four things change at once.
        </p>
        <ul className="body reveal list">
          <li>
            <b>Speed.</b> Latency stops depending on memory bandwidth. The answer arrives as fast as the signal can cross the die.
          </li>
          <li>
            <b>Energy.</b> Moving a number costs far more than multiplying it. A chip that never moves its weights runs cool, which means it can run always.
          </li>
          <li>
            <b>Cost.</b> No external weight memory, fewer parts, a smaller board, a simpler system.
          </li>
          <li>
            <b>Privacy.</b> The whole model lives on the device. Inputs never need to leave it.
          </li>
        </ul>
        <span className="mono reveal">Measured figures to be published · TODO(real-data)</span>
      </Section>

      <Divider variant={0} />

      <Section
        index="04 / 05"
        eyebrow="Frozen by design"
        title={<>A fixed model is a feature.</>}
        graphic={(play) => <GenerationsTimeline play={play} />}
        reverse
      >
        <p className="lead reveal">
          Most devices do not need a model that changes every week. They need one task done extremely well, identically, on every unit, for years.
        </p>
        <p className="body reveal">
          A frozen model is predictable. It can be tested exhaustively, certified once, and trusted to behave the same on the millionth device as on the first. It cannot be tampered with after the fact, and it has no update path to secure.
        </p>
        <p className="body reveal">
          Improvement comes the way it does with any silicon: each new chip generation ships with better weights. Same promise, more capable chip.
        </p>
      </Section>

      <Divider variant={1} />

      <Section
        index="05 / 05"
        eyebrow="Where it goes"
        title={<>Intelligence that lives in the device.</>}
        graphic={(play) => <DeviceSilhouettes play={play} />}
      >
        <p className="lead reveal">
          Laptops and phones that run a capable on-device model without draining the battery. Cameras that understand what they see and never upload a frame. Sensors that think on milliwatts.
        </p>
        <p className="body reveal">
          Anywhere a device needs a fixed capability, always on, with no round trip to a server, is where the model belongs in the silicon.
        </p>
      </Section>

      <Divider variant={2} />
      <ClosingCTA />
    </div>
  )
}
