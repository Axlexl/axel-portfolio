import { useEffect, useRef, memo } from 'react'

export default memo(function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })

    let W = window.innerWidth
    let H = window.innerHeight
    let animId, t = 0, lastTime = 0
    const FPS = 30
    const FRAME_MS = 1000 / FPS

    // Minimal scene — just enough to look beautiful
    let dust = [], stars = [], shoots = [], sparkles = []
    let shootCooldown = 30, sparkleCooldown = 0

    function rand(a, b) { return a + Math.random() * (b - a) }

    function setup() {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W
      canvas.height = H
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'

      // 250 simple dust dots
      dust = Array.from({ length: 250 }, () => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(0.15, 0.65), a: rand(0.05, 0.38),
        vx: rand(-0.01, 0.01), vy: rand(-0.006, 0.006),
        tw: Math.random() < 0.3 ? rand(0.008, 0.04) : 0,
        ph: rand(0, Math.PI * 2), hue: rand(260, 330),
      }))

      // 60 twinkling stars
      stars = Array.from({ length: 60 }, () => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(0.8, 2.4), a: rand(0.3, 0.85),
        vx: rand(-0.008, 0.008), vy: rand(-0.005, 0.005),
        tw: rand(0.012, 0.055), ph: rand(0, Math.PI * 2),
        hue: rand(252, 335), sat: rand(45, 88),
        spike: Math.random() < 0.25,   // only 25% get spikes
        spikeLen: rand(8, 20),
        rot: rand(0, Math.PI / 4),
      }))
    }

    function wrap(o) {
      if (o.x < -10) o.x = W + 10
      if (o.x > W + 10) o.x = -10
      if (o.y < -10) o.y = H + 10
      if (o.y > H + 10) o.y = -10
    }

    function spawnShoot() {
      shoots.push({
        x: rand(W * 0.05, W * 0.9),
        y: rand(H * 0.02, H * 0.5),
        len: rand(80, 200),
        speed: rand(7, 14),
        angle: 0.22 + rand(-0.28, 0.28),
        life: 0, maxLife: Math.round(rand(35, 60)),
        hue: rand(265, 330), w: rand(1.1, 2.0),
      })
    }

    function spawnSparkle() {
      sparkles.push({
        x: rand(0, W), y: rand(0, H),
        hue: rand(265, 335), size: rand(1.4, 3.8),
        life: 0, maxLife: Math.round(rand(36, 70)),
        rot: rand(0, Math.PI / 4), rotV: rand(-0.04, 0.04),
      })
    }

    // ── Draw a simple 4-spike cross ──
    function drawCross(x, y, len, a, hue, rot) {
      const angles = [0, Math.PI / 2, Math.PI, Math.PI * 3 / 2]
      angles.forEach(angle => {
        const ex = x + Math.cos(angle + rot) * len
        const ey = y + Math.sin(angle + rot) * len
        const g = ctx.createLinearGradient(x, y, ex, ey)
        g.addColorStop(0,   `hsla(${hue},88%,95%,${a})`)
        g.addColorStop(0.5, `hsla(${hue},78%,78%,${a * 0.35})`)
        g.addColorStop(1,   'transparent')
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey)
        ctx.strokeStyle = g; ctx.lineWidth = 0.7; ctx.stroke()
      })
    }

    // ── Draw sparkle ──
    function drawSparkle(sp) {
      const p = sp.life / sp.maxLife
      const a = p < 0.25 ? p / 0.25 : Math.max(0, 1 - (p - 0.25) / 0.75)
      const sz = sp.size * (0.65 + 0.35 * Math.sin(p * Math.PI))

      // glow
      const grd = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sz * 6)
      grd.addColorStop(0, `hsla(${sp.hue},90%,88%,${a * 0.4})`); grd.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(sp.x, sp.y, sz * 6, 0, Math.PI * 2)
      ctx.fillStyle = grd; ctx.fill()

      // 4 main spikes + 4 small diagonal
      const spokes = [
        [sp.rot, sz * 8, 0.65], [sp.rot + Math.PI, sz * 8, 0.65],
        [sp.rot + Math.PI / 2, sz * 3.5, 0.45], [sp.rot - Math.PI / 2, sz * 3.5, 0.45],
        [sp.rot + Math.PI / 4, sz * 2.2, 0.28], [sp.rot + Math.PI * 3 / 4, sz * 2.2, 0.28],
        [sp.rot - Math.PI / 4, sz * 2.2, 0.28], [sp.rot - Math.PI * 3 / 4, sz * 2.2, 0.28],
      ]
      spokes.forEach(([angle, l, w]) => {
        const ex = sp.x + Math.cos(angle) * l
        const ey = sp.y + Math.sin(angle) * l
        const sg = ctx.createLinearGradient(sp.x, sp.y, ex, ey)
        sg.addColorStop(0, `hsla(${sp.hue},95%,97%,${a})`); sg.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.moveTo(sp.x, sp.y); ctx.lineTo(ex, ey)
        ctx.strokeStyle = sg; ctx.lineWidth = w; ctx.stroke()
      })

      // bright core
      const cg = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sz * 1.5)
      cg.addColorStop(0, `rgba(255,255,255,${a})`); cg.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(sp.x, sp.y, sz * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = cg; ctx.fill()
    }

    function draw(now) {
      animId = requestAnimationFrame(draw)
      if (now - lastTime < FRAME_MS) return
      lastTime = now
      t += 0.016

      ctx.clearRect(0, 0, W, H)

      // ── Soft galaxy core (cheap — no loop, just 2 radials) ──
      const cx = W * 0.5, cy = H * 0.38
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 380)
      g1.addColorStop(0, 'rgba(200,140,255,0.030)'); g1.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(cx, cy, 380, 0, Math.PI * 2); ctx.fillStyle = g1; ctx.fill()
      const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120)
      g2.addColorStop(0, 'rgba(220,160,255,0.075)'); g2.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(cx, cy, 120, 0, Math.PI * 2); ctx.fillStyle = g2; ctx.fill()

      // ── Dust (batched — single fill style per loop) ──
      ctx.fillStyle = '#d8c8ff'
      dust.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.ph += s.tw; wrap(s)
        const a = s.tw ? s.a * (0.3 + 0.7 * Math.abs(Math.sin(s.ph))) : s.a
        ctx.globalAlpha = a
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill()
      })
      ctx.globalAlpha = 1

      // ── Stars ──
      stars.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.ph += s.tw; wrap(s)
        const a = s.a * (0.4 + 0.6 * Math.abs(Math.sin(s.ph)))

        if (s.spike) {
          const slen = s.spikeLen * (0.8 + 0.2 * Math.abs(Math.sin(s.ph)))
          drawCross(s.x, s.y, slen, a * 0.65, s.hue, s.rot)
        }

        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3)
        grd.addColorStop(0, '#ffffff')
        grd.addColorStop(0.35, `hsl(${s.hue},${s.sat}%,85%)`)
        grd.addColorStop(1, 'transparent')
        ctx.globalAlpha = a
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = grd; ctx.fill()
        ctx.globalAlpha = 1
      })

      // ── Sparkles ──
      sparkleCooldown--
      if (sparkleCooldown <= 0) {
        const n = 1 + Math.floor(Math.random() * 3)
        for (let i = 0; i < n; i++) spawnSparkle()
        sparkleCooldown = 16 + Math.floor(Math.random() * 24)
      }
      for (let i = sparkles.length - 1; i >= 0; i--) {
        sparkles[i].life++; sparkles[i].rot += sparkles[i].rotV
        drawSparkle(sparkles[i])
        if (sparkles[i].life >= sparkles[i].maxLife) sparkles.splice(i, 1)
      }

      // ── Shooting stars — keep 6 active ──
      while (shoots.length < 6) spawnShoot()
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i]
        sh.x += Math.cos(sh.angle) * sh.speed
        sh.y += Math.sin(sh.angle) * sh.speed
        sh.life++
        const p = sh.life / sh.maxLife
        const a = p < 0.18 ? p / 0.18 : Math.max(0, 1 - (p - 0.18) / 0.82)
        const tx = sh.x - Math.cos(sh.angle) * sh.len
        const ty = sh.y - Math.sin(sh.angle) * sh.len
        const tg = ctx.createLinearGradient(tx, ty, sh.x, sh.y)
        tg.addColorStop(0, 'transparent')
        tg.addColorStop(0.5, `hsla(${sh.hue},70%,68%,${a * 0.3})`)
        tg.addColorStop(1, `hsla(${sh.hue},88%,95%,${a})`)
        ctx.strokeStyle = tg; ctx.lineWidth = sh.w
        ctx.shadowColor = `hsl(${sh.hue},80%,75%)`; ctx.shadowBlur = 5
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(sh.x, sh.y); ctx.stroke()
        ctx.shadowBlur = 0
        if (sh.life >= sh.maxLife) shoots.splice(i, 1)
      }
    }

    setup()
    window.addEventListener('resize', setup)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', setup)
    }
  }, [])

  return (
    <>
      {/* Deep violet CSS base — renders immediately, zero JS cost */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 110% 55% at 50% 38%, rgba(92,18,158,0.52) 0%, transparent 68%),
          radial-gradient(ellipse 68%  44% at 10% 70%, rgba(56,8,116,0.36)  0%, transparent 60%),
          radial-gradient(ellipse 78%  48% at 90% 16%, rgba(110,26,170,0.30) 0%, transparent 65%),
          linear-gradient(168deg, #040119 0%, #07021d 28%, #050118 55%, #01000b 100%)
        `,
      }} />
      {/* Canvas — fixed viewport only, 30fps, DPR=1 */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          pointerEvents: 'none', zIndex: 0,
          willChange: 'contents',
          transform: 'translateZ(0)',   // force GPU layer
        }}
      />
    </>
  )
})
