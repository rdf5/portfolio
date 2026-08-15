import { useState } from 'react'
import Header from './components/Header.jsx'
import ArtworkViewer from './components/ArtworkViewer.jsx'
import Footer from './components/Footer.jsx'
import About from './components/About.jsx'
import { works } from './data/works.js'

export default function App() {
  const [viewMode, setViewMode] = useState('disc')
  const [aboutOpen, setAboutOpen] = useState(false)

  return (
    <div className={`app${viewMode === 'grid' ? ' app--grid' : ''}`}>
      <div className="grain" aria-hidden="true" />

      <Header viewMode={viewMode} onViewModeChange={setViewMode} />

      <main>
        <div className="main">
          <div className="intro">
            <p className="kicker">Illustrator · GMT+8</p>
            <h1 className="intro-title">
              Anaqintama<span className="accent">.</span>
            </h1>
            <a
              className="intro-handle"
              href="https://x.com/anaqin5"
              target="_blank"
              rel="noopener noreferrer"
            >
              @anaqin5
            </a>
            <p className="intro-alias">RDF</p>
            <p className="tagline">I draw cute anime girls.</p>
            <div className="intro-links">
              <a
                className="intro-link"
                href="https://x.com/anaqin5"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="anaqin5 on X"
              >
                X <span aria-hidden="true">↗</span>
              </a>
              <a
                className="intro-link"
                href="https://www.instagram.com/anaqin5/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="anaqin5 on Instagram"
              >
                Instagram <span aria-hidden="true">↗</span>
              </a>
              <a
                className="intro-link"
                href="https://www.pixiv.net/en/users/71069326"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="anaqin5 on Pixiv"
              >
                Pixiv <span aria-hidden="true">↗</span>
              </a>
            </div>
            <button
              type="button"
              className="intro-about"
              onClick={() => setAboutOpen(true)}
            >
              About me <span aria-hidden="true">→</span>
            </button>
          </div>
          <ArtworkViewer works={works} mode={viewMode} onModeChange={setViewMode} />
        </div>
      </main>

      <Footer />

      <About open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}
