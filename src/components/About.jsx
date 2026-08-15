import { useEffect, useRef } from 'react'

const faqs = [
  {
    q: 'Who are you?',
    a: "I'm anaqin5 — also Anaqintama. A digital illustrator who draws cute anime girls, based in GMT+8.",
  },
  {
    q: 'What do you draw?',
    a: 'My Kamioshi: Kano, VTubers, Game Characters, Anime Characters and just any cute girl',
  },
  {
    q: 'What software and gear do you use?',
    a: 'Clip Studio Paint, on a UGEE UE16 drawing tablet.',
  },
  {
    q: 'Do you take requests/commissions?',
    a: 'Yes — DM me on X.',
  },
  {
    q: 'Where can I see more of your work?',
    a: 'X, Instagram and Pixiv — links are in the name card.',
  },
]

export default function About({ open, onClose }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="about-overlay" onClick={onClose}>
      <div
        className="about-panel"
        role="dialog"
        aria-modal="true"
        aria-label="About me"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="about-head">
          <h2>About me</h2>
          <button
            ref={closeRef}
            type="button"
            className="about-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <dl className="about-faqs">
          {faqs.map((item) => (
            <div className="about-faq" key={item.q}>
              <dt>{item.q}</dt>
              <dd>{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
