/** Tiny global event so any CTA can open the single contact modal. */
export const CONTACT_EVENT = 'preambl:contact'

export function openContact(topic?: string) {
  window.dispatchEvent(new CustomEvent(CONTACT_EVENT, { detail: { topic } }))
}
