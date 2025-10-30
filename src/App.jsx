import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ShowDetail from './pages/ShowDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show/:id" element={<ShowDetail />} />
      </Routes>
    </BrowserRouter>
  );
}