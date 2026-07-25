import { useEffect, useRef, memo } from 'react'

export default memo(function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // ── Device pixel ratio for crisp HiDPI / 4K rendering ──
    const DPR = Math.min(window.devicePixelRatio || 1, 3)

    let W, H, animId, t = 0
    let dust = [], stars = [], bright = [], nebulas = [], shoots = []
    let shootCooldown = 0   // start immediately
    // ── Sparkles: diamond burst particles that pop in randomly ──
    let sparkles = []
    let sparkleCooldown = 0

    // Pre-fill 6 shooting stars at startup
    function initShoots() {
      for (let i = 0; i < 6; i++) {
        setTimeout(() => spawnShoot(), i * 280)
      }
    }

    function resize() {
      W = window.innerWidth
      H = Math.max(document.documentElement.scrollHeight, window.innerHeight)

      // Physical pixels = CSS pixels × DPR
      canvas.width  = W * DPR
      canvas.height = H * DPR
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'

      // Scale all drawing operations up
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)

      buildScene()
    }

    function buildScene() {
      // ── 1800 dust particles ──
      dust = Array.from({ length: 1800 }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 0.65 + 0.15,
        a:  Math.random() * 0.45 + 0.08,
        vx: (Math.random() - 0.5) * 0.018,
        vy: (Math.random() - 0.5) * 0.010,
        tw: Math.random() < 0.45 ? Math.random() * 0.045 + 0.008 : 0,
        ph: Math.random() * Math.PI * 2,
        hue: 255 + Math.random() * 75,
      }))

      // ── 280 mid stars ──
      stars = Array.from({ length: 280 }, () => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.8 + 0.8,
        a:  Math.random() * 0.65 + 0.25,
        vx: (Math.random() - 0.5) * 0.013,
        vy: (Math.random() - 0.5) * 0.007,
        tw: Math.random() * 0.055 + 0.012,
        ph: Math.random() * Math.PI * 2,
        hue: 248 + Math.random() * 95,
        sat: 45 + Math.random() * 50,
      }))

      // ── 32 bright cross stars ──
      bright = Array.from({ length: 32 }, () => ({
        x:   Math.random() * W,
        y:   Math.random() * H,
        r:   Math.random() * 2.8 + 2.0,
        a:   Math.random() * 0.45 + 0.5,
        vx:  (Math.random() - 0.5) * 0.009,
        vy:  (Math.random() - 0.5) * 0.005,
        tw:  Math.random() * 0.06 + 0.016,
        ph:  Math.random() * Math.PI * 2,
        hue: 258 + Math.random() * 75,
        spike: Math.random() * 26 + 16,
        rot:   Math.random() * Math.PI / 4,
        rotV:  (Math.random() - 0.5) * 0.0018,
      }))

      // ── 10 nebula blobs ──
      nebulas = Array.from({ length: 10 }, (_, i) => ({
        x:  Math.random() * W,
        y:  Math.random() * H,
        rx: 280 + Math.random() * 380,
        hue: [272,295,262,308,278,318,268,298,258,285][i],
        a:  0.055 + Math.random() * 0.085,
        vx: (Math.random() - 0.5) * 0.035,
        vy: (Math.random() - 0.5) * 0.022,
        rot:  Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.00025,
        ph:   Math.random() * Math.PI * 2,
        phV:  0.0025 + Math.random() * 0.004,
      }))
    }

    function wrap(o, pad = 400) {
      if (o.x < -pad) o.x = W + pad
      if (o.x > W + pad) o.x = -pad
      if (o.y < -pad) o.y = H + pad
      if (o.y > H + pad) o.y = -pad
    }

    // ── High-quality nebula (6-stop gradient, elliptical) ──
    function drawNebula(n) {
      ctx.save()
      const p = 1 + 0.055 * Math.sin(n.ph)
      ctx.translate(n.x, n.y)
      ctx.rotate(n.rot)
      ctx.scale(p, p * 0.48)

      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx)
      const a = n.a * (0.78 + 0.22 * Math.sin(n.ph))
      g.addColorStop(0,    `hsla(${n.hue},    92%, 72%, ${a})`)
      g.addColorStop(0.15, `hsla(${n.hue+8},  88%, 65%, ${a*0.82})`)
      g.addColorStop(0.35, `hsla(${n.hue+15}, 80%, 55%, ${a*0.58})`)
      g.addColorStop(0.55, `hsla(${n.hue-5},  72%, 42%, ${a*0.32})`)
      g.addColorStop(0.78, `hsla(${n.hue-12}, 62%, 30%, ${a*0.12})`)
      g.addColorStop(1,    'transparent')

      ctx.beginPath()
      ctx.arc(0, 0, n.rx, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
      ctx.restore()
    }

    // ── 8-spoke cross with smooth gradient spikes ──
    function drawSpike(x, y, len, a, hue, rot) {
      const spokes = [
        { angle: 0,         l: len,        w: 0.9 },
        { angle: Math.PI/2, l: len,        w: 0.9 },
        { angle: Math.PI,   l: len,        w: 0.9 },
        { angle: Math.PI*3/2, l: len,      w: 0.9 },
        { angle: Math.PI/4, l: len * 0.48, w: 0.5 },
        { angle: Math.PI*3/4, l: len*0.48, w: 0.5 },
        { angle: Math.PI*5/4, l: len*0.48, w: 0.5 },
        { angle: Math.PI*7/4, l: len*0.48, w: 0.5 },
      ]
      spokes.forEach(({ angle, l, w }) => {
        const ex = x + Math.cos(angle + rot) * l
        const ey = y + Math.sin(angle + rot) * l
        const g = ctx.createLinearGradient(x, y, ex, ey)
        g.addColorStop(0,    `hsla(${hue},90%,96%,${a})`)
        g.addColorStop(0.12, `hsla(${hue},85%,88%,${a*0.85})`)
        g.addColorStop(0.45, `hsla(${hue},78%,75%,${a*0.45})`)
        g.addColorStop(1,    'transparent')
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(ex, ey)
        ctx.strokeStyle = g
        ctx.lineWidth = w
        ctx.stroke()
      })
    }

    // ── Shooting star spawn ──
    function spawnShoot() {
      const fromTop = Math.random() < 0.6
      shoots.push({
        x:     fromTop ? Math.random() * W : (Math.random() < 0.5 ? -10 : W + 10),
        y:     fromTop ? Math.random() * H * 0.3 : Math.random() * H * 0.6,
        len:   120 + Math.random() * 200,
        speed: 10 + Math.random() * 9,
        angle: (fromTop ? 0.18 : (Math.random() < 0.5 ? 0.1 : Math.PI - 0.1)) + (Math.random() - 0.5) * 0.35,
        life: 0,
        maxLife: 42 + Math.random() * 28,
        hue: 265 + Math.random() * 65,
        w: 1.4 + Math.random() * 1.4,
      })
    }

    // ── Spawn a sparkle burst ──
    function spawnSparkle() {
      const x    = Math.random() * W
      const y    = Math.random() * H
      const hue  = 265 + Math.random() * 70
      const size = Math.random() * 4.5 + 1.5   // bigger range
      sparkles.push({
        x, y, hue, size,
        life: 0,
        maxLife: 50 + Math.random() * 50,
        rot: Math.random() * Math.PI / 4,
        rotV: (Math.random() - 0.5) * 0.05,
      })
    }

    // ── Draw a single sparkle ──
    function drawSparkle(sp) {
      const p  = sp.life / sp.maxLife
      // ease: quick rise, slow fade
      const a  = p < 0.25 ? p / 0.25 : 1 - (p - 0.25) / 0.75
      const sz = sp.size * (0.7 + 0.3 * Math.sin(p * Math.PI))

      // outer soft glow
      const grd = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sz * 9)
      grd.addColorStop(0,    `hsla(${sp.hue},90%,90%,${a * 0.55})`)
      grd.addColorStop(0.3,  `hsla(${sp.hue},80%,75%,${a * 0.28})`)
      grd.addColorStop(0.65, `hsla(${sp.hue},70%,60%,${a * 0.10})`)
      grd.addColorStop(1,    'transparent')
      ctx.beginPath()
      ctx.arc(sp.x, sp.y, sz * 9, 0, Math.PI * 2)
      ctx.fillStyle = grd
      ctx.fill()

      // 4-spike diamond (long vertical + short horizontal, rotated)
      const spikes = [
        { angle: sp.rot,                    len: sz * 11, w: 0.9 },  // up
        { angle: sp.rot + Math.PI,          len: sz * 11, w: 0.9 },  // down
        { angle: sp.rot + Math.PI / 2,      len: sz * 5,  w: 0.6 },  // right
        { angle: sp.rot - Math.PI / 2,      len: sz * 5,  w: 0.6 },  // left
        { angle: sp.rot + Math.PI / 4,      len: sz * 3.5,w: 0.4 },  // diagonals
        { angle: sp.rot + Math.PI * 3 / 4,  len: sz * 3.5,w: 0.4 },
        { angle: sp.rot - Math.PI / 4,      len: sz * 3.5,w: 0.4 },
        { angle: sp.rot - Math.PI * 3 / 4,  len: sz * 3.5,w: 0.4 },
      ]

      spikes.forEach(({ angle, len, w }) => {
        const ex = sp.x + Math.cos(angle) * len
        const ey = sp.y + Math.sin(angle) * len
        const sg = ctx.createLinearGradient(sp.x, sp.y, ex, ey)
        sg.addColorStop(0,    `hsla(${sp.hue},95%,98%,${a})`)
        sg.addColorStop(0.2,  `hsla(${sp.hue},88%,88%,${a * 0.8})`)
        sg.addColorStop(0.55, `hsla(${sp.hue},78%,72%,${a * 0.4})`)
        sg.addColorStop(1,    'transparent')
        ctx.save()
        ctx.strokeStyle = sg
        ctx.lineWidth = w
        ctx.shadowColor = `hsl(${sp.hue},90%,82%)`
        ctx.shadowBlur = 6
        ctx.beginPath()
        ctx.moveTo(sp.x, sp.y)
        ctx.lineTo(ex, ey)
        ctx.stroke()
        ctx.restore()
      })

      // bright white core dot
      const cg = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sz * 2)
      cg.addColorStop(0,   `rgba(255,255,255,${a})`)
      cg.addColorStop(0.4, `hsla(${sp.hue},90%,92%,${a * 0.7})`)
      cg.addColorStop(1,   'transparent')
      ctx.beginPath()
      ctx.arc(sp.x, sp.y, sz * 2, 0, Math.PI * 2)
      ctx.fillStyle = cg
      ctx.fill()
    }

    // ── Galaxy core ──
    function drawCore() {
      const cx = W * 0.5
      const cy = H * 0.35 + Math.sin(t * 0.028) * 18
      const pulse = 1 + 0.055 * Math.sin(t * 0.45)

      ;[
        [580 * pulse, 0.032, 0.022],
        [240 * pulse, 0.085, 0.055],
        [ 90 * pulse, 0.18,  0.12 ],
        [ 28 * pulse, 0.40,  0.28 ],
      ].forEach(([r, a1, a2]) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0,   `rgba(235,185,255,${a1})`)
        g.addColorStop(0.35,`rgba(190,110,255,${a2})`)
        g.addColorStop(0.7, `rgba(140, 60,220,${a2*0.35})`)
        g.addColorStop(1,   'transparent')
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })
    }

    // ── Main render loop ──
    function draw() {
      ctx.clearRect(0, 0, W, H)
      t += 0.016

      // 1 — nebulas
      nebulas.forEach(n => {
        n.x += n.vx; n.y += n.vy
        n.rot += n.rotV; n.ph += n.phV
        wrap(n, 500)
        drawNebula(n)
      })

      // 2 — galaxy core
      drawCore()

      // 3 — dust
      dust.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.ph += s.tw
        wrap(s, 10)
        const a = s.tw ? s.a * (0.35 + 0.65 * Math.abs(Math.sin(s.ph))) : s.a
        ctx.save()
        ctx.globalAlpha = a
        ctx.fillStyle = `hsl(${s.hue},38%,90%)`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // 4 — mid stars
      stars.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.ph += s.tw
        wrap(s, 10)
        const a = s.a * (0.42 + 0.58 * Math.abs(Math.sin(s.ph)))
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
        g.addColorStop(0,   '#ffffff')
        g.addColorStop(0.25,`hsl(${s.hue},${s.sat}%,88%)`)
        g.addColorStop(0.6, `hsl(${s.hue},${s.sat}%,70%)`)
        g.addColorStop(1,   'transparent')
        ctx.save()
        ctx.globalAlpha = a
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
        ctx.restore()
      })

      // 5 — bright stars
      bright.forEach(s => {
        s.x += s.vx; s.y += s.vy
        s.ph += s.tw; s.rot += s.rotV
        wrap(s, 10)
        const a = s.a * (0.55 + 0.45 * Math.abs(Math.sin(s.ph)))
        const spike = s.spike * (0.82 + 0.18 * Math.abs(Math.sin(s.ph)))

        // wide outer bloom
        const bloom = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 13)
        bloom.addColorStop(0,   `hsla(${s.hue},85%,90%,${a*0.5})`)
        bloom.addColorStop(0.35,`hsla(${s.hue},75%,72%,${a*0.22})`)
        bloom.addColorStop(0.7, `hsla(${s.hue},65%,55%,${a*0.07})`)
        bloom.addColorStop(1,   'transparent')
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 13, 0, Math.PI * 2)
        ctx.fillStyle = bloom
        ctx.fill()

        drawSpike(s.x, s.y, spike, a * 0.75, s.hue, s.rot)

        // crisp core
        const core = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.5)
        core.addColorStop(0,   '#ffffff')
        core.addColorStop(0.35,`hsl(${s.hue},72%,92%)`)
        core.addColorStop(1,   'transparent')
        ctx.save()
        ctx.globalAlpha = a
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = core
        ctx.fill()
        ctx.restore()
      })

      // 6 — sparkles (diamond bursts) — high density
      sparkleCooldown--
      if (sparkleCooldown <= 0) {
        const count = 2 + Math.floor(Math.random() * 4) // 2–5 at once
        for (let s = 0; s < count; s++) spawnSparkle()
        sparkleCooldown = 8 + Math.floor(Math.random() * 14) // very frequent
      }
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const sp = sparkles[i]
        sp.life++
        sp.rot += sp.rotV
        drawSparkle(sp)
        if (sp.life >= sp.maxLife) sparkles.splice(i, 1)
      }

      // 7 — shooting stars — always keep 6 active
      // Refill whenever below 6
      while (shoots.length < 6) spawnShoot()

      for (let i = shoots.length - 1; i >= 0; i--) {
        const sh = shoots[i]
        sh.x += Math.cos(sh.angle) * sh.speed
        sh.y += Math.sin(sh.angle) * sh.speed
        sh.life++

        const p  = sh.life / sh.maxLife
        const a  = p < 0.18 ? p / 0.18 : Math.max(0, 1 - (p - 0.18) / 0.82)
        const tx = sh.x - Math.cos(sh.angle) * sh.len
        const ty = sh.y - Math.sin(sh.angle) * sh.len

        // tail
        const tg = ctx.createLinearGradient(tx, ty, sh.x, sh.y)
        tg.addColorStop(0,    'transparent')
        tg.addColorStop(0.3,  `hsla(${sh.hue},65%,65%,${a*0.25})`)
        tg.addColorStop(0.65, `hsla(${sh.hue},78%,80%,${a*0.6})`)
        tg.addColorStop(1,    `hsla(${sh.hue},90%,96%,${a})`)

        ctx.save()
        ctx.strokeStyle = tg
        ctx.lineWidth = sh.w
        ctx.shadowColor = `hsl(${sh.hue},85%,78%)`
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.moveTo(tx, ty)
        ctx.lineTo(sh.x, sh.y)
        ctx.stroke()

        // bright head
        const hg = ctx.createRadialGradient(sh.x, sh.y, 0, sh.x, sh.y, 5)
        hg.addColorStop(0,   `rgba(255,255,255,${a})`)
        hg.addColorStop(0.4, `hsla(${sh.hue},90%,88%,${a*0.7})`)
        hg.addColorStop(1,   'transparent')
        ctx.beginPath()
        ctx.arc(sh.x, sh.y, 5, 0, Math.PI * 2)
        ctx.fillStyle = hg
        ctx.fill()
        ctx.restore()

        if (sh.life >= sh.maxLife) shoots.splice(i, 1)
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()
    initShoots()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      {/* Deep violet void — CSS base renders instantly, no FOUC */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 120% 60% at 50% 38%, rgba(100,25,170,0.60) 0%, transparent 68%),
          radial-gradient(ellipse 75%  48% at 12% 68%, rgba(65,10,130,0.40)  0%, transparent 62%),
          radial-gradient(ellipse 85%  52% at 88% 18%, rgba(120,35,185,0.35) 0%, transparent 65%),
          radial-gradient(ellipse 55%  40% at 65% 80%, rgba(80,15,145,0.28)  0%, transparent 58%),
          linear-gradient(168deg, #04011a 0%, #080220 28%, #06011c 55%, #030010 100%)
        `,
      }} />
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 0,
        }}
      />
    </>
  )
})
