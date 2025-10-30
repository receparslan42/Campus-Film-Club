export default function Filters({ options, filters, onChange }) {
  const { genres = [], languages = [] } = options || {};
  const f = filters || { genre: 'all', language: 'all', minRating: 0 };

  return (
    <>
      <select
        className="select"
        value={f.genre}
        onChange={(e) => onChange?.({ genre: e.target.value })}
      >
        <option value="all">Genre (all)</option>
        {genres.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <select
        className="select"
        value={f.language}
        onChange={(e) => onChange?.({ language: e.target.value })}
      >
        <option value="all">Language (all)</option>
        {languages.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
      <select
        className="select"
        value={String(f.minRating)}
        onChange={(e) => onChange?.({ minRating: Number(e.target.value) })}
      >
        <option value="0">Min. Rating (0+)</option>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => (
          <option key={i} value={i}>Min. Rating ({i}+)</option>
        ))}
      </select>
    </>
  );
}
