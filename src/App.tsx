import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import HomePage from './pages/HomePage';
import TreesPage from './pages/TreesPage';
import CharactersPage from './pages/CharactersPage';
import GlossaryPage from './pages/GlossaryPage';
import CharacterDetailPage from './pages/CharacterDetailPage';
import TimelinePage from './pages/TimelinePage';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="stars-bg" aria-hidden="true"></div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/arboles" element={<TreesPage />} />
        <Route path="/arboles/:treeId" element={<TreesPage />} />
        <Route path="/personajes" element={<CharactersPage />} />
        <Route path="/personaje/:characterId" element={<CharacterDetailPage />} />
        <Route path="/glosario" element={<GlossaryPage />} />
        <Route path="/linea-temporal" element={<TimelinePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
