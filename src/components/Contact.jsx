import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { FiMail, FiPhone, FiSend, FiCheck, FiArrowRight } from 'react-icons/fi'
import { personalInfo } from '../data/portfolioData'

const talkCards = [
  {
    icon: '📧',
    label: 'Email',
    value: personalInfo.email,
    action: 'Email me',
    href: `mailto:${personalInfo.email}`,
    color: '#6c63ff',
  },
  {
    icon: '📞',
    label: 'Phone Number',
    value: personalInfo.phone,
    action: 'Call me',
    href: `tel:${personalInfo.phone}`,
    color: '#0ea5e9',
  },
  {
    icon: '💬',
    label: 'Messenger',
    value: 'Message me on Messenger',
    action: 'Message me',
    href: personalInfo.messenger,
    color: '#0084ff',
  },
]

export default function Contact({ darkMode }) {
  const [ref, inView] = useScrollReveal(0.08)
  const [form, setForm]       = useState({ name: '', mail: '', project: '' })
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const strong  = darkMode ? '#f1f5f9' : '#0f172a'
  const muted   = darkMode ? '#94a3b8' : '#64748b'
  const cardBg  = darkMode ? 'rgba(255,255,255,0.06)' : '#ffffff'
  const cardBdr = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(108,99,255,0.13)'

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 10,
    border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
    background: darkMode ? 'rgba(255,255,255,0.06)' : '#fafafa',
    color: darkMode ? '#e2e8f0' : '#0f172a',
    fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s', fontFamily: 'inherit',
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Build a mailto link that pre-fills the email to yourself
    const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const body    = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.mail}\n\nProject / Message:\n${form.project}`
    )
    const mailtoLink = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`

    // Open the user's mail client
    window.location.href = mailtoLink

    // Small delay then show success state
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      setForm({ name: '', mail: '', project: '' })
      setTimeout(() => setSent(false), 5000)
    }, 800)
  }

  return (
    <section id="contact" style={{ padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }} ref={ref}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 52 }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.15em', color: '#6c63ff', marginBottom: 8 }}>
            Get In Touch
          </p>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: strong, lineHeight: 1, marginBottom: 10 }}>
            Contact Me
          </h2>
          <p style={{ fontSize: 14, color: muted }}>
            I'm open to collaborations, freelance work, and opportunities.
          </p>
        </motion.div>

        {/* ── Two columns ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 40, alignItems: 'start',
        }}>

          {/* LEFT — Talk to me cards */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{ fontSize: 15, fontWeight: 700, color: strong, marginBottom: 20, textAlign: 'center' }}
            >
              Talk to me
            </motion.p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {talkCards.map(({ icon, label, value, action, href, color }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.45 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`glow-card${!darkMode ? ' glow-light' : ''}`}
                  style={{
                    display: 'block', padding: '22px 24px', borderRadius: 16,
                    background: cardBg,
                    border: `1px solid ${cardBdr}`,
                    textDecoration: 'none', textAlign: 'center',
                    boxShadow: darkMode
                      ? '0 4px 20px rgba(0,0,0,0.35)'
                      : '0 4px 20px rgba(108,99,255,0.08)',
                  }}
                >
                  <div style={{ fontSize: 32, lineHeight: 1, marginBottom: 10 }}>{icon}</div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: strong, marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 12, color: muted, marginBottom: 10 }}>{value}</p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 12, fontWeight: 700, color }}>
                    {action} <FiArrowRight size={12} />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* RIGHT — Write me your project */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{ fontSize: 15, fontWeight: 700, color: strong, marginBottom: 20, textAlign: 'center' }}
            >
              Write me your project
            </motion.p>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                display: 'flex', flexDirection: 'column', gap: 20,
                padding: 28, borderRadius: 20,
                background: cardBg, border: `1px solid ${cardBdr}`,
                boxShadow: darkMode
                  ? '0 4px 32px rgba(0,0,0,0.25)'
                  : '0 4px 32px rgba(108,99,255,0.08)',
              }}
            >
              {/* Name */}
              <div style={{ position: 'relative' }}>
                <label style={{
                  position: 'absolute', top: -9, left: 12,
                  fontSize: 11, fontWeight: 600, color: muted,
                  background: darkMode ? '#020818' : '#fafafa',
                  padding: '0 4px', pointerEvents: 'none',
                }}>
                  Name
                </label>
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleChange} placeholder="Insert your name" required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6c63ff'}
                  onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}
                />
              </div>

              {/* Mail */}
              <div style={{ position: 'relative' }}>
                <label style={{
                  position: 'absolute', top: -9, left: 12,
                  fontSize: 11, fontWeight: 600, color: muted,
                  background: darkMode ? '#020818' : '#fafafa',
                  padding: '0 4px', pointerEvents: 'none',
                }}>
                  Your Email
                </label>
                <input
                  type="email" name="mail" value={form.mail}
                  onChange={handleChange} placeholder="Insert your email" required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#6c63ff'}
                  onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}
                />
              </div>

              {/* Project */}
              <div style={{ position: 'relative' }}>
                <label style={{
                  position: 'absolute', top: -9, left: 12,
                  fontSize: 11, fontWeight: 600, color: muted,
                  background: darkMode ? '#020818' : '#fafafa',
                  padding: '0 4px', pointerEvents: 'none',
                }}>
                  Project / Message
                </label>
                <textarea
                  name="project" value={form.project}
                  onChange={handleChange} placeholder="Write your project or message" required rows={5}
                  style={{ ...inputStyle, resize: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#6c63ff'}
                  onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}
                />
              </div>

              {/* Info note */}
              <p style={{ fontSize: 11, color: muted, marginTop: -8 }}>
                Clicking "Send Message" will open your email client with the message pre-filled,
                addressed to <strong style={{ color: '#6c63ff' }}>{personalInfo.email}</strong>
              </p>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading || sent}
                whileHover={!loading && !sent ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loading && !sent ? { scale: 0.98 } : {}}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '14px 28px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: sent
                    ? '#0ea5e9'
                    : 'linear-gradient(135deg,#6c63ff,#a78bfa)',
                  color: '#fff', fontWeight: 700, fontSize: 14,
                  boxShadow: sent
                    ? '0 4px 20px rgba(16,185,129,0.35)'
                    : '0 4px 20px rgba(108,99,255,0.4)',
                  opacity: loading ? 0.75 : 1,
                  transition: 'background 0.3s, opacity 0.2s',
                  alignSelf: 'flex-start',
                }}
              >
                {loading ? (
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                ) : sent ? (
                  <><FiCheck size={16} /> Email client opened!</>
                ) : (
                  <><FiSend size={16} /> Send Message</>
                )}
              </motion.button>
            </motion.form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder {
          color: ${darkMode ? '#475569' : '#94a3b8'};
        }
      `}</style>
    </section>
  )
}





