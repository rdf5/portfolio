export default function Header({ viewMode = 'disc', onViewModeChange }) {
  return (
    <header className="site-header">
      <span className="brand">
        <img
          className="brand-avatar"
          src="https://pbs.twimg.com/profile_images/2084517033958653952/WgeP2klr_400x400.jpg"
          alt=""
          width={28}
          height={28}
          decoding="async"
        />
        <span>anaqin5<span className="brand-dot">.</span></span>
        <span className="header-note">· half ass portfolio</span>
      </span>
      <div className="header-actions">
        <div className="view-toggle" role="group" aria-label="View mode">
          <button
            type="button"
            className={viewMode === 'disc' ? 'is-active' : ''}
            aria-pressed={viewMode === 'disc'}
            onClick={() => onViewModeChange('disc')}
          >
            Disc
          </button>
          <button
            type="button"
            className={viewMode === 'grid' ? 'is-active' : ''}
            aria-pressed={viewMode === 'grid'}
            onClick={() => onViewModeChange('grid')}
          >
            Grid
          </button>
        </div>
        <a
          className="header-x"
          href="https://x.com/anaqin5"
          target="_blank"
          rel="noopener noreferrer"
        >
          @anaqin5
        </a>
      </div>
    </header>
  )
}
