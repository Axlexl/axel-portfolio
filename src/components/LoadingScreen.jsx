import { useState, useEffect, useRef, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCode, FiLayers, FiZap } from 'react-icons/fi'

const DURATION = 3400

/* ── Unique canvas: rotating aurora rings + scattered glow orbs ── */
function AuroraCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W = window.innerWidth, H = window.innerHeight
    let t = 0, raf

    canvas.width  = W
    canvas.height = H

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', onResize)

    // floating orbs
    const orbs = Array.from({ length: 7 }, (_, i) => ({
      x: W * (0.1 + Math.random() * 0.8),
      y: H * (0.1 + Math.random() * 0.8),
      r: 80 + Math.random() * 140,
      speed: 0.0003 + Math.random() * 0.0004,
      angle: Math.random() * Math.PI * 2,
      orbitR: 60 + Math.random() * 80,
      ox: W * (0.1 + Math.random() * 0.8),
      oy: H * (0.1 + Math.random() * 0.8),
      hue: [280, 300, 260, 320, 270, 290, 310][i],
    }))

    function draw() {
      ctx.clearRect(0, 0, W, H)
      t += 0.012

      // aurora orbs
      orbs.forEach(o => {
        o.angle += o.speed
        const x = o.ox + Math.cos(o.angle) * o.orbitR
        const y = o.oy + Math.sin(o.angle * 0.7) * o.orbitR * 0.6
        const pulse = 0.85 + 0.15 * Math.sin(t * 1.2 + o.angle)

        const grd = ctx.createRadialGradient(x, y, 0, x, y, o.r * pulse)
        grd.addColorStop(0,   `hsla(${o.hue},90%,65%,0.18)`)
        grd.addColorStop(0.4, `hsla(${o.hue},80%,55%,0.10)`)
        grd.addColorStop(1,   `hsla(${o.hue},70%,40%,0)`)
        ctx.beginPath()
        ctx.arc(x, y, o.r * pulse, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      })

      // subtle scanline shimmer across center
      const shimmer = ctx.createLinearGradient(0, H * 0.3, 0, H * 0.7)
      shimmer.addColorStop(0,   'transparent')
      shimmer.addColorStop(0.5, `rgba(180,100,255,${0.025 + 0.015 * Math.sin(t * 2)})`)
      shimmer.addColorStop(1,   'transparent')
      ctx.fillStyle = shimmer
      ctx.fillRect(0, 0, W, H)

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <canvas ref={ref} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none',
    }} />
  )
}

/* ── Floating particles ── */
function Particles() {
  return (
    <>
      {Array.from({ length: 22 }).map((_, i) => {
        const size  = Math.random() * 2.5 + 0.8
        const hue   = 260 + Math.random() * 60   // violet–magenta range
        const delay = Math.random() * 3
        const dur   = 3 + Math.random() * 3
        return (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: size, height: size,
              borderRadius: '50%',
              background: `hsl(${hue},85%,70%)`,
              boxShadow: `0 0 ${size * 3}px hsl(${hue},85%,65%)`,
              left: `${Math.random() * 100}%`,
              top:  `${Math.random() * 100}%`,
            }}
            animate={{
              y:       [0, -(20 + Math.random() * 30), 0],
              opacity: [0.2, 0.9, 0.2],
              scale:   [1, 1.6, 1],
            }}
            transition={{ duration: dur, repeat: Infinity, delay, ease: 'easeInOut' }}
          />
        )
      })}
    </>
  )
}

