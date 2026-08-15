import { useCallback, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import Works from './components/Works.jsx'
import Footer from './components/Footer.jsx'
import Lightbox from './components/Lightbox.jsx'
import { works } from './data/works.js'

export default function App() {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const triggerRef = useRef(null)

  const openLightbox = useCallback((index, trigger) => {
    triggerRef.current = trigger
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const navigateLightbox = useCallback((index) => setLightboxIndex(index), [])

  return (
    <div className="app">
      <div className="grain" aria-hidden="true" />

      <Header />

      <main>
        <div className="main">
          <div className="intro">
            <p className="kicker">Visual artist · GMT+8</p>
            <h1 className="intro-title">
              anaqin5<span className="accent">.</span>
            </h1>
            <p className="tagline">Making marks that stay with you.</p>
            <a
              className="intro-cta"
              href="https://x.com/anaqin5"
              target="_blank"
              rel="noopener noreferrer"
            >
              @anaqin5 <span aria-hidden="true">↗</span>
            </a>
          </div>
          <Works onSelect={openLightbox} />
        </div>
      </main>

      <Footer />

      <Lightbox
        works={works}
        index={lightboxIndex}
        triggerRef={triggerRef}
        onClose={closeLightbox}
        onNavigate={navigateLightbox}
      />
    </div>
  )
}
