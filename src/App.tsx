import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PageWrapper } from './components/layout/PageWrapper';
import { HomePage } from './pages/HomePage';
import { AdminSetupPage } from './pages/AdminSetupPage';
import { GameBoardPage } from './pages/GameBoardPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminSetupPage /></PageWrapper>} />
        <Route path="/game" element={<GameBoardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
