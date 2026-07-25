import { useEffect, useRef, memo } from 'react'

export default memo(function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })

    // Keep DPR at 1 for max performance — still looks great
    const DPR = Math.min(window.devicePixelRatio || 1, 1)

    let W = window.innerWidth
    let H = window.innerHeight   // ← VIEWPORT only, not full page height
    let animId, t = 0
    let lastTime = 0
    const FRAME_MS = 1000 / 40   // 40fps target — smooth but not heavy

    // Scene
    let dust = [], stars = [], bright = [], nebulas = [], shoots = [], sparkles = []
    let shootCooldown = 40, sparkleCooldown = 0

    function resize() {
      W = window.innerWidth
      H = window.innerHeight     // always viewport height only
      canvas.width  = Math.round(W * DPR)
      canvas.height = Math.round(H * DPR)
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      if (DPR !== 1) ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      buildScene()
    }

    function rand(min, max) { return min + Math.random() * (max - min) }

    function buildScene() {
      dust = Array.from({ length: 350 }, () => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(0.15, 0.7), a: rand(0.06, 0.42),
        vx: rand(-0.012, 0.012), vy: rand(-0.007, 0.007),
        tw: Math.random() < 0.3 ? rand(0.008, 0.04) : 0,
        ph: rand(0, Math.PI * 2), hue: rand(255, 330),
      }))

      stars = Array.from({ length: 80 }, () => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(0.7, 2.2), a: rand(0.25, 0.8),
        vx: rand(-0.009, 0.009), vy: rand(-0.005, 0.005),
        tw: rand(0.01, 0.055), ph: rand(0, Math.PI * 2),
        hue: rand(248, 340), sat: rand(40, 90),
      }))

      bright = Array.from({ length: 8 }, () => ({
        x: rand(0, W), y: rand(0, H),
        r: rand(1.8, 3.8), a: rand(0.5, 0.9),
        vx: rand(-0.006, 0.006), vy: rand(-0.004, 0.004),
        tw: rand(0.012, 0.055), ph: rand(0, Math.PI * 2),
        hue: rand(260, 330), spike: rand(12, 28),
        rot: rand(0, Math.PI / 4), rotV: rand(-0.0012, 0.0012),
      }))

      nebulas = Array.from({ length: 4 }, (_, i) => ({
        x: rand(0, W), y: rand(0, H),
        rx: rand(180, 320), hue: [272, 290, 262, 310][i],
        a: rand(0.045, 0.10),
        vx: rand(-0.02, 0.02), vy: rand(-0.012, 0.012),
        rot: rand(0, Math.PI * 2), rotV: rand(-0.00018, 0.00018),
        ph: rand(0, Math.PI * 2), phV: rand(0.002, 0.005),
      }))
    }

    function wrap(o, pad = 50) {
      if (o.x < -pad) o.x = W + pad
      if (o.x > W + pad) o.x = -pad
      if (o.y < -pad) o.y = H + pad
      if (o.y > H + pad) o.y = -pad
    }

    // ── Nebula ──
    function drawNebula(n) {
      ctx.save()
      ctx.translate(n.x, n.y)
      ctx.rotate(n.rot)
      ctx.scale(1 + 0.04 * Math.sin(n.ph), 0.42)
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx)
      const a = n.a * (0.78 + 0.22 * Math.sin(n.ph))
      g.addColorStop(0,    `hsla(${n.hue},85%,65%,${a})`)
      g.addColorStop(0.38, `hsla(${n.hue+10},75%,50%,${a*0.5})`)
      g.addColorStop(0.72, `hsla(${n.hue-5},62%,36%,${a*0.18})`)
      g.addColorStop(1,    'transparent')
      ctx.beginPath(); ctx.arc(0, 0, n.rx, 0, Math.PI * 2)
      ctx.fillStyle = g; ctx.fill()
      ctx.restore()
    }

    // ── 4-spoke spike (lighter than 8-spoke) ──
    function drawSpike(x, y, len, a, hue, rot) {
      const spokes = [
        [0, len, 0.8], [Math.PI/2, len, 0.8], [Math.PI, len, 0.8], [Math.PI*3/2, len, 0.8],
        [Math.PI/4, len*0.4, 0.4], [Math.PI*3/4, len*0.4, 0.4],
        [Math.PI*5/4, len*0.4, 0.4], [Math.PI*7/4, len*0.4, 0.4],
      ]
      spokes.forEach(([angle, l, w]) => {
        const ex = x + Math.cos(angle + rot) * l
        const ey = y + Math.sin(angle + rot) * l
        const g = ctx.createLinearGradient(x, y, ex, ey)
        g.addColorStop(0,   `hsla(${hue},88%,95%,${a})`)
        g.addColorStop(0.45,`hsla(${hue},78%,78%,${a*0.4})`)
        g.addColorStop(1,   'transparent')
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey)
        ctx.strokeStyle = g; ctx.lineWidth = w; ctx.stroke()
      })
    }

    // ── Sparkle ──
    function spawnSparkle() {
      sparkles.push({
        x: rand(0, W), y: rand(0, H),
        hue: rand(265, 335), size: rand(1.5, 4),
        life: 0, maxLife: Math.floor(rand(40, 80)),
        rot: rand(0, Math.PI / 4), rotV: rand(-0.04, 0.04),
      })
    }

    function drawSparkle(sp) {
      const p = sp.life / sp.maxLife
      const a = p < 0.25 ? p / 0.25 : Math.max(0, 1 - (p - 0.25) / 0.75)
      const sz = sp.size * (0.7 + 0.3 * Math.sin(p * Math.PI))

      const grd = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sz * 7)
      grd.addColorStop(0, `hsla(${sp.hue},90%,88%,${a*0.45})`); grd.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(sp.x, sp.y, sz*7, 0, Math.PI*2); ctx.fillStyle = grd; ctx.fill()

      const spokes = [
        [sp.rot, sz*9, 0.7], [sp.rot+Math.PI, sz*9, 0.7],
        [sp.rot+Math.PI/2, sz*4, 0.5], [sp.rot-Math.PI/2, sz*4, 0.5],
        [sp.rot+Math.PI/4, sz*2.5, 0.32], [sp.rot+Math.PI*3/4, sz*2.5, 0.32],
        [sp.rot-Math.PI/4, sz*2.5, 0.32], [sp.rot-Math.PI*3/4, sz*2.5, 0.32],
      ]
      spokes.forEach(([angle, l, w]) => {
        const ex = sp.x + Math.cos(angle)*l, ey = sp.y + Math.sin(angle)*l
        const sg = ctx.createLinearGradient(sp.x, sp.y, ex, ey)
        sg.addColorStop(0, `hsla(${sp.hue},95%,97%,${a})`); sg.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.moveTo(sp.x, sp.y); ctx.lineTo(ex, ey)
        ctx.strokeStyle = sg; ctx.lineWidth = w; ctx.stroke()
      })

      const cg = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sz*1.6)
      cg.addColorStop(0, `rgba(255,255,255,${a})`); cg.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(sp.x, sp.y, sz*1.6, 0, Math.PI*2); ctx.fillStyle = cg; ctx.fill()
    }

    // ── Shoot ──
    function spawnShoot() {
      shoots.push({
        x: rand(0, W*0.85), y: rand(0, H*0.55),
        len: rand(90, 220), speed: rand(8, 16),
        angle: 0.22 + rand(-0.3, 0.3),
        life: 0, maxLife: Math.floor(rand(38, 65)),
        hue: rand(265, 330), w: rand(1.2, 2.2),
      })
    }

    // ── Galaxy core (viewport center) ──
    function drawCore() {
      const cx = W * 0.5, cy = H * 0.38 + Math.sin(t * 0.028) * 14
      const pulse = 1 + 0.045 * Math.sin(t * 0.42)
      [[420*pulse,0.024,0.015],[170*pulse,0.065,0.042],[60*pulse,0.14,0.09]].forEach(([r,a1,a2]) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, `rgba(228,172,255,${a1})`)
        g.addColorStop(0.4, `rgba(180,95,255,${a2})`)
        g.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill()
      })
    }

    // ── Main loop ──
    function draw(now) {
      animId = requestAnimationFrame(draw)
      const delta = now - lastTime
      if (delta < FRAME_MS) return
      lastTime = now - (delta % FRAME_MS)
      t += 0.016

      ctx.clearRect(0, 0, W, H)

      nebulas.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.rot += n.rotV; n.ph += n.phV
        wrap(n, 400); drawNebula(n)
      })

      drawCore()

      // Batch dust (no gradient needed)
      dust.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.ph += s.tw; wrap(s, 8)
        const a = s.tw ? s.a * (0.35 + 0.65 * Math.abs(Math.sin(s.ph))) : s.a
        ctx.globalAlpha = a
        ctx.fillStyle = `hsl(${s.hue},35%,88%)`
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill()
      })
      ctx.globalAlpha = 1

      // Mid stars
      stars.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.ph += s.tw; wrap(s, 8)
        const a = s.a * (0.4 + 0.6 * Math.abs(Math.sin(s.ph)))
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*3)
        g.addColorStop(0,'#fff'); g.addColorStop(0.3,`hsl(${s.hue},${s.sat}%,85%)`); g.addColorStop(1,'transparent')
        ctx.globalAlpha = a
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r*3, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill()
      })
      ctx.globalAlpha = 1

      // Bright stars
      bright.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.ph += s.tw; s.rot += s.rotV; wrap(s, 8)
        const a = s.a * (0.55 + 0.45 * Math.abs(Math.sin(s.ph)))
        const spike = s.spike * (0.82 + 0.18 * Math.abs(Math.sin(s.ph)))
        const bloom = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*10)
        bloom.addColorStop(0,`hsla(${s.hue},80%,88%,${a*0.42})`)
        bloom.addColorStop(0.5,`hsla(${s.hue},70%,65%,${a*0.14})`); bloom.addColorStop(1,'transparent')
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r*10, 0, Math.PI*2); ctx.fillStyle = bloom; ctx.fill()
        drawSpike(s.x, s.y, spike, a*0.68, s.hue, s.rot)
        const core = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*2)
        core.addColorStop(0,'#fff'); core.addColorStop(0.4,`hsl(${s.hue},70%,90%)`); core.addColorStop(1,'transparent')
        ctx.globalAlpha = a
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r*2, 0, Math.PI*2); ctx.fillStyle = core; ctx.fill()
        ctx.globalAlpha = 1
      })

      // Sparkles
      sparkleCooldown--
      if (sparkleCooldown <= 0) {
        const n = 1 + Math.floor(Math.random() * 3)
        for (let i = 0; i < n; i++) spawnSparkle()
        sparkleCooldown = 14 + Math.floor(Math.random() * 22)
      }
      for (let i = sparkles.length - 1; i >= 0; i--) {
        sparkles[i].life++; sparkles[i].rot += sparkles[i].rotV
        drawSparkle(sparkles[i])
        if (sparkles[i].life >= sparkles[i].maxLife) sparkles.splice(i, 1)
      }

      // Shooting stars — keep 6
      while (shoots.length < 6) spawnShoot()
      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i]
        sh.x += Math.cos(sh.angle) * sh.speed
        sh.y += Math.sin(sh.angle) * sh.speed
        sh.life++
        const p = sh.life / sh.maxLife
        const a = p < 0.18 ? p/0.18 : Math.max(0, 1-(p-0.18)/0.82)
        const tx = sh.x - Math.cos(sh.angle)*sh.len
        const ty = sh.y - Math.sin(sh.angle)*sh.len
        const tg = ctx.createLinearGradient(tx, ty, sh.x, sh.y)
        tg.addColorStop(0,'transparent')
        tg.addColorStop(0.45,`hsla(${sh.hue},65%,65%,${a*0.28})`)
        tg.addColorStop(1,`hsla(${sh.hue},88%,95%,${a})`)
        ctx.strokeStyle = tg; ctx.lineWidth = sh.w
        ctx.shadowColor = `hsl(${sh.hue},80%,75%)`; ctx.shadowBlur = 6
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(sh.x, sh.y); ctx.stroke()
        ctx.shadowBlur = 0
        if (sh.life >= sh.maxLife) shoots.splice(i, 1)
      }
    }

    resize()
    window.addEventListener('resize', resize)
    animId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      {/* CSS deep space base */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 110% 55% at 50% 38%, rgba(95,22,160,0.52) 0%, transparent 68%),
          radial-gradient(ellipse 70%  44% at 12% 68%, rgba(58,10,118,0.36) 0%, transparent 60%),
          radial-gradient(ellipse 80%  50% at 88% 18%, rgba(112,28,172,0.30) 0%, transparent 65%),
          linear-gradient(168deg, #04011a 0%, #08021f 28%, #05011a 55%, #02000c 100%)
        `,
      }} />
      {/* Canvas — fixed, viewport-sized only */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100vh',
          pointerEvents: 'none', zIndex: 0,
          willChange: 'transform',
        }}
      />
    </>
  )
})
