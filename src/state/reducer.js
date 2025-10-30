export const ACTIONS = {
  FETCH_INIT: 'FETCH_INIT',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
  SET_QUERY: 'SET_QUERY',
  SET_FILTERS: 'SET_FILTERS',
  SET_WATCHLIST: 'SET_WATCHLIST',
  SET_PAGE_SIZE: 'SET_PAGE_SIZE',
  ADD_WATCHLIST: 'ADD_WATCHLIST',
  REMOVE_WATCHLIST: 'REMOVE_WATCHLIST',
  CLEAR_WATCHLIST: 'CLEAR_WATCHLIST',
};

export const initialState = {
  loading: false,
  error: null,
  items: [],
  query: 'star',
  filters: { genre: 'all', language: 'all', minRating: 0 },
  watchlist: [],
  pageSize: 6,
};

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_INIT:
      return { ...state, loading: true, error: null };
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, items: action.payload, error: null };
    case ACTIONS.FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ACTIONS.SET_QUERY:
      return { ...state, query: action.payload };
    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case ACTIONS.SET_WATCHLIST:
      return { ...state, watchlist: action.payload || [] };
    case ACTIONS.ADD_WATCHLIST: {
      const exists = state.watchlist.some((s) => s.id === action.payload.id);
      if (exists) return state;
      return { ...state, watchlist: [...state.watchlist, action.payload] };
    }
    case ACTIONS.REMOVE_WATCHLIST:
      return {
        ...state,
        watchlist: state.watchlist.filter((s) => s.id !== action.payload),
      };
    case ACTIONS.CLEAR_WATCHLIST:
      return { ...state, watchlist: [] };
    case ACTIONS.SET_PAGE_SIZE:
      return { ...state, pageSize: action.payload };
    default:
      return state;
  }
}