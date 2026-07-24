import { useEffect, useRef, memo } from 'react'

/* ── Unique star field with:
   - 3 depth layers (micro / mid / bright)
   - Some stars pulse/twinkle with glow
   - A few "cross" shaped bright stars like real photography
   - Occasional shooting stars
   - Subtle constellation lines between a few clustered stars
   All done on canvas for zero DOM overhead.
── */

function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = window.innerWidth
    let H = document.documentElement.scrollHeight
    let animId
    let t = 0

    // ── Generate stars ──
    function makeStars() {
      const stars = []

      // Layer 1 — micro dust (lots, tiny, barely visible)
      for (let i = 0; i < 320; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 0.6 + 0.2,
          baseAlpha: Math.random() * 0.3 + 0.08,
          twinkleSpeed: 0,
          twinkleOffset: 0,
          type: 'dust',
          color: '#ffffff',
        })
      }

      // Layer 2 — mid stars (twinkle gently)
      for (let i = 0; i < 130; i++) {
        const hue = Math.random() < 0.3 ? `hsl(${200 + Math.random()*40},80%,85%)` : '#ffffff'
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.1 + 0.5,
          baseAlpha: Math.random() * 0.45 + 0.2,
          twinkleSpeed: Math.random() * 0.012 + 0.004,
          twinkleOffset: Math.random() * Math.PI * 2,
          type: 'mid',
          color: hue,
        })
      }

      // Layer 3 — bright cross stars (the "photography star" look)
      for (let i = 0; i < 18; i++) {
        const hue = Math.random() < 0.4
          ? `hsl(${210 + Math.random()*30},90%,88%)`
          : `hsl(${270 + Math.random()*20},80%,85%)`
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.8 + 1.4,
          baseAlpha: Math.random() * 0.5 + 0.45,
          twinkleSpeed: Math.random() * 0.018 + 0.008,
          twinkleOffset: Math.random() * Math.PI * 2,
          type: 'bright',
          color: hue,
          spikeLen: Math.random() * 10 + 8,
        })
      }

      return stars
    }

    // ── Generate constellation clusters ──
    function makeClusters(stars) {
      const bright = stars.filter(s => s.type === 'bright')
      const clusters = []
      // pick 3-4 random small groups
      for (let c = 0; c < 3; c++) {
        const seed = bright[Math.floor(Math.random() * bright.length)]
        if (!seed) continue
        const nearby = stars
          .filter(s => s !== seed && Math.hypot(s.x - seed.x, s.y - seed.y) < 160)
          .slice(0, 3)
        if (nearby.length >= 2) clusters.push([seed, ...nearby])
      }
      return clusters
    }

    // ── Shooting stars ──
    const shoots = []
    function spawnShoot() {
      shoots.push({
        x: Math.random() * W * 0.8,
        y: Math.random() * H * 0.4,
        len: Math.random() * 120 + 80,
        speed: Math.random() * 6 + 5,
        angle: Math.PI / 5 + Math.random() * 0.3,
        alpha: 1,
        life: 0,
        maxLife: 55 + Math.random() * 30,
      })
    }
    // spawn occasionally
    setInterval(spawnShoot, 3800 + Math.random() * 3000)

    let stars = makeStars()
    let clusters = makeClusters(stars)

    // ── Resize ──
    function resize() {
      W = window.innerWidth
      H = document.documentElement.scrollHeight
      canvas.width  = W
      canvas.height = H
      stars    = makeStars()
      clusters = makeClusters(stars)
    }

    canvas.width  = W
    canvas.height = H
    window.addEventListener('resize', resize)

    // ── Draw cross/spike for bright stars ──
    function drawCross(x, y, len, alpha, color) {
      ctx.save()
      ctx.globalAlpha = alpha * 0.55
      ctx.strokeStyle = color
      ctx.lineWidth = 0.6
      for (let a = 0; a < 4; a++) {
        const angle = (a * Math.PI) / 2
        const grad = ctx.createLinearGradient(
          x, y,
          x + Math.cos(angle) * len,
          y + Math.sin(angle) * len
        )
        grad.addColorStop(0, color)
        grad.addColorStop(1, 'transparent')
        ctx.strokeStyle = grad
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len)
        ctx.stroke()
      }
      ctx.restore()
    }

    // ── Main render loop ──
    function draw() {
      ctx.clearRect(0, 0, W, H)
      t += 0.016

      // constellation lines
      ctx.save()
      clusters.forEach(group => {
        for (let i = 0; i < group.length - 1; i++) {
          const a = group[i], b = group[i + 1]
          const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
          grad.addColorStop(0, 'rgba(100,120,255,0.06)')
          grad.addColorStop(1, 'rgba(100,120,255,0.02)')
          ctx.strokeStyle = grad
          ctx.lineWidth = 0.6
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      })
      ctx.restore()

      // draw stars
      stars.forEach(s => {
        let alpha = s.baseAlpha
        if (s.twinkleSpeed > 0) {
          alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset))
        }

        if (s.type === 'bright') {
          // outer glow
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 7)
          grd.addColorStop(0, s.color.replace('hsl', 'hsla').replace(')', `,${alpha * 0.4})`))
          grd.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 7, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()

          // cross spikes
          drawCross(s.x, s.y, s.spikeLen * (0.8 + 0.2 * Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset)), alpha, s.color)
        }

        // core dot
        ctx.save()
        ctx.globalAlpha = alpha
        if (s.type !== 'dust') {
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.5)
          grd.addColorStop(0, '#ffffff')
          grd.addColorStop(0.4, s.color)
          grd.addColorStop(1, 'transparent')
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = grd
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff'
          ctx.fill()
        }
        ctx.restore()
      })

      // shooting stars
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i]
        sh.life++
        sh.x += Math.cos(sh.angle) * sh.speed
        sh.y += Math.sin(sh.angle) * sh.speed
        const progress = sh.life / sh.maxLife
        sh.alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7

        const tailX = sh.x - Math.cos(sh.angle) * sh.len
        const tailY = sh.y - Math.sin(sh.angle) * sh.len
        const grad = ctx.createLinearGradient(tailX, tailY, sh.x, sh.y)
        grad.addColorStop(0, 'transparent')
        grad.addColorStop(0.6, `rgba(160,180,255,${sh.alpha * 0.4})`)
        grad.addColorStop(1, `rgba(220,230,255,${sh.alpha})`)

        ctx.save()
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.shadowColor = 'rgba(140,160,255,0.6)'
        ctx.shadowBlur = 4
        ctx.beginPath()
        ctx.moveTo(tailX, tailY)
        ctx.lineTo(sh.x, sh.y)
        ctx.stroke()
        ctx.restore()

        if (sh.life >= sh.maxLife) shoots.splice(i, 1)
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

export default memo(StarField)
