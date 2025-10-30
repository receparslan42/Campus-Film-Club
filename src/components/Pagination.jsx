export default function Pagination({ page, total, pageSize, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  function go(p) {
    const clamped = Math.min(Math.max(1, p), totalPages);
    if (clamped !== page) onPageChange(clamped);
  }

  const numbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination" role="navigation" aria-label="Pagination">
      <button
        className="card nav-card"
        onClick={() => go(page - 1)}
        disabled={!canPrev}
        aria-label="Previous page"
      >
        Previous
      </button>

      <div className="numbers">
        {numbers.map((n) => (
          <button
            key={n}
            className={"pill" + (n === page ? " active" : "")}
            aria-current={n === page ? "page" : undefined}
            onClick={() => go(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        className="card nav-card"
        onClick={() => go(page + 1)}
        disabled={!canNext}
        aria-label="Next page"
      >
        Next
      </button>
    </div>
  );
}