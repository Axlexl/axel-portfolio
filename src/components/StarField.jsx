import { useEffect, useRef, memo } from 'react'

export default memo(function StarField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })

    // Cap DPR at 1.5 for performance — still looks sharp
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5)

    let W, H, animId, t = 0
    let dust = [], stars = [], bright = [], nebulas = [], shoots = []
    let shootCooldown = 60
    let sparkles = [], sparkleCooldown = 0
    let lastTime = 0
    const TARGET_FPS = 45
    const FRAME_MS   = 1000 / TARGET_FPS

    function resize() {
      W = window.innerWidth
      H = Math.max(document.documentElement.scrollHeight, window.innerHeight)
      canvas.width        = Math.round(W * DPR)
      canvas.height       = Math.round(H * DPR)
      canvas.style.width  = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      buildScene()
    }

    function buildScene() {
      // Reduced counts for smooth performance
      dust = Array.from({ length: 600 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 0.6 + 0.15,
        a: Math.random() * 0.4 + 0.07,
        vx: (Math.random() - 0.5) * 0.014,
        vy: (Math.random() - 0.5) * 0.008,
        tw: Math.random() < 0.35 ? Math.random() * 0.04 + 0.008 : 0,
        ph: Math.random() * Math.PI * 2,
        hue: 255 + Math.random() * 75,
      }))

      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.6 + 0.7,
        a: Math.random() * 0.6 + 0.2,
        vx: (Math.random() - 0.5) * 0.01,
        vy: (Math.random() - 0.5) * 0.006,
        tw: Math.random() * 0.05 + 0.01,
        ph: Math.random() * Math.PI * 2,
        hue: 248 + Math.random() * 95,
        sat: 45 + Math.random() * 50,
      }))

      bright = Array.from({ length: 14 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2.2 + 1.8,
        a: Math.random() * 0.45 + 0.5,
        vx: (Math.random() - 0.5) * 0.007,
        vy: (Math.random() - 0.5) * 0.004,
        tw: Math.random() * 0.055 + 0.012,
        ph: Math.random() * Math.PI * 2,
        hue: 260 + Math.random() * 70,
        spike: Math.random() * 20 + 12,
        rot: Math.random() * Math.PI / 4,
        rotV: (Math.random() - 0.5) * 0.0015,
      }))

      nebulas = Array.from({ length: 6 }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        rx: 220 + Math.random() * 300,
        hue: [272, 290, 262, 298, 278, 310][i],
        a: 0.05 + Math.random() * 0.07,
        vx: (Math.random() - 0.5) * 0.025,
        vy: (Math.random() - 0.5) * 0.015,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.0002,
        ph: Math.random() * Math.PI * 2,
        phV: 0.002 + Math.random() * 0.003,
      }))
    }

    function wrap(o, pad = 350) {
      if (o.x < -pad) o.x = W + pad
      if (o.x > W + pad) o.x = -pad
      if (o.y < -pad) o.y = H + pad
      if (o.y > H + pad) o.y = -pad
    }

    function drawNebula(n) {
      ctx.save()
      const p = 1 + 0.05 * Math.sin(n.ph)
      ctx.translate(n.x, n.y)
      ctx.rotate(n.rot)
      ctx.scale(p, p * 0.45)
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, n.rx)
      const a = n.a * (0.8 + 0.2 * Math.sin(n.ph))
      g.addColorStop(0,    `hsla(${n.hue},88%,68%,${a})`)
      g.addColorStop(0.35, `hsla(${n.hue+10},78%,52%,${a*0.55})`)
      g.addColorStop(0.7,  `hsla(${n.hue-5},65%,38%,${a*0.2})`)
      g.addColorStop(1,    'transparent')
      ctx.beginPath()
      ctx.arc(0, 0, n.rx, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
      ctx.restore()
    }

    function drawSpike(x, y, len, a, hue, rot) {
      const spokes = [
        [0, len, 0.8], [Math.PI/2, len, 0.8], [Math.PI, len, 0.8], [Math.PI*3/2, len, 0.8],
        [Math.PI/4, len*0.42, 0.45], [Math.PI*3/4, len*0.42, 0.45],
        [Math.PI*5/4, len*0.42, 0.45], [Math.PI*7/4, len*0.42, 0.45],
      ]
      spokes.forEach(([angle, l, w]) => {
        const ex = x + Math.cos(angle + rot) * l
        const ey = y + Math.sin(angle + rot) * l
        const g = ctx.createLinearGradient(x, y, ex, ey)
        g.addColorStop(0,    `hsla(${hue},90%,95%,${a})`)
        g.addColorStop(0.4,  `hsla(${hue},80%,80%,${a*0.45})`)
        g.addColorStop(1,    'transparent')
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ex, ey)
        ctx.strokeStyle = g; ctx.lineWidth = w; ctx.stroke()
      })
    }

    function spawnShoot() {
      shoots.push({
        x: Math.random() * W * 0.85,
        y: Math.random() * H * 0.5,
        len: 100 + Math.random() * 160,
        speed: 9 + Math.random() * 8,
        angle: 0.2 + (Math.random() - 0.5) * 0.35,
        life: 0, maxLife: 42 + Math.random() * 28,
        hue: 265 + Math.random() * 65, w: 1.3 + Math.random() * 1.2,
      })
    }

    function spawnSparkle() {
      sparkles.push({
        x: Math.random() * W, y: Math.random() * H,
        hue: 265 + Math.random() * 70,
        size: Math.random() * 4 + 1.5,
        life: 0, maxLife: 48 + Math.random() * 40,
        rot: Math.random() * Math.PI / 4,
        rotV: (Math.random() - 0.5) * 0.045,
      })
    }

    function drawSparkle(sp) {
      const p  = sp.life / sp.maxLife
      const a  = p < 0.25 ? p / 0.25 : Math.max(0, 1 - (p - 0.25) / 0.75)
      const sz = sp.size * (0.7 + 0.3 * Math.sin(p * Math.PI))

      const grd = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sz * 8)
      grd.addColorStop(0,   `hsla(${sp.hue},90%,88%,${a*0.5})`)
      grd.addColorStop(0.4, `hsla(${sp.hue},80%,72%,${a*0.22})`)
      grd.addColorStop(1,   'transparent')
      ctx.beginPath(); ctx.arc(sp.x, sp.y, sz * 8, 0, Math.PI * 2)
      ctx.fillStyle = grd; ctx.fill()

      const spokes2 = [
        [sp.rot, sz*10, 0.8], [sp.rot+Math.PI, sz*10, 0.8],
        [sp.rot+Math.PI/2, sz*4.5, 0.55], [sp.rot-Math.PI/2, sz*4.5, 0.55],
        [sp.rot+Math.PI/4, sz*3, 0.35], [sp.rot+Math.PI*3/4, sz*3, 0.35],
        [sp.rot-Math.PI/4, sz*3, 0.35], [sp.rot-Math.PI*3/4, sz*3, 0.35],
      ]
      spokes2.forEach(([angle, l, w]) => {
        const ex = sp.x + Math.cos(angle) * l
        const ey = sp.y + Math.sin(angle) * l
        const sg = ctx.createLinearGradient(sp.x, sp.y, ex, ey)
        sg.addColorStop(0,   `hsla(${sp.hue},95%,97%,${a})`)
        sg.addColorStop(0.45,`hsla(${sp.hue},82%,78%,${a*0.4})`)
        sg.addColorStop(1,   'transparent')
        ctx.beginPath(); ctx.moveTo(sp.x, sp.y); ctx.lineTo(ex, ey)
        ctx.strokeStyle = sg; ctx.lineWidth = w; ctx.stroke()
      })

      const cg = ctx.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, sz*1.8)
      cg.addColorStop(0, `rgba(255,255,255,${a})`); cg.addColorStop(1, 'transparent')
      ctx.beginPath(); ctx.arc(sp.x, sp.y, sz*1.8, 0, Math.PI*2)
      ctx.fillStyle = cg; ctx.fill()
    }

    function drawCore() {
      const cx = W * 0.5, cy = H * 0.35 + Math.sin(t * 0.028) * 16
      const pulse = 1 + 0.05 * Math.sin(t * 0.45)
      ;[[480*pulse,0.028,0.018],[200*pulse,0.075,0.048],[75*pulse,0.16,0.10]].forEach(([r,a1,a2]) => {
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0,   `rgba(230,178,255,${a1})`)
        g.addColorStop(0.4, `rgba(185,100,255,${a2})`)
        g.addColorStop(1,   'transparent')
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2)
        ctx.fillStyle = g; ctx.fill()
      })
    }

    function draw(now) {
      animId = requestAnimationFrame(draw)

      // Throttle to TARGET_FPS
      const delta = now - lastTime
      if (delta < FRAME_MS) return
      lastTime = now - (delta % FRAME_MS)
      t += 0.016

      ctx.clearRect(0, 0, W, H)

      // Nebulas
      nebulas.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.rot += n.rotV; n.ph += n.phV
        wrap(n, 500); drawNebula(n)
      })

      drawCore()

      // Dust
      dust.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.ph += s.tw
        wrap(s, 10)
        const a = s.tw ? s.a * (0.35 + 0.65 * Math.abs(Math.sin(s.ph))) : s.a
        ctx.save(); ctx.globalAlpha = a
        ctx.fillStyle = `hsl(${s.hue},38%,90%)`
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.fill()
        ctx.restore()
      })

      // Mid stars
      stars.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.ph += s.tw
        wrap(s, 10)
        const a = s.a * (0.42 + 0.58 * Math.abs(Math.sin(s.ph)))
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*3.5)
        g.addColorStop(0, '#fff'); g.addColorStop(0.3, `hsl(${s.hue},${s.sat}%,85%)`); g.addColorStop(1, 'transparent')
        ctx.save(); ctx.globalAlpha = a
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r*3.5, 0, Math.PI*2); ctx.fillStyle = g; ctx.fill()
        ctx.restore()
      })

      // Bright cross stars
      bright.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.ph += s.tw; s.rot += s.rotV
        wrap(s, 10)
        const a = s.a * (0.55 + 0.45 * Math.abs(Math.sin(s.ph)))
        const spike = s.spike * (0.82 + 0.18 * Math.abs(Math.sin(s.ph)))
        const bloom = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*11)
        bloom.addColorStop(0, `hsla(${s.hue},82%,88%,${a*0.45})`)
        bloom.addColorStop(0.5, `hsla(${s.hue},70%,68%,${a*0.15})`); bloom.addColorStop(1, 'transparent')
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r*11, 0, Math.PI*2); ctx.fillStyle = bloom; ctx.fill()
        drawSpike(s.x, s.y, spike, a*0.7, s.hue, s.rot)
        const core = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r*2.2)
        core.addColorStop(0, '#fff'); core.addColorStop(0.4, `hsl(${s.hue},72%,90%)`); core.addColorStop(1, 'transparent')
        ctx.save(); ctx.globalAlpha = a
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r*2.2, 0, Math.PI*2); ctx.fillStyle = core; ctx.fill()
        ctx.restore()
      })

      // Sparkles
      sparkleCooldown--
      if (sparkleCooldown <= 0) {
        const count = 1 + Math.floor(Math.random() * 3)
        for (let i = 0; i < count; i++) spawnSparkle()
        sparkleCooldown = 12 + Math.floor(Math.random() * 20)
      }
      for (let i = sparkles.length - 1; i >= 0; i--) {
        sparkles[i].life++; sparkles[i].rot += sparkles[i].rotV
        drawSparkle(sparkles[i])
        if (sparkles[i].life >= sparkles[i].maxLife) sparkles.splice(i, 1)
      }

      // Shooting stars — keep 6 active
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
        tg.addColorStop(0.45, `hsla(${sh.hue},68%,68%,${a*0.3})`)
        tg.addColorStop(1,   `hsla(${sh.hue},88%,95%,${a})`)
        ctx.save()
        ctx.strokeStyle = tg; ctx.lineWidth = sh.w
        ctx.shadowColor = `hsl(${sh.hue},80%,75%)`; ctx.shadowBlur = 8
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(sh.x, sh.y); ctx.stroke()
        ctx.restore()
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
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 110% 55% at 50% 38%, rgba(95,22,160,0.55) 0%, transparent 68%),
          radial-gradient(ellipse 70%  45% at 12% 68%, rgba(60,10,120,0.38) 0%, transparent 60%),
          radial-gradient(ellipse 80%  50% at 88% 18%, rgba(115,30,175,0.32) 0%, transparent 65%),
          linear-gradient(168deg, #04011a 0%, #08021f 28%, #05011a 55%, #02000c 100%)
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
