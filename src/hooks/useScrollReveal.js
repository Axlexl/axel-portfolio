import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * Returns [ref, isInView] — fires once when the element scrolls into view.
 * @param {number} amount  fraction of element visible before triggering (0–1)
 */
export function useScrollReveal(amount = 0.15) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount })
  return [ref, inView]
}
