import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiBriefcase, FiArrowRight, FiPlay, FiX, FiExternalLink, FiLock, FiMail, FiZoomIn } from 'react-icons/fi'
import { projects } from '../data/portfolioData'
import { personalInfo } from '../data/portfolioData'

const categories = ['All', 'Web', 'Mobile', 'Desktop']

/* ── Full-screen image lightbox ── */
function ImageLightbox({ src, alt, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9500,
          background: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20, cursor: 'zoom-out',
        }}
      >
        <button onClick={onClose} style={{
          position: 'absolute', top: 20, right: 20,
          width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.12)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', zIndex: 1,
        }}>
          <FiX size={20} />
        </button>

        <motion.img
          src={src} alt={alt}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: '95vw', maxHeight: '88vh',
            objectFit: 'contain', borderRadius: 12, cursor: 'default',
            boxShadow: '0 0 0 1px rgba(108,99,255,0.45), 0 40px 100px rgba(0,0,0,0.8)',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={{ position: 'absolute', bottom: 20, fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}
        >
          {alt} · Click anywhere or press Esc to close
        </motion.p>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── Code Lock Modal ── */
function CodeLockModal({ project, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        key="lock-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
        }}
      >
        <motion.div
          key="lock-box"
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{   opacity: 0, scale: 0.85, y: 30  }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 420, borderRadius: 20,
            background: '#0d0820',
            border: '1px solid rgba(108,99,255,0.35)',
            boxShadow: '0 0 0 1px rgba(108,99,255,0.3), 0 30px 70px rgba(0,0,0,0.6), 0 0 50px rgba(108,99,255,0.12)',
            overflow: 'hidden',
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
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'rgba(108,99,255,0.15)',
                border: '1px solid rgba(108,99,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FiLock size={17} style={{ color: '#a78bfa' }} />
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: 14, color: '#f1f5f9' }}>Source Code</p>
                <p style={{ fontSize: 11, color: '#a78bfa', marginTop: 1 }}>{project.title}</p>
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'rgba(255,255,255,0.07)', color: '#94a3b8',
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.3)'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#94a3b8' }}
            >
              <FiX size={15} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '28px 24px', textAlign: 'center' }}>
            {/* Big lock icon */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                background: 'linear-gradient(135deg,rgba(108,99,255,0.2),rgba(167,139,250,0.1))',
                border: '2px solid rgba(108,99,255,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 30px rgba(108,99,255,0.2)',
              }}
            >
              <FiLock size={30} style={{ color: '#a78bfa' }} />
            </motion.div>

            <p style={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9', marginBottom: 10 }}>
              This code is not free
            </p>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 24 }}>
              The source code for <strong style={{ color: '#a78bfa' }}>{project.title}</strong> is private.
              If you're interested in acquiring it or want to discuss a similar project,
              feel free to contact me.
            </p>

            {/* Get In Touch — closes modal and scrolls to contact section */}
            <button
              onClick={() => {
                onClose()
                setTimeout(() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }, 300)
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 32px', borderRadius: 12,
                border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
                color: '#fff', fontWeight: 700, fontSize: 14,
                boxShadow: '0 4px 20px rgba(108,99,255,0.4)',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity='0.85'; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity='1'; e.currentTarget.style.transform='translateY(0)' }}
            >
              <FiMail size={15} /> Get In Touch
            </button>

            <p style={{ fontSize: 11, color: '#475569', marginTop: 14 }}>
              {personalInfo.email}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── Video Modal ── */
