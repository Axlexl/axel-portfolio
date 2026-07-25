import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaFacebook, FaInstagram } from 'react-icons/fa'
import { FiArrowRight, FiDownload, FiCalendar, FiCode, FiCpu, FiZap } from 'react-icons/fi'
import {
  SiVite, SiHtml5, SiCss, SiJavascript, SiNodedotjs, SiMysql,
  SiCplusplus, SiDotnet, SiKotlin, SiReact, SiElectron, SiOpenjdk,
} from 'react-icons/si'
import { personalInfo } from '../data/portfolioData'

const typingWords = [
  'Full Stack Developer',
  'Mobile App Developer',
  'Desktop Developer',
]

const techIcons = [
  { Icon: SiVite,       color: '#646cff', name: 'Vite'     },
  { Icon: SiHtml5,      color: '#e34f26', name: 'HTML'     },
  { Icon: SiCss,        color: '#1572b6', name: 'CSS'      },
  { Icon: SiJavascript, color: '#f7df1e', name: 'JS'       },
  { Icon: SiNodedotjs,  color: '#3c873a', name: 'Node.js'  },
  { Icon: SiMysql,      color: '#4479a1', name: 'MySQL'    },
  { Icon: SiCplusplus,  color: '#00599c', name: 'C++'      },
  { Icon: SiDotnet,     color: '#9b4993', name: 'C#'       },
  { Icon: SiOpenjdk,    color: '#ea2d2e', name: 'Java'     },
  { Icon: SiKotlin,     color: '#7f52ff', name: 'Kotlin'   },
  { Icon: SiReact,      color: '#61dafb', name: 'React'    },
  { Icon: SiElectron,   color: '#47848f', name: 'Electron' },
]

const stats = [
  { value: '3+',     label: 'Years Learning',     icon: FiCalendar },
  { value: '15+',    label: 'Projects Completed', icon: FiCode     },
  { value: '10+',    label: 'Technologies',       icon: FiCpu      },
  { value: 'Always', label: 'Learning',           icon: FiZap      },
]

