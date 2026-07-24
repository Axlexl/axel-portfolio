import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCode, FiLayers, FiZap } from 'react-icons/fi'

const DURATION = 3200 // total loading time in ms

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress]   = useState(0)
  const [typed,    setTyped]      = useState('')
  const [exiting,  setExiting]    = useState(false)

  const fullText = ' axelsocobos.dev'

  /* ── Progress bar ── */
  useEffect(() => {
    const start = performance.now()
    let raf

    const tick = now => {
      const elapsed = now - start
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)

      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        // start exit after 300ms hold at 100%
        setTimeout(() => {
          setExiting(true)
          setTimeout(onComplete, 900) // matches exit animation
        }, 300)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  /* ── Typing effect for the URL line ── */
  useEffect(() => {
    if (typed.length >= fullText.length) return
    const t = setTimeout(
      () => setTyped(fullText.slice(0, typed.length + 1)),
      60
    )
    return () => clearTimeout(t)
  }, [typed])

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            background: '#020818',
            overflow: 'hidden',
          }}
        >
          {/* ── Ambient background glows ── */}
          <div style={{
            position: 'absolute', top: '20%', left: '30%',
            width: 500, height: 500, borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '15%', right: '25%',
            width: 400, height: 400, borderRadius: '50%', pointerEvents: 'none',
            background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />

          {/* ── Floating particles ── */}
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                borderRadius: '50%',
                background: i % 2 === 0 ? '#0ea5e9' : '#6c63ff',
                left: `${Math.random() * 100}%`,
                top:  `${Math.random() * 100}%`,
                opacity: 0.5,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2.5 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* ── Content ── */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>

            {/* Three icons */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 40 }}
            >
              {[FiCode, FiLayers, FiZap].map((Icon, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                  style={{
                    width: 48, height: 48, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(14,165,233,0.08)',
                    border: '1px solid rgba(14,165,233,0.25)',
                    boxShadow: '0 0 16px rgba(14,165,233,0.15)',
                  }}
                >
                  <Icon size={20} style={{ color: '#0ea5e9' }} />
                </motion.div>
              ))}
            </motion.div>

            {/* WELCOME TO MY */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{
                fontSize: 'clamp(13px, 2.5vw, 16px)',
                fontWeight: 700,
                letterSpacing: '0.25em',
                color: '#94a3b8',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Welcome to my
            </motion.p>

            {/* PORTFOLIO WEBSITE */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              style={{
                fontSize: 'clamp(28px, 6vw, 52px)',
                fontWeight: 900,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                lineHeight: 1.15,
                marginBottom: 28,
              }}
            >
              <span style={{ color: '#f1f5f9' }}>Portfolio </span>
              <span style={{
                background: 'linear-gradient(135deg, #0ea5e9, #6c63ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Website
              </span>
            </motion.h1>

            {/* Typing URL */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '7px 18px', borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                marginBottom: 40,
              }}
            >
              <span style={{ color: '#0ea5e9', fontSize: 12 }}>@</span>
              <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                {typed}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ color: '#0ea5e9' }}
                >|</motion.span>
              </span>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              style={{ width: 220, margin: '0 auto' }}
            >
              {/* Track */}
              <div style={{
                height: 2, borderRadius: 99,
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden',
              }}>
                {/* Fill */}
                <motion.div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    borderRadius: 99,
                    background: 'linear-gradient(90deg, #6c63ff, #0ea5e9)',
                    boxShadow: '0 0 10px rgba(14,165,233,0.6)',
                    transition: 'width 0.05s linear',
                  }}
                />
              </div>

              {/* Percentage */}
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  fontSize: 11, color: '#475569', textAlign: 'center',
                  marginTop: 10, fontFamily: 'monospace', letterSpacing: '0.1em',
                }}
              >
                {Math.round(progress)}%
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}