function VideoModal({ project, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  // Detect local video vs YouTube
  const isLocal = project.demo && (project.demo.endsWith('.mp4') || project.demo.startsWith('/'))

  const getEmbed = url => {
    if (!url) return null
    if (isLocal) return url
    try {
      const u = new URL(url)
      if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/shorts/')) {
        return `https://www.youtube.com/embed/${u.pathname.replace('/shorts/', '')}?autoplay=1&rel=0`
      }
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v')
        return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : null
      }
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
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
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
            width: '100%', maxWidth: isLocal ? 420 : 880,
            background: '#0d0820',
            border: '1px solid rgba(108,99,255,0.3)', borderRadius: 20, overflow: 'hidden',
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
              {!isLocal && (
                <a href={project.demo} target="_blank" rel="noreferrer"
                  style={{
                    width: 34, height: 34, borderRadius: 9, border: 'none', cursor: 'pointer',
                    background: 'rgba(255,255,255,0.07)', color: '#94a3b8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(108,99,255,0.3)'; e.currentTarget.style.color='#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#94a3b8' }}
                >
                  <FiExternalLink size={15} />
                </a>
              )}
              <button onClick={onClose} style={{
                width: 34, height: 34, borderRadius: 9, border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.07)', color: '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.3)'; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='#94a3b8' }}
              >
                <FiX size={16} />
              </button>
            </div>
          </div>

          {/* Video */}
          {isLocal ? (
            <video
              src={embedUrl}
              controls autoPlay
              style={{ width: '100%', display: 'block', background: '#000', maxHeight: '70vh' }}
            />
          ) : (
            <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${project.title} Demo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(135deg,#0d0820,#160a2e)', gap: 16,
                }}>
                  <FiPlay size={28} style={{ color: '#a78bfa' }} />
                  <p style={{ fontSize: 14, color: '#94a3b8' }}>Demo video coming soon</p>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          <div style={{ padding: '12px 20px', display: 'flex', flexWrap: 'wrap', gap: 6, borderTop: '1px solid rgba(108,99,255,0.12)' }}>
            {project.tags.map((tag, i) => (
              <span key={i} style={{
                fontSize: 11, padding: '3px 10px', borderRadius: 99, fontWeight: 600,
                background: 'rgba(108,99,255,0.14)', color: '#a78bfa',
                border: '1px solid rgba(108,99,255,0.22)',
              }}>{tag}</span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ── Main Projects Section ── */
export default function Projects({ darkMode }) {
  const [ref, inView]         = useScrollReveal(0.05)
  const [filter, setFilter]   = useState('All')
  const [showAll, setShowAll] = useState(false)
  const [demoProject, setDemoProject] = useState(null)
  const [lockProject, setLockProject] = useState(null)

  const filtered  = filter === 'All' ? projects : projects.filter(p => p.category === filter)
  const displayed = showAll ? filtered : filtered.slice(0, 4)

  const strong  = darkMode ? '#f1f5f9' : '#0f172a'
  const muted   = darkMode ? '#94a3b8' : '#64748b'
  const cardBg  = darkMode ? '#0b1628' : '#ffffff'
  const cardBdr = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(108,99,255,0.15)'

  return (
    <section id="projects" style={{ padding: '80px 24px' }}>
      {demoProject && <VideoModal project={demoProject} onClose={() => setDemoProject(null)} />}
      {lockProject && <CodeLockModal project={lockProject} onClose={() => setLockProject(null)} />}

      <div style={{ maxWidth: 1100, margin: '0 auto' }} ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }} style={{ marginBottom: 36 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: 'rgba(108,99,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiBriefcase size={20} style={{ color: '#6c63ff' }} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6c63ff', marginBottom: 2 }}>What I've Built</p>
                <h2 style={{ fontSize: 32, fontWeight: 900, color: strong, lineHeight: 1 }}>Projects</h2>
              </div>
            </div>
            <button onClick={() => setShowAll(s => !s)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#6c63ff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
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

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 20 }}>
          <AnimatePresence mode="popLayout">
            {displayed.map((project, i) => (
              <motion.div
                key={project.id} layout
                initial={{ opacity: 0, y: 30, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.10, duration: 0.4 }}
                whileHover={{ y: -8 }}
                className={`glow-card${!darkMode ? ' glow-light' : ''}`}
                style={{
                  borderRadius: 20,
                  /* NO overflow:hidden here — it clips the glow ::before/::after */
                  display: 'flex', flexDirection: 'column',
                  background: cardBg, border: `1px solid ${cardBdr}`,
                  boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(108,99,255,0.08)',
                }}
              >
                {/* Inner wrapper clips the content (image etc) without affecting glow */}
                <div style={{ borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Banner — expands on hover to show more of the screenshot */}
                <motion.div
                  initial={{ height: 96 }}
                  whileHover={project.thumbnail ? { height: 200 } : { height: 96 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    fontSize: 44, flexShrink: 0, overflow: 'hidden',
                    background: darkMode
                      ? 'linear-gradient(135deg,rgba(108,99,255,0.18),rgba(167,139,250,0.10))'
                      : 'linear-gradient(135deg,rgba(108,99,255,0.10),rgba(167,139,250,0.06))',
                  }}
                >
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                      onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }}
                    />
                  ) : null}
                  <div style={{ display: project.thumbnail ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 44 }}>
                    {project.image}
                  </div>
                </motion.div>

                {/* Body */}
                <div style={{ padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: strong, marginBottom: 8, lineHeight: 1.4 }}>{project.title}</h3>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: muted, marginBottom: 12, flex: 1 }}>{project.description}</p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                    {project.tags.map((tag, ti) => (
                      <span key={ti} style={{
                        fontSize: 10, padding: '4px 9px', borderRadius: 99, fontWeight: 600,
                        background: darkMode ? 'rgba(108,99,255,0.18)' : 'rgba(108,99,255,0.09)',
                        color: '#a78bfa', border: `1px solid ${darkMode ? 'rgba(108,99,255,0.3)' : 'rgba(108,99,255,0.2)'}`,
                      }}>{tag}</span>
                    ))}
                  </div>

                  {/* Action row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                      {/* Demo button */}
                      <button
                        onClick={() => setDemoProject(project)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 7,
                          border: 'none', cursor: 'pointer',
                          background: project.demo ? 'linear-gradient(135deg,#6c63ff,#a78bfa)' : 'rgba(108,99,255,0.12)',
                          color: project.demo ? '#fff' : '#a78bfa',
                          outline: project.demo ? 'none' : '1px solid rgba(108,99,255,0.25)',
                          transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                      >
                        <FiPlay size={10} />
                        {project.demo ? 'Demo' : 'Demo Soon'}
                      </button>

                      {/* Code — opens lock modal instead of GitHub */}
                      <button
                        onClick={() => setLockProject(project)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 7,
                          border: '1px solid rgba(108,99,255,0.2)',
                          background: 'rgba(108,99,255,0.06)',
                          color: '#a78bfa', cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(108,99,255,0.2)'; e.currentTarget.style.transform='scale(1.05)' }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(108,99,255,0.06)'; e.currentTarget.style.transform='scale(1)' }}
                      >
                        <FiLock size={10} /> Code
                      </button>
                    </div>
                  </div>
                </div>
                </div>{/* end inner overflow wrapper */}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