/* ── Spinning ring ── */
function SpinRing({ r, strokeColor, duration, ccw = false }) {
  const circ = 2 * Math.PI * r
  return (
    <motion.circle
      cx="50" cy="50" r={r}
      fill="none"
      stroke={strokeColor}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeDasharray={`${circ * 0.35} ${circ * 0.65}`}
      animate={{ rotate: ccw ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
      style={{ transformOrigin: '50px 50px' }}
    />
  )
}

export default memo(function LoadingScreen({ onComplete }) {
  const [progress,  setProgress]  = useState(0)
  const [typed,     setTyped]     = useState('')
  const [exiting,   setExiting]   = useState(false)
  const fullText = 'axelsocobos.dev'

  /* progress */
  useEffect(() => {
    const start = performance.now()
    let raf
    const tick = now => {
      const pct = Math.min(((now - start) / DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setExiting(true)
          setTimeout(onComplete, 1000)
        }, 350)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  /* typing */
  useEffect(() => {
    if (typed.length >= fullText.length) return
    const t = setTimeout(() => setTyped(fullText.slice(0, typed.length + 1)), 65)
    return () => clearTimeout(t)
  }, [typed])

  /* ── Exit: split-screen wipe instead of simple fade ── */
  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="loader"
          exit={{}}   /* children handle exit */
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#07030f',
            overflow: 'hidden',
          }}
        >
          {/* Two panels that slide apart on exit */}
          {['top', 'bottom'].map(half => (
            <motion.div
              key={half}
              exit={{ y: half === 'top' ? '-100%' : '100%' }}
              transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
              style={{
                position: 'absolute',
                left: 0, right: 0,
                height: '50%',
                top: half === 'top' ? 0 : '50%',
                background: '#07030f',
                zIndex: 1,
              }}
            />
          ))}

          {/* ── Aurora canvas ── */}
          <AuroraCanvas />

          {/* ── Particles ── */}
          <Particles />

          {/* ── Content ── */}
          <div style={{
            position: 'relative', zIndex: 2,
            height: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            textAlign: 'center', padding: '0 24px',
          }}>

            {/* Spinning orbit rings */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ position: 'relative', width: 110, height: 110, marginBottom: 36 }}
            >
              {/* Glow blob behind rings */}
              <div style={{
                position: 'absolute', inset: -20, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(160,80,255,0.35) 0%, transparent 70%)',
                filter: 'blur(12px)',
              }} />
              <svg viewBox="0 0 100 100" width="110" height="110" style={{ overflow: 'visible' }}>
                <SpinRing r={44} strokeColor="rgba(180,80,255,0.7)"  duration={5}   />
                <SpinRing r={36} strokeColor="rgba(220,100,255,0.5)" duration={3.5} ccw />
                <SpinRing r={27} strokeColor="rgba(255,130,255,0.4)" duration={7}   />
                {/* Center icons */}
                <foreignObject x="33" y="33" width="34" height="34">
                  <div style={{
                    width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(160,80,255,0.15)', borderRadius: '50%',
                    border: '1px solid rgba(200,100,255,0.35)',
                  }}>
                    <FiCode size={15} style={{ color: '#d580ff' }} />
                  </div>
                </foreignObject>
              </svg>

              {/* 3 mini icon orbiting dots */}
              {[FiCode, FiLayers, FiZap].map((Icon, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6 + i * 1.5, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', inset: 0,
                    transformOrigin: '55px 55px',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: -6, left: '50%', transform: 'translateX(-50%)',
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(160,60,255,0.2)',
                    border: '1px solid rgba(200,100,255,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(180,80,255,0.5)',
                  }}>
                    <Icon size={11} style={{ color: '#d580ff' }} />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* WELCOME TO MY */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.22em' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{
                fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                color: 'rgba(200,140,255,0.7)', marginBottom: 10,
              }}
            >
              Welcome to my
            </motion.p>

            {/* PORTFOLIO WEBSITE — characters drop in one by one */}
            <div style={{ marginBottom: 28, overflow: 'hidden' }}>
              {'Portfolio Website'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: 'inline-block',
                    fontSize: 'clamp(28px, 6vw, 52px)',
                    fontWeight: 900,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: ch === ' ' ? 'transparent' : undefined,
                    background: i < 9
                      ? 'linear-gradient(135deg,#e0aaff,#c77dff,#9d4edd)'
                      : 'linear-gradient(135deg,#c77dff,#9d4edd,#7b2fff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: 'none',
                    filter: `drop-shadow(0 0 12px rgba(180,80,255,0.6))`,
                  }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
            </div>

            {/* Typing URL */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 20px', borderRadius: 99,
                background: 'rgba(160,60,255,0.08)',
                border: '1px solid rgba(180,80,255,0.25)',
                boxShadow: '0 0 20px rgba(160,60,255,0.15), inset 0 0 12px rgba(160,60,255,0.05)',
                marginBottom: 40,
              }}
            >
              <span style={{ color: '#c77dff', fontSize: 12 }}>@</span>
              <span style={{ fontSize: 13, color: 'rgba(220,170,255,0.85)', fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                {typed}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.75, repeat: Infinity }}
                  style={{ color: '#c77dff' }}
                >|</motion.span>
              </span>
            </motion.div>

            {/* Progress bar — morphing gradient */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              style={{ width: 240, margin: '0 auto' }}
            >
              <div style={{
                height: 3, borderRadius: 99,
                background: 'rgba(255,255,255,0.07)',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 6px rgba(160,60,255,0.1)',
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    borderRadius: 99,
                    background: 'linear-gradient(90deg,#7b2fff,#c77dff,#e0aaff)',
                    boxShadow: '0 0 16px rgba(180,80,255,0.8), 0 0 32px rgba(160,60,255,0.4)',
                    transition: 'width 0.05s linear',
                  }}
                />
              </div>

              {/* percentage */}
              <motion.p
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                style={{
                  fontSize: 10, marginTop: 10, fontFamily: 'monospace',
                  letterSpacing: '0.15em', textAlign: 'center',
                  color: 'rgba(180,100,255,0.55)',
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
})

