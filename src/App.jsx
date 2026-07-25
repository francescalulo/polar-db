import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Watchlist from './pages/Watchlist/Watchlist';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/movie/:id" element={<MovieDetail />} />
      <Route path="/watchlist" element={<Watchlist />} />
    </Routes>
  );
}

export default App;
