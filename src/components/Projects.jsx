import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiBriefcase, FiGithub, FiArrowRight } from 'react-icons/fi'
import { projects } from '../data/portfolioData'

const categories = ['All', 'Web', 'Mobile', 'Desktop']

export default function Projects({ darkMode }) {
  const [ref, inView] = useScrollReveal(0.05)
  const [filter,  setFilter]  = useState('All')
  const [showAll, setShowAll] = useState(false)

  const filtered  = filter === 'All' ? projects : projects.filter(p => p.category === filter)
  const displayed = showAll ? filtered : filtered.slice(0, 4)

  const strong  = darkMode ? '#f1f5f9' : '#0f172a'
  const muted   = darkMode ? '#94a3b8' : '#64748b'
  const cardBg  = darkMode ? '#0b1628' : '#ffffff'
  const cardBdr = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(108,99,255,0.15)'

  return (
    <section id="projects" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }} ref={ref}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 36 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiBriefcase size={20} style={{ color: '#6c63ff' }} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6c63ff', marginBottom: 2 }}>
                  What I've Built
                </p>
                <h2 style={{ fontSize: 32, fontWeight: 900, color: strong, lineHeight: 1 }}>Projects</h2>
              </div>
            </div>
            <button onClick={() => setShowAll(s => !s)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#6c63ff', background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'opacity 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {showAll ? 'Show Less' : 'View All Projects'} <FiArrowRight size={13} />
            </button>
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => { setFilter(cat); setShowAll(false) }}
                style={{
                  padding: '6px 18px', borderRadius: 99, fontSize: 13, fontWeight: 500,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: filter === cat ? 'linear-gradient(135deg,#6c63ff,#a78bfa)' : darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(108,99,255,0.08)',
                  color: filter === cat ? '#fff' : muted,
                  boxShadow: filter === cat ? '0 4px 14px rgba(108,99,255,0.4)' : 'none',
                }}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 20 }}>
          <AnimatePresence mode="popLayout">
            {displayed.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -8 }}
                className={`glow-card${!darkMode ? ' glow-light' : ''}`}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  background: cardBg,
                  border: `1px solid ${cardBdr}`,
                  boxShadow: darkMode
                    ? '0 4px 20px rgba(0,0,0,0.4)'
                    : '0 4px 20px rgba(108,99,255,0.08)',
                }}
              >
                {/* Banner */}
                <div style={{
                  height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 44, flexShrink: 0,
                  background: darkMode
                    ? 'linear-gradient(135deg,rgba(108,99,255,0.18),rgba(167,139,250,0.10))'
                    : 'linear-gradient(135deg,rgba(108,99,255,0.10),rgba(167,139,250,0.06))',
                }}>
                  {project.image}
                </div>

                {/* Body */}
                <div style={{ padding: '16px 16px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: strong, marginBottom: 8, lineHeight: 1.4 }}>
                    {project.title}
                  </h3>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: muted, marginBottom: 12, flex: 1 }}>
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                    {project.tags.map((tag, ti) => (
                      <span key={ti} style={{
                        fontSize: 10, padding: '4px 9px', borderRadius: 99, fontWeight: 600,
                        background: darkMode ? 'rgba(108,99,255,0.18)' : 'rgba(108,99,255,0.09)',
                        color: '#a78bfa',
                        border: `1px solid ${darkMode ? 'rgba(108,99,255,0.3)' : 'rgba(108,99,255,0.2)'}`,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <a href={project.github} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#6c63ff', textDecoration: 'none', transition: 'gap 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.gap = '9px'}
                      onMouseLeave={e => e.currentTarget.style.gap = '5px'}>
                      View Project <FiArrowRight size={12} />
                    </a>
                    <a href={project.github} target="_blank" rel="noreferrer"
                      style={{ color: muted, textDecoration: 'none', display: 'flex', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#6c63ff'}
                      onMouseLeave={e => e.currentTarget.style.color = muted}>
                      <FiGithub size={15} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}



