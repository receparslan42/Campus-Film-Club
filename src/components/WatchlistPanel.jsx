import placeholder from '../assets/placeholder.svg';

export default function WatchlistPanel({ items, onRemove, onClear }) {
  return (
    <aside className="card shortlist">
      <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 700 }}>
        Watchlist ({items.length})
      </h3>
      {items.length === 0 ? (
        <>
          <p className="muted" style={{ marginBottom: 12, fontSize: '14px' }}>No items in the list.</p>
          <button className="button btn-clear-list" onClick={() => onClear?.()} disabled={true}>
            Clear List
          </button>
        </>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px 0', display: 'grid', gap: 8 }}>
            {items.map((s) => (
              <li key={s.id} className="card" style={{ padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={s?.image?.medium || s?.image?.original || placeholder} alt="poster" style={{ width: 48, height: 64, objectFit: 'cover', borderRadius: 6 }} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div className="muted" style={{ fontSize: 12 }}>{s.language} • ⭐ {s?.rating?.average ?? '–'}</div>
                  </div>
                </div>
                <button className="button danger" onClick={() => onRemove?.(s.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <button className="button btn-clear-list" onClick={() => onClear?.()} disabled={items.length === 0}>
            Clear List
          </button>
        </>
      )}
    </aside>
  );
}