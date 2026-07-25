import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiCode } from 'react-icons/fi'
import {
  SiHtml5, SiCss, SiJavascript, SiReact, SiVite, SiTailwindcss,
  SiNodedotjs, SiExpress, SiMysql, SiCplusplus, SiDotnet, SiOpenjdk,
  SiExpo, SiElectron,
} from 'react-icons/si'

const frontend = [
  { name:'HTML',         level:'Advanced',     icon:SiHtml5,       color:'#e34f26' },
  { name:'CSS',          level:'Advanced',     icon:SiCss,         color:'#1572b6' },
  { name:'JavaScript',   level:'Intermediate', icon:SiJavascript,  color:'#f7df1e' },
  { name:'React.js',     level:'Intermediate', icon:SiReact,       color:'#61dafb' },
  { name:'Vite',         level:'Intermediate', icon:SiVite,        color:'#646cff' },
  { name:'Tailwind CSS', level:'Intermediate', icon:SiTailwindcss, color:'#06b6d4' },
]

const backend = [
  { name:'Node.js',    level:'Intermediate', icon:SiNodedotjs, color:'#3c873a' },
  { name:'Express.js', level:'Intermediate', icon:SiExpress,   color:'#94a3b8' },
  { name:'MySQL',      level:'Intermediate', icon:SiMysql,     color:'#4479a1' },
  { name:'Java',       level:'Basic',        icon:SiOpenjdk,   color:'#ea2d2e' },
  { name:'C++',        level:'Basic',        icon:SiCplusplus, color:'#00599c' },
]

const mobile = [
  { name:'React Native', level:'Intermediate', icon:SiReact, color:'#61dafb' },
  { name:'Expo',         level:'Intermediate', icon:SiExpo,  color:'#ffffff' },
]

const desktop = [
  { name:'Electron', level:'Intermediate', icon:SiElectron, color:'#47848f' },
  { name:'C#',       level:'Basic',        icon:SiDotnet,   color:'#9b4993' },
]

const levelColor = { Advanced:'#0ea5e9', Intermediate:'#6c63ff', Basic:'#f59e0b' }

function SkillItem({ name, level, icon:Icon, color, darkMode, delay, inView }) {
  const lc = levelColor[level] || '#6c63ff'
  return (
    <motion.div
      initial={{ opacity:0, y:16 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ delay, duration:0.4 }}
      whileHover={{ scale:1.04, y:-3 }}
      style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'10px 14px', borderRadius:12, cursor:'default',
        background: darkMode?'rgba(255,255,255,0.04)':'rgba(108,99,255,0.04)',
        border:`1px solid ${darkMode?'rgba(255,255,255,0.06)':'rgba(108,99,255,0.1)'}`,
        boxShadow: darkMode?'0 2px 10px rgba(0,0,0,0.15)':'0 2px 10px rgba(108,99,255,0.05)',
        transition:'box-shadow 0.2s',
      }}
    >
      <div style={{ width:38,height:38,borderRadius:10,flexShrink:0,
        background:`${color}18`, display:'flex',alignItems:'center',justifyContent:'center',
        border:`1px solid ${color}30` }}>
        <Icon size={20} style={{ color }}/>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontSize:13,fontWeight:600,lineHeight:1.2,
          color: darkMode?'#e2e8f0':'#1e293b', marginBottom:2 }}>{name}</p>
        <p style={{ fontSize:11,color:lc,fontWeight:600 }}>{level}</p>
      </div>
      <div style={{ width:8,height:8,borderRadius:'50%',flexShrink:0,
        background:lc, boxShadow:`0 0 7px ${lc}` }}/>
    </motion.div>
  )
}

