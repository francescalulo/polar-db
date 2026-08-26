import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { APP_FOLDER_NAME } from '../globals/globalVariables';

import WatchlistProvider from '../context/WatchlistProvider';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Home from '../pages/Home/Home';
import About from '../pages/About/About';
import MovieDetail from '../pages/MovieDetail/MovieDetail';
import Watchlist from '../pages/Watchlist/Watchlist';
import SearchResults from '../pages/SearchResults/SearchResults';
import NotFound from '../pages/NotFound/NotFound';

function AppRouter() {
  return (
    <BrowserRouter basename={'/' + APP_FOLDER_NAME}>
      <WatchlistProvider>
        <div className="wrapper">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </WatchlistProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
