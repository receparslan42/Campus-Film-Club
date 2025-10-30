import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import SearchBox from '../components/SearchBox';
import Filters from '../components/Filters';
import TVList from '../components/TVList';
import Pagination from '../components/Pagination';
import WatchlistPanel from '../components/WatchlistPanel';
import Footer from '../components/Footer';
import { ACTIONS, initialState, reducer } from '../state/reducer';
import { searchShows } from '../api/tvmaze';

export default function Home() {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (base) => {
      let next = { ...base };
      try {
        const q = localStorage.getItem('query');
        if (typeof q === 'string' && q.length > 0) {
          next.query = q;
        }
        const fs = localStorage.getItem('filters');
        if (fs) {
          const parsed = JSON.parse(fs);
          if (parsed && typeof parsed === 'object') {
            const migrate = (val) => (val === 'hepsi' ? 'all' : val);
            next.filters = {
              ...base.filters,
              ...parsed,
              genre: migrate(parsed.genre ?? base.filters.genre),
              language: migrate(parsed.language ?? base.filters.language),
            };
          }
        }
      } catch (e) {
        console.debug('[init] localStorage read skipped', e);
      }
      return next;
    }
  );
  const [page, setPage] = useState(1);
  const [searchBoxResetToken, setSearchBoxResetToken] = useState(0);

  const firstSaveRef = useRef(true);
  useEffect(() => {
    try {
      const raw = localStorage.getItem('watchlist');
      if (raw) dispatch({ type: ACTIONS.SET_WATCHLIST, payload: JSON.parse(raw) });
    } catch (e) {
      console.debug('[watchlist] localStorage read skipped', e);
    }
  }, []);

  useEffect(() => {
    if (firstSaveRef.current) {
      firstSaveRef.current = false;
      return;
    }
    try {
      localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
    } catch (e) {
      console.debug('[watchlist] localStorage write skipped', e);
    }
  }, [state.watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem('query', state.query ?? '');
    } catch (e) {
      console.debug('[query] localStorage write skipped', e);
    }
  }, [state.query]);

  useEffect(() => {
    try {
      localStorage.setItem('filters', JSON.stringify(state.filters));
    } catch (e) {
      console.debug('[filters] localStorage write skipped', e);
    }
  }, [state.filters]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        dispatch({ type: ACTIONS.FETCH_INIT });
        const shows = await searchShows(state.query || '');
        if (!cancelled) {
          dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: shows });
          setPage(1);
        }
      } catch (err) {
        if (!cancelled) dispatch({ type: ACTIONS.FETCH_FAILURE, payload: err.message || 'Error' });
      }
    }
    run();
    return () => { cancelled = true; };
  }, [state.query]);

  const { genres, languages } = useMemo(() => {
    const gset = new Set();
    const lset = new Set();
    state.items.forEach((s) => {
      s.genres?.forEach((g) => gset.add(g));
      if (s.language) lset.add(s.language);
    });
    return { genres: Array.from(gset).sort(), languages: Array.from(lset).sort() };
  }, [state.items]);

  const filtered = useMemo(() => {
    const { genre, language, minRating } = state.filters;
    return state.items.filter((s) => {
      const okGenre = genre === 'all' || s.genres?.includes(genre);
      const okLang = language === 'all' || s.language === language;
      const rating = s?.rating?.average ?? 0;
      const okRating = rating >= (minRating || 0);
      return okGenre && okLang && okRating;
    });
  }, [state.items, state.filters]);

  const pageSize = state.pageSize;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(page, totalPages);
  const slice = filtered.slice((current - 1) * pageSize, current * pageSize);

  function onSearch(q) {
    const next = (q ?? '').trim();
    dispatch({ type: ACTIONS.SET_QUERY, payload: next === '' ? 'star' : next });
  }

  function onFiltersChange(partial) {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: partial });
    setPage(1);
  }

  function onReset() {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: { genre: 'all', language: 'all', minRating: 0 } });
    dispatch({ type: ACTIONS.SET_QUERY, payload: 'star' });
    setSearchBoxResetToken((t) => t + 1);
    setPage(1);
  }

  function addWatch(show) {
    dispatch({ type: ACTIONS.ADD_WATCHLIST, payload: show });
  }

  function removeWatch(id) {
    dispatch({ type: ACTIONS.REMOVE_WATCHLIST, payload: id });
  }

  function clearWatch() {
    dispatch({ type: ACTIONS.CLEAR_WATCHLIST });
  }

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <span role="img" aria-label="logo">🎬</span>
          <a href="/">Campus Film Club</a>
        </div>
        <nav>
          <a href="/">Home</a>
        </nav>
      </header>

      <div className="row">
        <div className="main-content">
          <div className="toolbar-wrapper">
            <div className="toolbar-modern">
              <SearchBox
                initialValue={state.query === 'star' ? '' : state.query}
                resetToken={searchBoxResetToken}
                onSearch={onSearch}
              />
              <Filters options={{ genres, languages }} filters={state.filters} onChange={onFiltersChange} />
            </div>
            <button className="card reset-button" onClick={onReset}>Reset</button>
          </div>

          {state.loading && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="spinner" />
              <div>Loading...</div>
            </div>
          )}
          {!state.loading && state.error && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>Error: {String(state.error)}</div>
              <button className="button" onClick={() => onSearch(state.query)}>Try again</button>
            </div>
          )}

          <TVList shows={slice} onAdd={addWatch} watchlistIds={new Set(state.watchlist.map((x) => x.id))} />
          <Pagination page={current} total={total} pageSize={pageSize} onPageChange={setPage} />
        </div>
        <WatchlistPanel items={state.watchlist} onRemove={removeWatch} onClear={clearWatch} />
      </div>

      <Footer />
    </div>
  );
}