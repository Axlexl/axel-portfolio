import { useRef, useCallback } from 'react'

/**
 * Returns { glowRef, onMouseMove, onMouseLeave } to attach to any card.
 * Paints a radial glow that follows the cursor along the card's border.
 */
export function useGlowCard(darkMode) {
  const glowRef = useRef(null)

  const onMouseMove = useCallback(e => {
    const el = glowRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--gx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--gy', `${e.clientY - rect.top}px`)
    el.style.setProperty('--glow-opacity', '1')
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = glowRef.current
    if (el) el.style.setProperty('--glow-opacity', '0')
  }, [])

  return { glowRef, onMouseMove, onMouseLeave }
}
