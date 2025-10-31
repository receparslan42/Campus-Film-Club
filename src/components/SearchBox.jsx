import { useEffect, useState } from 'react';

// SearchBox triggers `onSearch` automatically on every keystroke.
// A small debounce is used (default 300ms) to avoid rapid-fire calls.
export default function SearchBox({ initialValue, defaultValue, resetToken, onSearch, debounceMs = 300 }) {
  const init = (typeof initialValue === 'string' ? initialValue : (defaultValue || '')) || '';
  const [value, setValue] = useState(init);

  useEffect(() => {
    if (resetToken) {
      setValue('');
    }
  }, [resetToken]);

  useEffect(() => {
    const trimmed = value.trim();
    const id = setTimeout(() => {
      onSearch?.(trimmed);
    }, debounceMs);

    return () => clearTimeout(id);
  }, [value, debounceMs, onSearch]);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch?.(value.trim() || '');
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
      <input
        className="input"
        placeholder="Search shows... (e.g., star, batman)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}