import { HashRouter, Routes, Route } from 'react-router-dom';
import { PageWrapper } from './components/layout/PageWrapper';
import { HomePage } from './pages/HomePage';
import { AdminSetupPage } from './pages/AdminSetupPage';
import { GameBoardPage } from './pages/GameBoardPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminSetupPage /></PageWrapper>} />
        <Route path="/game" element={<GameBoardPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
