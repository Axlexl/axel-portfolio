import { useState, useEffect, useCallback } from 'react'
import { HashRouter as Router } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import StarField from './components/StarField'
import Navbar from './components/Navbar'
import MobileDrawer from './components/MobileDrawer'
import Hero from './components/Hero'
import AboutMe from './components/AboutMe'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Education from './components/Education'
import Contact from './components/Contact'

function App() {
  const [loading,      setLoading]      = useState(true)
  const [showContent,  setShowContent]  = useState(false)
  const [darkMode,     setDarkMode]     = useState(true)
  const [activeSection,setActiveSection]= useState('home')
  const [drawerOpen,   setDrawerOpen]   = useState(false)
  const [scrolled,     setScrolled]     = useState(false)

  const handleLoadComplete = useCallback(() => {
    setLoading(false)
    setTimeout(() => setShowContent(true), 100)
  }, [])

  /* Body background */
  useEffect(() => {
    document.body.style.backgroundColor = darkMode ? '#020818' : '#f0f0ff'
    document.body.style.color           = darkMode ? '#e2e8f0' : '#0f172a'
  }, [darkMode])

  /* Active section tracker */
  useEffect(() => {
    if (!showContent) return
    const ids = ['home','about','skills','projects','experience','education','contact']
    const obs = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const o = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.25, rootMargin: '-64px 0px -64px 0px' }
      )
      o.observe(el)
      obs.push({ o, el })
    })
    return () => obs.forEach(({ o, el }) => o.unobserve(el))
  }, [showContent])

  /* Navbar scroll shrink */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close drawer on desktop resize */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setDrawerOpen(false) }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <Router>
      {/* ── Loading screen ── */}
      <AnimatePresence>
        {loading && <LoadingScreen onComplete={handleLoadComplete} />}
      </AnimatePresence>

      {/* ── Main site — fades + slides up after loader exits ── */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            style={{
              minHeight: '100vh',
              backgroundColor: darkMode ? '#020818' : '#f0f0ff',
              color: darkMode ? '#e2e8f0' : '#0f172a',
              transition: 'background-color 0.3s, color 0.3s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* ── Star field — delayed so it doesn't lag the transition ── */}
            {darkMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1.2 }}
              >
                <StarField />
              </motion.div>
            )}

            {/* ── Site-wide ambient glows (dark mode only) ── */}
            {darkMode && (
              <>
                <div style={{ position:'fixed', top:'-10%', left:'15%', width:700, height:700, borderRadius:'50%', pointerEvents:'none', zIndex:0,
                  background:'radial-gradient(circle, rgba(14,165,233,0.055) 0%, transparent 65%)', filter:'blur(30px)' }} />
                <div style={{ position:'fixed', top:'30%', right:'5%', width:550, height:550, borderRadius:'50%', pointerEvents:'none', zIndex:0,
                  background:'radial-gradient(circle, rgba(108,99,255,0.07) 0%, transparent 65%)', filter:'blur(30px)' }} />
                <div style={{ position:'fixed', bottom:'10%', left:'10%', width:500, height:500, borderRadius:'50%', pointerEvents:'none', zIndex:0,
                  background:'radial-gradient(circle, rgba(14,165,233,0.045) 0%, transparent 65%)', filter:'blur(30px)' }} />
              </>
            )}
            <div style={{ position: 'relative', zIndex: 50 }}>
              <Navbar
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                activeSection={activeSection}
                scrolled={scrolled}
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
              />

              <MobileDrawer
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                activeSection={activeSection}
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
              />
            </div>

            {drawerOpen && (
              <div
                onClick={() => setDrawerOpen(false)}
                style={{
                  position: 'fixed', inset: 0, zIndex: 40,
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(4px)',
                }}
              />
            )}

            <main style={{ paddingTop: 64, position: 'relative', zIndex: 1 }}>
              <Hero       darkMode={darkMode} />
              <AboutMe    darkMode={darkMode} />
              <Skills     darkMode={darkMode} />
              <Projects   darkMode={darkMode} />
              <Experience darkMode={darkMode} />
              <Education  darkMode={darkMode} />
              <Contact    darkMode={darkMode} />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  )
}

export default App
