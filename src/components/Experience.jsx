import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { MdWorkOutline } from 'react-icons/md'
import { FiCalendar } from 'react-icons/fi'
import { experience } from '../data/portfolioData'

export default function Experience({ darkMode }) {
  const [ref, inView] = useScrollReveal(0.1)

  const strong  = darkMode ? '#f1f5f9' : '#0f172a'
  const muted   = darkMode ? '#94a3b8' : '#64748b'
  const cardBg  = darkMode ? '#0b1628' : '#ffffff'
  const cardBdr = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(108,99,255,0.15)'

  return (
    <section id="experience" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }} ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MdWorkOutline size={22} style={{ color: '#6c63ff' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6c63ff', marginBottom: 2 }}>My Journey</p>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: strong, lineHeight: 1 }}>Experience</h2>
          </div>
        </motion.div>

        {/* Timeline */}
        <div style={{ position: 'relative', paddingLeft: 32 }}>
          {/* Vertical line */}
          <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: `linear-gradient(to bottom, #6c63ff, ${darkMode ? 'rgba(108,99,255,0)' : 'rgba(108,99,255,0.05)'})` }} />

          {experience.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -36 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.18, duration: 0.55, ease: 'easeOut' }}
              style={{ position: 'relative', marginBottom: i < experience.length - 1 ? 28 : 0 }}
            >
              {/* Timeline dot */}
              <motion.div
                initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
                transition={{ delay: i * 0.18 + 0.2, type: 'spring', stiffness: 260 }}
                style={{ position: 'absolute', left: -28, top: 22, width: 16, height: 16, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', boxShadow: '0 0 0 3px rgba(108,99,255,0.2), 0 0 14px rgba(108,99,255,0.6)', zIndex: 1 }}
              />

              {/* Glow card */}
              <motion.div
                whileHover={{ y: -4 }}
                className={`glow-card${!darkMode ? ' glow-light' : ''}`}
                style={{
                  borderRadius: 20, padding: '24px 28px',
                  background: cardBg, border: `1px solid ${cardBdr}`,
                  boxShadow: darkMode ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(108,99,255,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: strong, marginBottom: 3 }}>{item.role}</h3>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>{item.company}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 99, flexShrink: 0, background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.25)', fontSize: 11, fontWeight: 600, color: '#6c63ff' }}>
                    <FiCalendar size={11} /> {item.period}
                  </div>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: muted, marginBottom: 16 }}>{item.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {item.tags.map((tag, ti) => (
                    <span key={ti} style={{ fontSize: 11, padding: '4px 12px', borderRadius: 99, fontWeight: 600, background: 'rgba(108,99,255,0.12)', color: '#a78bfa', border: '1px solid rgba(108,99,255,0.22)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}




