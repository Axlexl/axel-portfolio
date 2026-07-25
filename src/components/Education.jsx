import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiBook, FiCalendar } from 'react-icons/fi'
import { education } from '../data/portfolioData'

export default function Education({ darkMode }) {
  const [ref, inView] = useScrollReveal(0.05)

  const strong  = darkMode ? '#f1f5f9' : '#0f172a'
  const muted   = darkMode ? '#94a3b8' : '#64748b'
  const cardBg  = darkMode ? '#0b1628' : '#ffffff'
  const cardBdr = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(108,99,255,0.15)'

  return (
    <section id="education" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }} ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 48 }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: 'rgba(108,99,255,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiBook size={20} style={{ color: '#6c63ff' }} />
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6c63ff', marginBottom: 2 }}>
              Academic Background
            </p>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: strong, lineHeight: 1 }}>Education</h2>
          </div>
        </motion.div>

        {/* Cards grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {education.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 36, scale: 0.96 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.16, duration: 0.7, ease: 'easeOut' }}
              whileHover={{ y: -8 }}
              className={`glow-card${!darkMode ? ' glow-light' : ''}`}
              style={{
                borderRadius: 20,
                padding: '24px',
                background: cardBg,
                border: `1px solid ${cardBdr}`,
                boxShadow: darkMode
                  ? '0 4px 24px rgba(0,0,0,0.5)'
                  : '0 4px 24px rgba(108,99,255,0.10)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {/* Icon + badge row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(108,99,255,0.5)',
                }}>
                  <FiBook size={22} color="#fff" />
                </div>

                {item.badge && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 99,
                    background: 'rgba(14,165,233,0.15)',
                    border: '1px solid rgba(14,165,233,0.35)',
                    color: '#0ea5e9',
                    letterSpacing: '0.05em',
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Degree */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: strong, lineHeight: 1.4, marginBottom: 4 }}>
                  {item.degree}
                </h3>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa' }}>{item.school}</p>
              </div>

              {/* Period badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
                padding: '4px 12px', borderRadius: 99,
                background: 'rgba(108,99,255,0.12)',
                border: '1px solid rgba(108,99,255,0.25)',
                fontSize: 11, fontWeight: 600, color: '#6c63ff',
              }}>
                <FiCalendar size={11} /> {item.period}
              </div>

              {/* Description - removed */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

