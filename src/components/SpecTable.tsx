import type { SpecRow } from '@/data/products'
import './SpecTable.css'

export default function SpecTable({ rows, title = 'Datasheet' }: { rows: SpecRow[]; title?: string }) {
  return (
    <div className="spec">
      <div className="spec__head">
        <span className="spec__title">{title}</span>
        <span className="mono">preliminary · values TBD</span>
      </div>
      <table className="spec__table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Value</th>
            <th className="spec__note-col">Note</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className={r.value === 'TBD' ? 'is-tbd' : ''}>
              <td>{r.label}</td>
              <td className="spec__value">{r.value}</td>
              <td className="spec__note-col">{r.note ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
