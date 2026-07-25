import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiUser, FiMapPin, FiMail, FiPhone } from 'react-icons/fi'
import { FaGithub, FaFacebook, FaInstagram } from 'react-icons/fa'
import { personalInfo } from '../data/portfolioData'

const traits = ['Problem Solver','Fast Learner','Team Player','Detail Oriented','Creative Thinker','Self-Motivated']

const fadeUp   = (delay=0) => ({ hidden:{opacity:0,y:32}, show:{opacity:1,y:0,transition:{duration:0.55,delay,ease:'easeOut'}} })
const fadeLeft  = (delay=0) => ({ hidden:{opacity:0,x:-40}, show:{opacity:1,x:0,transition:{duration:0.55,delay,ease:'easeOut'}} })
const fadeRight = (delay=0) => ({ hidden:{opacity:0,x:40},  show:{opacity:1,x:0,transition:{duration:0.55,delay,ease:'easeOut'}} })

export default function AboutMe({ darkMode }) {
  const [ref, inView] = useScrollReveal(0.1)

  const strong  = darkMode ? '#f1f5f9' : '#0f172a'
  const muted   = darkMode ? '#94a3b8' : '#64748b'
  const cardBg  = darkMode ? 'rgba(255,255,255,0.06)' : '#ffffff'
  const cardBdr = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(108,99,255,0.13)'
  const card    = { background:cardBg, border:`1px solid ${cardBdr}` }

  return (
    <section id="about" style={{ padding:'80px 24px' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }} ref={ref}>

        {/* Header */}
        <motion.div
          variants={fadeUp(0)} initial="hidden" animate={inView?'show':'hidden'}
          style={{ display:'flex', alignItems:'center', gap:14, marginBottom:48 }}
        >
          <div style={{ width:44,height:44,borderRadius:12,flexShrink:0,background:'rgba(108,99,255,0.12)',
            display:'flex',alignItems:'center',justifyContent:'center' }}>
            <FiUser size={20} style={{ color:'#6c63ff' }}/>
          </div>
          <div>
            <p style={{ fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.12em',color:'#6c63ff',marginBottom:2 }}>Who I Am</p>
            <h2 style={{ fontSize:32,fontWeight:900,color:strong,lineHeight:1 }}>About Me</h2>
          </div>
        </motion.div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:28, alignItems:'start' }}>

          {/* LEFT — profile card */}
          <motion.div
            variants={fadeLeft(0.1)} initial="hidden" animate={inView?'show':'hidden'}
            style={{ ...card, borderRadius:20, padding:'32px 24px',
              display:'flex', flexDirection:'column', alignItems:'center', gap:20,
              boxShadow: darkMode?'0 4px 28px rgba(0,0,0,0.25)':'0 4px 28px rgba(108,99,255,0.08)' }}
          >
            <div style={{
              width:110, height:110, borderRadius:'50%',
              background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontSize:36, fontWeight:900,
              boxShadow:'0 12px 40px rgba(108,99,255,0.4)',
              overflow:'hidden', flexShrink:0,
            }}>
              <img
                src="/photo.jpg"
                alt="Axel Socobos"
                style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center' }}
                onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
              />
              <span style={{ display:'none', alignItems:'center', justifyContent:'center', width:'100%', height:'100%', fontSize:36, fontWeight:900 }}>AS</span>
            </div>

            <div style={{ textAlign:'center' }}>
              <h3 style={{ fontSize:20,fontWeight:800,color:strong,marginBottom:4 }}>{personalInfo.name}</h3>
              <p style={{ fontSize:13,color:'#a78bfa',fontWeight:500 }}>{personalInfo.title}</p>
            </div>

            <div style={{ width:'100%', height:1, background: darkMode?'rgba(255,255,255,0.07)':'rgba(108,99,255,0.1)' }}/>

            <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { icon:FiMapPin, text:personalInfo.location },
                { icon:FiMail,   text:personalInfo.email },
                { icon:FiPhone,  text:personalInfo.phone },
              ].map(({ icon:Icon, text }, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:30,height:30,borderRadius:8,flexShrink:0,background:'rgba(108,99,255,0.1)',
                    display:'flex',alignItems:'center',justifyContent:'center' }}>
                    <Icon size={13} style={{ color:'#6c63ff' }}/>
                  </div>
                  <span style={{ fontSize:13,color:muted,wordBreak:'break-all' }}>{text}</span>
                </div>
              ))}
            </div>

            <a href={personalInfo.github} target="_blank" rel="noreferrer"
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                padding:'11px 0', borderRadius:12, textDecoration:'none',
                background: darkMode?'rgba(255,255,255,0.06)':'rgba(108,99,255,0.07)',
                color:muted, fontSize:13, fontWeight:600,
                border:`1px solid ${darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.12)'}`,
                transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,#6c63ff,#a78bfa)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='transparent'}}
              onMouseLeave={e=>{e.currentTarget.style.background=darkMode?'rgba(255,255,255,0.06)':'rgba(108,99,255,0.07)';e.currentTarget.style.color=muted;e.currentTarget.style.borderColor=darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.12)'}}
            >
              <FaGithub size={16}/> GitHub Profile
            </a>

            <a href={personalInfo.facebook} target="_blank" rel="noreferrer"
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                padding:'11px 0', borderRadius:12, textDecoration:'none',
                background: darkMode?'rgba(255,255,255,0.06)':'rgba(108,99,255,0.07)',
                color:muted, fontSize:13, fontWeight:600,
                border:`1px solid ${darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.12)'}`,
                transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,#1877f2,#42a5f5)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='transparent'}}
              onMouseLeave={e=>{e.currentTarget.style.background=darkMode?'rgba(255,255,255,0.06)':'rgba(108,99,255,0.07)';e.currentTarget.style.color=muted;e.currentTarget.style.borderColor=darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.12)'}}
            >
              <FaFacebook size={16}/> Facebook Profile
            </a>

            <a href={personalInfo.instagram} target="_blank" rel="noreferrer"
              style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                padding:'11px 0', borderRadius:12, textDecoration:'none',
                background: darkMode?'rgba(255,255,255,0.06)':'rgba(108,99,255,0.07)',
                color:muted, fontSize:13, fontWeight:600,
                border:`1px solid ${darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.12)'}`,
                transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)';e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='transparent'}}
              onMouseLeave={e=>{e.currentTarget.style.background=darkMode?'rgba(255,255,255,0.06)':'rgba(108,99,255,0.07)';e.currentTarget.style.color=muted;e.currentTarget.style.borderColor=darkMode?'rgba(255,255,255,0.08)':'rgba(108,99,255,0.12)'}}
            >
              <FaInstagram size={16}/> Instagram Profile
            </a>
          </motion.div>

          {/* RIGHT — bio + traits */}
          <motion.div
            variants={fadeRight(0.15)} initial="hidden" animate={inView?'show':'hidden'}
            style={{ display:'flex', flexDirection:'column', gap:20 }}
          >
            <div style={{ ...card, borderRadius:20, padding:24,
              display:'flex', flexDirection:'column', gap:14,
              boxShadow: darkMode?'0 4px 28px rgba(0,0,0,0.25)':'0 4px 28px rgba(108,99,255,0.08)' }}>
              {[
                <>Hey there! I'm <strong style={{ color:'#a78bfa' }}>Axel Socobos</strong>, a 3rd Year IT student based in the Philippines. I'm passionate about creating meaningful software that solves real world problems.</>,
                <>My journey started with curiosity  taking apart how websites work, experimenting with code, and never stopping. Today I build everything from web apps to mobile and desktop solutions.</>,
                <>When I'm not coding, you'll find me exploring new technologies, contributing to academic projects, and collaborating with others to bring ideas to life.</>,
              ].map((para, i) => (
                <p key={i} style={{ fontSize:14, lineHeight:1.75, color:muted }}>{para}</p>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {traits.map((trait, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity:0, scale:0.85, y:10 }}
                  animate={inView ? { opacity:1, scale:1, y:0 } : {}}
                  transition={{ delay:0.25 + i*0.07, duration:0.4 }}
                  whileHover={{ scale:1.03, y:-2 }}
                  style={{ ...card, borderRadius:12, padding:'10px 14px',
                    display:'flex', alignItems:'center', gap:10,
                    boxShadow: darkMode?'0 2px 12px rgba(0,0,0,0.15)':'0 2px 12px rgba(108,99,255,0.06)',
                    cursor:'default' }}
                >
                  <span style={{ width:8,height:8,borderRadius:'50%',flexShrink:0,
                    background:'linear-gradient(135deg,#6c63ff,#a78bfa)',
                    boxShadow:'0 0 8px rgba(108,99,255,0.5)' }}/>
                  <span style={{ fontSize:13,fontWeight:500,color:muted }}>{trait}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}