function SkillCard({ title, subtitle, items, darkMode, inView, baseDelay, accentColor, slideDir }) {
  const strong = darkMode ? '#f1f5f9' : '#0f172a'
  return (
    <motion.div
      initial={{ opacity:0, x: slideDir==='left'?-40:slideDir==='right'?40:0, y: slideDir==='up'?32:0 }}
      animate={inView ? { opacity:1, x:0, y:0 } : {}}
      transition={{ delay:baseDelay, duration:0.55, ease:'easeOut' }}
      style={{
        flex:'1 1 300px', borderRadius:24, padding:28,
        background: darkMode?'rgba(255,255,255,0.03)':'#ffffff',
        border:`1px solid ${darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.13)'}`,
        boxShadow: darkMode?'0 4px 32px rgba(0,0,0,0.3)':'0 4px 32px rgba(108,99,255,0.08)',
      }}
    >
      <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:22 }}>
        <div style={{ width:44,height:44,borderRadius:12,flexShrink:0,
          background:`${accentColor}18`, border:`1px solid ${accentColor}30`,
          display:'flex',alignItems:'center',justifyContent:'center' }}>
          <FiCode size={20} style={{ color:accentColor }}/>
        </div>
        <div>
          <h3 style={{ fontSize:17,fontWeight:800,color:strong,lineHeight:1.1 }}>{title}</h3>
          {subtitle && <p style={{ fontSize:11,color:darkMode?'#64748b':'#94a3b8',marginTop:2 }}>{subtitle}</p>}
        </div>
      </div>
      <div style={{ height:1,background:darkMode?'rgba(255,255,255,0.06)':'rgba(108,99,255,0.08)',marginBottom:18 }}/>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))', gap:10 }}>
        {items.map((skill,i)=>(
          <SkillItem key={i} {...skill} darkMode={darkMode} inView={inView} delay={baseDelay+i*0.07}/>
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills({ darkMode }) {
  const [ref, inView] = useScrollReveal(0.08)
  const strong = darkMode ? '#f1f5f9' : '#0f172a'
  const muted  = darkMode ? '#64748b' : '#94a3b8'

  return (
    <section id="skills" style={{ padding:'80px 24px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }} ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:30 }} animate={inView?{opacity:1,y:0}:{}}
          transition={{ duration:0.5 }}
          style={{ textAlign:'center', marginBottom:52 }}
        >
          <p style={{ fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.15em',color:'#6c63ff',marginBottom:8 }}>
            What I Know
          </p>
          <h2 style={{ fontSize:36,fontWeight:900,color:strong,lineHeight:1,marginBottom:10 }}>Skills</h2>
          <p style={{ fontSize:14,color:muted }}>My technical level</p>
        </motion.div>

        {/* Row 1: Frontend + Backend */}
        <div style={{ display:'flex', gap:20, flexWrap:'wrap', marginBottom:20 }}>
          <SkillCard title="Frontend Development" subtitle="Building responsive UIs"
            items={frontend} darkMode={darkMode} inView={inView}
            baseDelay={0.1} accentColor="#6c63ff" slideDir="left"/>
          <SkillCard title="Backend Development"  subtitle="Server-side & databases"
            items={backend}  darkMode={darkMode} inView={inView}
            baseDelay={0.2} accentColor="#34d399" slideDir="right"/>
        </div>

        {/* Row 2: Mobile + Desktop */}
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          <SkillCard title="Mobile Development"  subtitle="Cross-platform apps"
            items={mobile}   darkMode={darkMode} inView={inView}
            baseDelay={0.3} accentColor="#a78bfa" slideDir="left"/>
          <SkillCard title="Desktop Development" subtitle="Native desktop apps"
            items={desktop}  darkMode={darkMode} inView={inView}
            baseDelay={0.4} accentColor="#f59e0b" slideDir="right"/>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity:0 }} animate={inView?{opacity:1}:{}} transition={{ delay:0.6 }}
          style={{ display:'flex', justifyContent:'center', gap:24, marginTop:32, flexWrap:'wrap' }}
        >
          {Object.entries(levelColor).map(([label,color])=>(
            <div key={label} style={{ display:'flex',alignItems:'center',gap:7 }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:color,boxShadow:`0 0 6px ${color}` }}/>
              <span style={{ fontSize:12,fontWeight:600,color:muted }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}




