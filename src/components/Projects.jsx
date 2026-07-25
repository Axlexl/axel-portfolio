import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiBriefcase, FiGithub, FiArrowRight, FiPlay, FiX, FiExternalLink } from 'react-icons/fi'
import { projects } from '../data/portfolioData'

const categories = ['All', 'Web', 'Mobile', 'Desktop']

/* ── Video Modal ── */
function VideoModal({ project, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Convert YouTube watch / shorts / youtu.be URL → embed URL
  const getEmbed = url => {
    if (!url) return null
    try {
      const u = new URL(url)
      // youtube.com/shorts/ID
      if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/shorts/')) {
        const id = u.pathname.replace('/shorts/', '')
        return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
      }
      // youtube.com/watch?v=ID
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null
      }
      // youtu.be/ID
      if (u.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed${u.pathname}?autoplay=1&rel=0`
      }
      return url
    } catch { return url }
  }

  const embedUrl = getEmbed(project.demo)

  return (
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}
      >
        <motion.div
          key="modal-box"
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{   opacity: 0, scale: 0.88, y: 40  }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 880,
            background: '#0d0820',
            border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 0 0 1px rgba(108,99,255,0.4), 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(108,99,255,0.15)',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px',
            background: 'rgba(108,99,255,0.08)',
            borderBottom: '1px solid rgba(108,99,255,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {project.thumbnail
                ? <img src={project.thumbnail} alt={project.title} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                : <span style={{ fontSize: 22 }}>{project.image}</span>
              }
              <div>
                <p style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9' }}>{project.title}</p>
                <p style={{ fontSize: 11, color: '#a78bfa', marginTop: 1 }}>Demo Video</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={project.demo} target="_blank" rel="noreferrer"
                style={{
                  width: 34, height: 34, borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94a3b8', textDecoration: 'none', transition: 'all 0.2s',
                }}
                title="Open in new tab"
                onMouseEnter={e => { e.currentTarget.style.background='rgba(108,99,255,0.3)'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#94a3b8' }}
              >
                <FiExternalLink size={15} />
              </a>
              <button onClick={onClose}
                style={{
                  width: 34, height: 34, borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94a3b8', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.3)'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#94a3b8' }}
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Video */}
          <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={`${project.title} Demo`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  border: 'none',
                }}
              />
            ) : (
              /* Placeholder when no URL yet */
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg,#0d0820,#160a2e)',
                gap: 16,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'rgba(108,99,255,0.15)',
                  border: '2px solid rgba(108,99,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FiPlay size={28} style={{ color: '#a78bfa', marginLeft: 4 }} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#94a3b8' }}>
                  Demo video coming soon
                </p>
                <p style={{ fontSize: 12, color: '#475569', maxWidth: 280, textAlign: 'center' }}>
                  The demo for this project will be available shortly.
                </p>
              </div>
            )}
          </div>

          {/* Footer — tags */}
          <div style={{
            padding: '12px 20px',
            display: 'flex', flexWrap: 'wrap', gap: 6,
            borderTop: '1px solid rgba(108,99,255,0.12)',
          }}>
            {project.tags.map((tag, i) => (
              <span key={i} style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 600,
                background: 'rgba(108,99,255,0.14)', color: '#a78bfa',
                border: '1px solid rgba(108,99,255,0.22)',
              }}>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── Main Projects Section ── */
export default function Projects({ darkMode }) {
  const [ref, inView]       = useScrollReveal(0.05)
  const [filter, setFilter] = useState('All')
  const [showAll, setShowAll] = useState(false)
  const [demoProject, setDemoProject] = useState(null)  // which project modal is open

  const filtered  = filter === 'All' ? projects : projects.filter(p => p.category === filter)
  const displayed = showAll ? filtered : filtered.slice(0, 4)

  const strong  = darkMode ? '#f1f5f9' : '#0f172a'
  const muted   = darkMode ? '#94a3b8' : '#64748b'
  const cardBg  = darkMode ? '#0b1628' : '#ffffff'
  const cardBdr = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(108,99,255,0.15)'

  return (
    <section id="projects" style={{ padding: '80px 24px' }}>
      {/* Video modal */}
      {demoProject && (
        <VideoModal project={demoProject} onClose={() => setDemoProject(null)} />
      )}

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
                  borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  background: cardBg, border: `1px solid ${cardBdr}`,
                  boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(108,99,255,0.08)',
                }}
              >
                {/* Banner — screenshot or emoji */}
                <div style={{
                  height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 44, flexShrink: 0, overflow: 'hidden',
                  background: darkMode
                    ? 'linear-gradient(135deg,rgba(108,99,255,0.18),rgba(167,139,250,0.10))'
                    : 'linear-gradient(135deg,rgba(108,99,255,0.10),rgba(167,139,250,0.06))',
                }}>
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                      onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                  ) : null}
                  <div style={{ display: project.thumbnail ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 44 }}>
                    {project.image}
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
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

                  {/* Links row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    {/* Left: View Project + Demo button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <a href={project.github} target="_blank" rel="noreferrer"
                        style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#6c63ff', textDecoration: 'none', transition: 'gap 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.gap = '9px'}
                        onMouseLeave={e => e.currentTarget.style.gap = '5px'}>
                        Code <FiArrowRight size={12} />
                      </a>

                      {/* Demo button — always shown, placeholder if no URL */}
                      <button
                        onClick={() => setDemoProject(project)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 7,
                          border: 'none', cursor: 'pointer',
                          background: project.demo
                            ? 'linear-gradient(135deg,#6c63ff,#a78bfa)'
                            : 'rgba(108,99,255,0.12)',
                          color: project.demo ? '#fff' : '#a78bfa',
                          border: project.demo ? 'none' : '1px solid rgba(108,99,255,0.25)',
                          transition: 'opacity 0.2s, transform 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <FiPlay size={10} />
                        {project.demo ? 'Demo' : 'Demo Soon'}
                      </button>
                    </div>

                    {/* Right: GitHub icon */}
                    <a href={project.github} target="_blank" rel="noreferrer"
                      style={{ color: muted, textDecoration: 'none', display: 'flex', transition: 'color 0.2s', flexShrink: 0 }}
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
