import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * Fires once when element scrolls into view.
 * Uses a low threshold so it triggers early (before fully visible),
 * giving animations time to play smoothly without rushing.
 */
export function useScrollReveal(amount = 0.08) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount, margin: '0px 0px -40px 0px' })
  return [ref, inView]
}
