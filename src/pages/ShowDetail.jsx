import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEpisodes, getShow } from '../api/tvmaze';
import placeholder from '../assets/placeholder.svg';

function stripHtml(html) {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export default function ShowDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: null, show: null, episodes: [] });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [show, episodes] = await Promise.all([getShow(id), getEpisodes(id)]);
        if (mounted) setState({ loading: false, error: null, show, episodes });
      } catch (err) {
        if (mounted) setState((s) => ({ ...s, loading: false, error: err.message || 'Error' }));
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (state.loading) return <div className="container"><div className="card"><div className="spinner" /> Loading...</div></div>;
  if (state.error) return <div className="container"><div className="card">Error: {String(state.error)}</div></div>;
  if (!state.show) return null;

  const s = state.show;
  const img = s?.image?.original || s?.image?.medium || placeholder;

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <span role="img" aria-label="logo">🎬</span>
          <Link to="/">Campus Film Club</Link>
        </div>
        <nav>
          <Link to="/">Home</Link>
        </nav>
      </header>
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); window.history.back(); }}
        style={{ color: 'var(--text)', textDecoration: 'none', fontWeight: 500 }}
      >
        <div className="card" style={{ textAlign: 'center', padding: '16px', marginBottom: '16px' }}>

          ← Back
        </div>
      </a>

      <div className="card detail-card">
        <img src={img} alt={s.name} className="poster detail-poster" />
        <div className="detail-content">
          <h1 className="detail-title">{s.name}</h1>
          <div className="badges">
            {s.genres?.map((g) => <span key={g} className="badge">{g}</span>)}
            <span className="badge badge-language">
              <span style={{ marginRight: 4 }}>🌐</span>
              {s.language || 'N/A'}
            </span>
            <span className="badge badge-rating">
              <span style={{ marginRight: 4 }}>⭐</span>
              {s?.rating?.average ?? '–'}
            </span>
            {s.status && <span className="badge">{s.status}</span>}
            {s.premiered && (
              <span className="badge badge-date">
                <span style={{ marginRight: 4 }}>📅</span>
                {s.premiered}
              </span>
            )}
          </div>
          <p className="detail-summary">{stripHtml(s.summary)}</p>
        </div>
      </div>

      <div className="card episodes-section">
        <h3 className="episodes-title">Episodes</h3>
        {state.episodes.length === 0 ? (
          <p className="muted">No episode information found.</p>
        ) : (
          <ul className="episodes-list">
            {state.episodes.map((e, idx) => (
              <li key={e.id} className="card episode-card">
                <div className="episode-info">
                  <span className="badge episode-badge">S{e.season}</span>
                  <span className="episode-number">· {e.name}</span>
                </div>
                <div className="episode-meta">
                  <span className="episode-index"># {idx + 1}</span>
                  {e.airdate && <span className="episode-date">{e.airdate}</span>}
                  {typeof e.runtime === 'number' && <span className="episode-runtime">{e.runtime} min</span>}
                </div>
                {e.url && (
                  <a
                    className="button episode-button"
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}