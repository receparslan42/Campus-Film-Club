import { useEffect, useState } from 'react';

export default function SearchBox({ initialValue, defaultValue, resetToken, onSearch }) {
  const init = (typeof initialValue === 'string' ? initialValue : (defaultValue || '')) || '';
  const [value, setValue] = useState(init);

  useEffect(() => {
    if (resetToken) {
      setValue('');
    }
  }, [resetToken]);

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