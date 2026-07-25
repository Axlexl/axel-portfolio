import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiUser, FiCode, FiBriefcase, FiBook, FiMail,
  FiSun, FiMoon, FiDownload, FiX,
} from 'react-icons/fi'
import { MdWorkOutline } from 'react-icons/md'
import { FaGithub, FaFacebook, FaInstagram } from 'react-icons/fa'
import { personalInfo } from '../data/portfolioData'

const navLinks = [
  { id: 'home',       label: 'Home',       icon: FiHome },
  { id: 'about',      label: 'About Me',   icon: FiUser },
  { id: 'skills',     label: 'Skills',     icon: FiCode },
  { id: 'projects',   label: 'Projects',   icon: FiBriefcase },
  { id: 'experience', label: 'Experience', icon: MdWorkOutline },
  { id: 'education',  label: 'Education',  icon: FiBook },
  { id: 'contact',    label: 'Contact',    icon: FiMail },
]

export default function MobileDrawer({ darkMode, setDarkMode, activeSection, drawerOpen, setDrawerOpen }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setDrawerOpen(false)
  }

  const bg     = darkMode ? '#060f24' : '#ffffff'
  const border = darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(108,99,255,0.12)'
  const muted  = darkMode ? '#94a3b8' : '#64748b'

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.aside
          key="drawer"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0,      opacity: 1 }}
          exit={{   x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          style={{
            position: 'fixed', top: 0, right: 0,
            width: 280, height: '100dvh',
            zIndex: 50,
            background: bg,
            borderLeft: `1px solid ${border}`,
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 900, fontSize: 12,
              }}>
                &lt;/&gt;
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa' }}>Axel Socobos</p>
                <p style={{ fontSize: 10, color: muted }}>3rd Year IT Student</p>
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              style={{
                width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
                background: darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                color: muted, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Scrollable body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>
            {/* Nav */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
              {navLinks.map(({ id, label, icon: Icon }, i) => {
                const active = activeSection === id
                return (
                  <motion.button
                    key={id}
                    onClick={() => scrollTo(id)}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.09 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: active
                        ? 'linear-gradient(135deg,#6c63ff,#a78bfa)'
                        : darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(108,99,255,0.05)',
                      color: active ? '#fff' : muted,
                      fontWeight: active ? 600 : 500, fontSize: 14,
                      boxShadow: active ? '0 4px 16px rgba(108,99,255,0.3)' : 'none',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: active ? 'rgba(255,255,255,0.18)' : darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(108,99,255,0.08)',
                    }}>
                      <Icon size={15} />
                    </span>
                    {label}
                  </motion.button>
                )
              })}
            </nav>

            {/* Divider */}
            <div style={{ height: 1, background: border, marginBottom: 20 }} />

            {/* Theme toggle */}
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: muted, marginBottom: 10 }}>
              Appearance
            </p>
            <div style={{
              display: 'flex', gap: 4, padding: 4, borderRadius: 12, marginBottom: 20,
              background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(108,99,255,0.07)',
            }}>
              {[
                { label: 'Light', icon: FiSun,  val: false, activeColor: '#f59e0b' },
                { label: 'Dark',  icon: FiMoon, val: true,  activeColor: '#a78bfa' },
              ].map(({ label, icon: Icon, val, activeColor }) => (
                <button
                  key={label}
                  onClick={() => setDarkMode(val)}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                    background: darkMode === val ? (val ? 'rgba(108,99,255,0.3)' : '#fff') : 'transparent',
                    color: darkMode === val ? activeColor : muted,
                    boxShadow: darkMode === val && !val ? '0 1px 8px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* Social */}
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: muted, marginBottom: 10 }}>
              Connect
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {[
                { icon: FaGithub,    href: personalInfo.github,    label: 'GitHub',    hoverBg: 'linear-gradient(135deg,#6c63ff,#a78bfa)' },
                { icon: FaFacebook,  href: personalInfo.facebook,  label: 'Facebook',  hoverBg: 'linear-gradient(135deg,#1877f2,#42a5f5)' },
                { icon: FaInstagram, href: personalInfo.instagram, label: 'Instagram', hoverBg: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' },
                { icon: FiMail,      href: `mailto:${personalInfo.email}`, label: 'Email', hoverBg: 'linear-gradient(135deg,#6c63ff,#a78bfa)' },
              ].map(({ icon: Icon, href, label, hoverBg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  title={label}
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '10px 0', borderRadius: 10, textDecoration: 'none',
                    background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(108,99,255,0.07)',
                    color: muted, fontSize: 10, fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = hoverBg
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(108,99,255,0.07)'
                    e.currentTarget.style.color = muted
                  }}
                >
                  <Icon size={17} />
                  {label}
                </a>
              ))}
            </div>

            {/* Download CV */}
            <a
              href="/cv.pdf"
              download
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '13px 0', borderRadius: 12, textDecoration: 'none',
                background: 'linear-gradient(135deg,#6c63ff,#a78bfa)',
                color: '#fff', fontWeight: 600, fontSize: 14,
                boxShadow: '0 4px 20px rgba(108,99,255,0.35)',
              }}
            >
              <FiDownload size={15} /> Download CV
            </a>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}




