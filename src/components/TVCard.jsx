import placeholder from '../assets/placeholder.svg';

function stripHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export default function TVCard({ show, onAdd, inWatchlist }) {
  const img = show?.image?.medium || show?.image?.original || placeholder;
  const rating = show?.rating?.average ?? '–';

  return (
    <div className="card movie-card">
      <img src={img} alt={show.name} className="poster" />
      <h3>{show.name}</h3>
      <div className="badges">
        {show.genres?.slice(0, 3).map((g) => (
          <span key={g} className="badge">{g}</span>
        ))}
        <span className="badge badge-language">
          <span style={{ marginRight: 4 }}>🌐</span>
          {show.language || 'N/A'}
        </span>
        <span className="badge badge-rating">
          <span style={{ marginRight: 4 }}>⭐</span>
          {rating}
        </span>
      </div>
      <p className="muted line-clamp-3 card-summary">{stripHtml(show.summary)}</p>
      <div className="card-actions">
        <button className="button btn-secondary" onClick={() => window.location.href = `/show/${show.id}`}>
          Details
        </button>
        <button className="button primary" disabled={inWatchlist} onClick={() => onAdd?.(show)}>
          {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
        </button>
      </div>
    </div>
  );
}