// stagger children helper
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Hero({ darkMode }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting,  setDeleting]  = useState(false)

  useEffect(() => {
    const word = typingWords[wordIndex]
    let t
    if (!deleting && displayed.length < word.length) {
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 70)
    } else if (!deleting && displayed.length === word.length) {
      t = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else {
      setDeleting(false)
      setWordIndex(i => (i + 1) % typingWords.length)
    }
    return () => clearTimeout(t)
  }, [displayed, deleting, wordIndex])

  const card = {
    background:    darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.85)',
    border:        `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(108,99,255,0.15)'}`,
    backdropFilter: 'blur(12px)',
  }

  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section
      id="home"
      style={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px 24px', position: 'relative', overflow: 'hidden',
      }}
    >
      {/* BG glows */}
      <div style={{ position:'absolute', top:-100, right:-100, width:600, height:600, borderRadius:'50%', pointerEvents:'none',
        background:'radial-gradient(circle,rgba(14,165,233,0.09) 0%,transparent 65%)' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:500, height:500, borderRadius:'50%', pointerEvents:'none',
        background:'radial-gradient(circle,rgba(108,99,255,0.10) 0%,transparent 65%)' }} />

      <div style={{ maxWidth:1100, margin:'0 auto', width:'100%' }}>

        {/* ── Hero row ── */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:48, alignItems:'center', marginBottom:48 }}>

          {/* LEFT */}
          <motion.div
            style={{ flex:'1 1 320px', minWidth:0 }}
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={item} style={{ fontSize:18, marginBottom:8, fontWeight:500,
              color: darkMode ? '#94a3b8' : '#64748b' }}>
              Hey, I'm{' '}
              <span style={{ background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', fontWeight:700 }}>
                {personalInfo.name}
              </span>
            </motion.p>

            <motion.h1 variants={item} style={{ fontWeight:900, lineHeight:1.1, marginBottom:16,
              fontSize:'clamp(2rem,5.5vw,4rem)', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
              I'm a{' '}
              <span style={{ background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                {displayed}
              </span>
              <span style={{ color:'#6c63ff', animation:'blink 1s step-end infinite' }}>|</span>
            </motion.h1>

            <motion.p variants={item} style={{ fontSize:14, lineHeight:1.75, maxWidth:460,
              marginBottom:32, color: darkMode ? '#94a3b8' : '#64748b' }}>
              {personalInfo.bio}
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={item} style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:28 }}>
              <button
                onClick={() => scrollTo('projects')}
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'12px 24px', borderRadius:12, border:'none', cursor:'pointer',
                  background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
                  color:'#fff', fontWeight:600, fontSize:14,
                  boxShadow:'0 8px 24px rgba(108,99,255,0.4)',
                  transition:'transform 0.2s,box-shadow 0.2s',
                }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow='0 14px 32px rgba(108,99,255,0.55)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 8px 24px rgba(108,99,255,0.4)'}}
              >
                View My Work <FiArrowRight size={15}/>
              </button>

              <a
                href="/cv.pdf" download
                style={{
                  display:'flex', alignItems:'center', gap:8,
                  padding:'12px 24px', borderRadius:12, textDecoration:'none',
                  ...card,
                  color: darkMode ? '#cbd5e1' : '#475569',
                  fontWeight:600, fontSize:14,
                  transition:'transform 0.2s',
                }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
              >
                Download CV <FiDownload size={15}/>
              </a>
            </motion.div>

            {/* Social */}
            <motion.div variants={item} style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <a href={personalInfo.github} target="_blank" rel="noreferrer"
                style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600,
                  textDecoration:'none', color: darkMode ? '#94a3b8' : '#64748b',
                  padding:'8px 16px', borderRadius:10, border:`1px solid ${darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.15)'}`,
                  transition:'all 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,#6c63ff,#a78bfa)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='transparent'}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=darkMode?'#94a3b8':'#64748b';e.currentTarget.style.borderColor=darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.15)'}}
              >
                <FaGithub size={16}/> GitHub
              </a>

              <a href={personalInfo.facebook} target="_blank" rel="noreferrer"
                style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600,
                  textDecoration:'none', color: darkMode ? '#94a3b8' : '#64748b',
                  padding:'8px 16px', borderRadius:10, border:`1px solid ${darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.15)'}`,
                  transition:'all 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,#1877f2,#42a5f5)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='transparent'}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=darkMode?'#94a3b8':'#64748b';e.currentTarget.style.borderColor=darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.15)'}}
              >
                <FaFacebook size={16}/> Facebook
              </a>

              <a href={personalInfo.instagram} target="_blank" rel="noreferrer"
                style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600,
                  textDecoration:'none', color: darkMode ? '#94a3b8' : '#64748b',
                  padding:'8px 16px', borderRadius:10, border:`1px solid ${darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.15)'}`,
                  transition:'all 0.2s' }}
                onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='transparent'}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=darkMode?'#94a3b8':'#64748b';e.currentTarget.style.borderColor=darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.15)'}}
              >
                <FaInstagram size={16}/> Instagram
              </a>

              <button
                onClick={() => scrollTo('contact')}
                style={{
                  display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600,
                  padding:'8px 16px', borderRadius:10, border:`1px solid ${darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.15)'}`,
                  background:'transparent', cursor:'pointer',
                  color: darkMode ? '#94a3b8' : '#64748b',
                  transition:'all 0.2s',
                }}
                onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,#6c63ff,#a78bfa)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='transparent'}}
                onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.color=darkMode?'#94a3b8':'#64748b';e.currentTarget.style.borderColor=darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.15)'}}
              >
                Contact Me
              </button>
            </motion.div>
          </motion.div>

          {/* RIGHT: photo circle */}
          <motion.div
            style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', flex:'0 0 auto' }}
            initial={{ opacity:0, scale:0.7 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.7, delay:0.3, type:'spring', stiffness:110 }}
          >
            <div style={{ position:'relative', width:300, height:300 }}>
              <motion.div
                animate={{ rotate:360 }}
                transition={{ duration:10, repeat:Infinity, ease:'linear' }}
                style={{ position:'absolute', inset:-4, borderRadius:'50%',
                  background:'conic-gradient(from 0deg,#6c63ff,#a78bfa,#ec4899,#6c63ff)' }}
              />
              <div style={{ position:'absolute', inset:0, borderRadius:'50%',
                background: darkMode ? '#020818' : '#f0f0ff', margin:4 }} />
              <div style={{ position:'absolute', inset:8, borderRadius:'50%',
                background:'linear-gradient(135deg,#1e1b4b,#312e81,#6c63ff)',
                display:'flex', alignItems:'center', justifyContent:'center',
                overflow:'hidden', boxShadow:'inset 0 0 40px rgba(0,0,0,0.4)' }}>
                <img
                  src="/photo.jpg"
                  alt="Axel Socobos"
                  style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }}
                  onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}
                />
                <div style={{ textAlign:'center', display:'none' }}>
                  <div style={{ fontSize:72, lineHeight:1 }}>👨‍💻</div>
                </div>
              </div>

              {/* Available badge */}
              <motion.div
                animate={{ y:[0,-7,0] }} transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut' }}
                style={{ position:'absolute', bottom:12, right:-12,
                  display:'flex', alignItems:'center', gap:6,
                  background: darkMode ? 'rgba(13,13,26,0.92)' : '#fff',
                  border:`1px solid ${darkMode?'rgba(255,255,255,0.1)':'rgba(108,99,255,0.2)'}`,
                  borderRadius:20, padding:'6px 14px',
                  backdropFilter:'blur(12px)', boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'#0ea5e9', boxShadow:'0 0 8px #0ea5e9' }}/>
                <span style={{ fontSize:11, fontWeight:700, color: darkMode?'#e2e8f0':'#1a1a2e' }}>Available</span>
              </motion.div>

              {/* 3rd Year IT badge */}
              <motion.div
                animate={{ y:[0,7,0] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut', delay:0.8 }}
                style={{ position:'absolute', top:16, left:-20,
                  background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
                  borderRadius:20, padding:'6px 14px',
                  boxShadow:'0 4px 16px rgba(108,99,255,0.4)' }}>
                <span style={{ fontSize:10, fontWeight:700, color:'#fff' }}>🎓 3rd Year IT</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom cards ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
          {/* Stats */}
          <motion.div
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}
            style={{ ...card, borderRadius:20, padding:24 }}
          >
            <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#6c63ff', marginBottom:18 }}>
              At a Glance
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              {stats.map(({ value, label, icon: Icon }, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:10, flexShrink:0,
                    display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(108,99,255,0.12)' }}>
                    <Icon size={18} style={{ color:'#6c63ff' }}/>
                  </div>
                  <div>
                    <p style={{ fontSize:22, fontWeight:900, lineHeight:1.1,
                      background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
                      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{value}</p>
                    <p style={{ fontSize:11, color: darkMode?'#64748b':'#94a3b8' }}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech stack */}
          <motion.div
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7 }}
            style={{ ...card, borderRadius:20, padding:24 }}
          >
            <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'#6c63ff', marginBottom:18 }}>
              Tech Stack
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12 }}>
              {techIcons.map(({ Icon, color, name }, i) => (
                <motion.div key={i} whileHover={{ scale:1.3, y:-4 }}
                  transition={{ type:'spring', stiffness:300 }}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, cursor:'default' }}
                  title={name}>
                  <Icon size={22} style={{ color }}/>
                  <span style={{ fontSize:8, fontWeight:500, color: darkMode?'#475569':'#94a3b8', textAlign:'center' }}>{name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </section>
  )
}




