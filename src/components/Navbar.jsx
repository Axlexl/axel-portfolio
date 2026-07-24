import { motion, AnimatePresence } from 'framer-motion'
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi'
import { personalInfo } from '../data/portfolioData'

const navLinks = [
  { id: 'home',       label: 'Home' },
  { id: 'about',      label: 'About Me' },
  { id: 'skills',     label: 'Skills' },
  { id: 'projects',   label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education',  label: 'Education' },
  { id: 'contact',    label: 'Contact' },
]

export default function Navbar({ darkMode, setDarkMode, activeSection, scrolled, drawerOpen, setDrawerOpen }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navBg = scrolled
    ? darkMode
      ? 'rgba(2,8,24,0.92)'
      : 'rgba(255,255,255,0.92)'
    : 'transparent'

  const navBorder = scrolled
    ? darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(108,99,255,0.12)'
    : 'transparent'

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        background: navBg,
        borderBottom: `1px solid ${navBorder}`,
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
      }}
    >
      {/* ── Logo ── */}
      <button
        onClick={() => scrollTo('home')}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 900, fontSize: 14,
          boxShadow: '0 4px 14px rgba(108,99,255,0.4)',
          flexShrink: 0,
        }}>
          &lt;/&gt;
        </div>
        <span style={{
          fontWeight: 700, fontSize: 15,
          background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {personalInfo.name}
        </span>
      </button>

      {/* ── Desktop nav links (center) ── */}
      <nav style={{
        display: 'none',
        flex: 1, justifyContent: 'center', gap: 4,
      }}
        className="md:flex"
      >
        {navLinks.map(({ id, label }) => {
          const active = activeSection === id
          return (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                position: 'relative',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '6px 14px', borderRadius: 8,
                fontSize: 13, fontWeight: active ? 600 : 500,
                color: active
                  ? '#a78bfa'
                  : darkMode ? '#94a3b8' : '#64748b',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#6c63ff' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = darkMode ? '#94a3b8' : '#64748b' }}
            >
              {label}
              {/* Active underline */}
              <AnimatePresence>
                {active && (
                  <motion.span
                    layoutId="navUnderline"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      position: 'absolute', bottom: 0, left: 8, right: 8,
                      height: 2, borderRadius: 2,
                      background: 'linear-gradient(90deg,#6c63ff,#a78bfa)',
                    }}
                  />
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </nav>

      {/* ── Right controls ── */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Theme pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 2,
          background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(108,99,255,0.08)',
          borderRadius: 10, padding: 3,
        }}>
          <button
            onClick={() => setDarkMode(false)}
            title="Light mode"
            style={{
              width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: !darkMode ? '#fff' : 'transparent',
              color: !darkMode ? '#f59e0b' : '#64748b',
              boxShadow: !darkMode ? '0 1px 6px rgba(0,0,0,0.12)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            <FiSun size={14} />
          </button>
          <button
            onClick={() => setDarkMode(true)}
            title="Dark mode"
            style={{
              width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: darkMode ? 'rgba(108,99,255,0.35)' : 'transparent',
              color: darkMode ? '#a78bfa' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            <FiMoon size={14} />
          </button>
        </div>

        {/* Get in touch — desktop only */}
        <button
          onClick={() => scrollTo('contact')}
          className="hidden md:flex"
          style={{
            alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
            color: '#fff', fontWeight: 600, fontSize: 13,
            boxShadow: '0 4px 14px rgba(108,99,255,0.35)',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity='1'}
        >
          Get In Touch →
        </button>

        {/* Hamburger — mobile only */}
        <button
          onClick={() => setDrawerOpen(o => !o)}
          className="flex md:hidden"
          style={{
            width: 36, height: 36, borderRadius: 9, border: 'none', cursor: 'pointer',
            alignItems: 'center', justifyContent: 'center',
            background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(108,99,255,0.1)',
            color: darkMode ? '#e2e8f0' : '#1a1a2e',
            transition: 'background 0.2s',
          }}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={{ rotate: drawerOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {drawerOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </motion.div>
        </button>
      </div>
    </motion.header>
  )
}



