import { useEffect, useRef } from 'react'

export default function Lightbox({ works, index, triggerRef, onClose, onNavigate }) {
  const closeRef = useRef(null)
  const open = index !== null

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
      document.body.classList.add('no-scroll')
      return () => {
        document.body.classList.remove('no-scroll')
        triggerRef.current?.focus()
      }
    }
  }, [open, triggerRef])

  useEffect(() => {
    if (!open) return
    const handleKey = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') onNavigate((index + 1) % works.length)
      if (event.key === 'ArrowLeft') onNavigate((index - 1 + works.length) % works.length)
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, index, works.length, onClose, onNavigate, triggerRef])

  if (!open) return null

  const item = works[index]

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
      <div className="lightbox-stage" onClick={(event) => event.stopPropagation()}>
        <img src={item.src} alt={item.alt} />
        <div className="lightbox-caption">
          <span className="lightbox-title">{item.title}</span>
          <span className="lightbox-meta">
            {item.medium} · {item.year} · {String(index + 1).padStart(2, '0')} /{' '}
            {String(works.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      <button
        ref={closeRef}
        type="button"
        className="lightbox-btn lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>
      <button
        type="button"
        className="lightbox-btn lightbox-prev"
        onClick={() => onNavigate((index - 1 + works.length) % works.length)}
        aria-label="Previous artwork"
      >
        ←
      </button>
      <button
        type="button"
        className="lightbox-btn lightbox-next"
        onClick={() => onNavigate((index + 1) % works.length)}
        aria-label="Next artwork"
      >
        →
      </button>
    </div>
  )
}
