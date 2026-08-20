import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const STEP_DEG = 34
const RENDER_WINDOW = 2
const RADIUS_MIN = 320
const RADIUS_MAX = 560
const DRAG_THRESHOLD = 60

const MOBILE_QUERY = '(max-width: 820px)'

function isMobile() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
}

function getViewportHeight() {
  if (typeof window === 'undefined') return 0
  return window.visualViewport?.height || window.innerHeight || 0
}

function getRadius(stageH = 0, viewportH = 0) {
  if (isMobile()) {
    const fromViewport = (viewportH > 0 ? viewportH : getViewportHeight()) * 0.22
    return Math.min(240, Math.max(120, fromViewport))
  }
  const fromViewport = (viewportH > 0 ? viewportH : getViewportHeight()) * 0.5
  return Math.min(RADIUS_MAX, Math.max(RADIUS_MIN, fromViewport))
}

function slideTransform(offset, dragOffset, radius) {
  const angle = offset * STEP_DEG
  const rad = (angle * Math.PI) / 180
  const x = Math.sin(rad) * radius + dragOffset
  const y = radius * (1 - Math.cos(rad))
  const tilt = 0.6 * angle
  const scale = 1 - 0.24 * Math.abs(offset)
  return `translate(-50%, -50%) translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`
}

function getMaxSide(stageW, stageH, viewportH) {
  if (isMobile()) {
    return Math.min(stageW * 0.92, 560, viewportH * 0.55)
  }
  return Math.min(stageW * 0.76, stageH * 0.86, 760, viewportH * 0.66)
}

function slideSize(ratio, maxSide) {
  if (ratio >= 1) return { width: maxSide, height: maxSide / ratio }
  return { width: maxSide * ratio, height: maxSide }
}

export default function ArtworkViewer({ works = [], mode = 'disc', onModeChange }) {
  const total = works.length
  const [activeIndex, setActiveIndex] = useState(0)
  const [radius, setRadius] = useState(getRadius)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [ratios, setRatios] = useState({})
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 })
  const [viewportH, setViewportH] = useState(() => getViewportHeight())
  const dragRef = useRef(null)
  const stageRef = useRef(null)

  const go = useCallback(
    (offset) => {
      if (total < 2) return
      setActiveIndex((current) => (current + offset + total) % total)
    },
    [total],
  )

  useLayoutEffect(() => {
    const measure = () => {
      const el = stageRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = getViewportHeight()
      setStageSize((prev) =>
        prev.w === rect.width && prev.h === rect.height ? prev : { w: rect.width, h: rect.height },
      )
      setViewportH((prev) => (prev === vh ? prev : vh))
    }
    measure()
    const onResize = () => measure()
    const vv = window.visualViewport
    window.addEventListener('resize', onResize)
    vv?.addEventListener('resize', onResize)
    vv?.addEventListener('scroll', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      vv?.removeEventListener('resize', onResize)
      vv?.removeEventListener('scroll', onResize)
    }
  }, [])

  useEffect(() => {
    setRadius(getRadius(stageSize.h, viewportH))
  }, [stageSize.h, viewportH])

  useEffect(() => {
    if (mode !== 'disc' || total < 2) return
    const handleKey = (event) => {
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [go, total, mode])

  const handlePointerDown = (event) => {
    if (total < 2) return
    const slide = event.target.closest('[data-offset]')
    if (!slide) return
    dragRef.current = {
      startX: event.clientX,
      targetOffset: Number(slide.dataset.offset),
      moved: false,
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setDragging(true)
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag) return
    const delta = event.clientX - drag.startX
    if (Math.abs(delta) > 6) drag.moved = true
    setDragOffset(delta)
  }

  const handlePointerEnd = (event) => {
    const drag = dragRef.current
    if (!drag) return
    const delta = event.clientX - drag.startX
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      go(delta < 0 ? 1 : -1)
    } else if (drag.targetOffset !== 0 && !drag.moved) {
      go(drag.targetOffset)
    }
    dragRef.current = null
    setDragging(false)
    setDragOffset(0)
  }

  const handleImageLoad = useCallback((id) => (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget
    if (!naturalWidth || !naturalHeight) return
    const ratio = naturalWidth / naturalHeight
    setRatios((prev) => (prev[id] === ratio ? prev : { ...prev, [id]: ratio }))
  }, [])

  const selectWork = useCallback(
    (index) => {
      setActiveIndex(index)
      onModeChange?.('disc')
    },
    [onModeChange],
  )

  if (total === 0) {
    return (
      <div className="viewer">
        <div className="viewer-empty">No artworks yet.</div>
      </div>
    )
  }

  if (mode === 'grid') {
    return (
      <div className="viewer viewer--grid">
        <div className="viewer-grid-head">
          <span>All works</span>
          <span>
            {total} pieces · click to focus
          </span>
        </div>
        <ul className="viewer-grid">
          {works.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                className="grid-item"
                onClick={() => selectWork(index)}
              >
                <img src={item.src} alt={item.alt} loading="lazy" decoding="async" />
                <span className="grid-item-caption">
                  <span>{item.title}</span>
                  <span>{item.year}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  const active = works[activeIndex]

  const seen = new Map()
  for (let d = -RENDER_WINDOW; d <= RENDER_WINDOW; d += 1) {
    const index = (activeIndex + d + total) % total
    const current = seen.get(index)
    if (current === undefined || Math.abs(d) < Math.abs(current)) {
      seen.set(index, d)
    }
  }

  const slides = []
  const maxSide = stageSize.w ? getMaxSide(stageSize.w, stageSize.h, viewportH) : 0
  for (const [index, offset] of seen) {
    const item = works[index]
    const ratio = ratios[item.id] ?? 1
    const size = slideSize(ratio, maxSide)
    slides.push(
      <div
        key={item.id}
        className={`viewer-slide${offset === 0 ? ' viewer-slide--active' : ''}`}
        data-offset={offset}
        style={{
          width: size.width,
          height: size.height,
          transform: slideTransform(offset, dragOffset, radius),
          opacity: 1 - 0.35 * Math.abs(offset),
          zIndex: 20 - Math.abs(offset),
        }}
        aria-hidden={offset !== 0}
      >
        <img
          src={item.src}
          alt={item.alt}
          loading={offset === 0 ? 'eager' : 'lazy'}
          fetchPriority={offset === 0 ? 'high' : 'auto'}
          decoding="async"
          onLoad={handleImageLoad(item.id)}
        />
      </div>,
    )
  }

  return (
    <div className="viewer">
      <div
        ref={stageRef}
        className={`viewer-stage${dragging ? ' is-dragging' : ''}`}
        role="group"
        aria-roledescription="carousel"
        aria-label="Artwork carousel"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {slides}
        {total > 1 && (
          <>
            <button
              type="button"
              className="viewer-btn viewer-prev"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => go(-1)}
              aria-label="Previous artwork"
            >
              ←
            </button>
            <button
              type="button"
              className="viewer-btn viewer-next"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => go(1)}
              aria-label="Next artwork"
            >
              →
            </button>
          </>
        )}
      </div>

      <div className="viewer-caption">
        <div className="viewer-caption-main">
          <span className="viewer-title">{active.title}</span>
          <span className="viewer-meta">
            {active.medium} · {active.year}
          </span>
        </div>
        <span className="viewer-count" aria-live="polite">
          {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="viewer-progress" aria-hidden="true">
        <div
          className="viewer-progress-fill"
          style={{ width: `${((activeIndex + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
