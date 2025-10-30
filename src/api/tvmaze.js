import axios from 'axios';

const api = axios.create({ baseURL: 'https://api.tvmaze.com' });

export async function searchShows(query) {
  const { data } = await api.get(`/search/shows`, { params: { q: query } });
  return data.map((x) => x.show);
}

export async function getShow(id) {
  const { data } = await api.get(`/shows/${id}`);
  return data;
}

export async function getEpisodes(id) {
  const { data } = await api.get(`/shows/${id}/episodes`);
  return data;
}

export default api;