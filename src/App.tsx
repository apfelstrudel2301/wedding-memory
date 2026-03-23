import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageWrapper } from './components/layout/PageWrapper';
import { HomePage } from './pages/HomePage';
import { AdminSetupPage } from './pages/AdminSetupPage';
import { PlayerSetupPage } from './pages/PlayerSetupPage';
import { GameBoardPage } from './pages/GameBoardPage';
import { ResultsPage } from './pages/ResultsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminSetupPage /></PageWrapper>} />
        <Route path="/players" element={<PageWrapper><PlayerSetupPage /></PageWrapper>} />
        <Route path="/game" element={<PageWrapper><GameBoardPage /></PageWrapper>} />
        <Route path="/results" element={<PageWrapper><ResultsPage /></PageWrapper>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
