import TVCard from './TVCard';

export default function TVList({ shows, onAdd, watchlistIds }) {
  if (!shows || shows.length === 0) {
    return (
      <div className="card">
        <p className="muted">No results found.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {shows.map((s) => (
        <TVCard
          key={s.id}
          show={s}
          onAdd={onAdd}
          inWatchlist={watchlistIds.has(s.id)}
        />)
      )}
    </div>
  );
}