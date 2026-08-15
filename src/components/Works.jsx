import { works } from '../data/works.js'

export default function Works({ onSelect }) {
  const handleKeyDown = (event, index, trigger) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(index, trigger)
    }
  }

  return (
    <div className="works" aria-label="Artwork gallery">
      {works.map((item, index) => (
        <figure
          key={item.id}
          className="work-item"
          tabIndex={0}
          role="button"
          aria-label={`Open ${item.title}`}
          onClick={(event) => onSelect(index, event.currentTarget)}
          onKeyDown={(event) => handleKeyDown(event, index, event.currentTarget)}
        >
          <img src={item.src} alt={item.alt} loading="lazy" />
          <figcaption>
            <span>{item.title}</span>
            <span>{item.year}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
