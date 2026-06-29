import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TopNav } from './components/Navigation/TopNav';
import { Situation } from './pages/Situation';
import { Find } from './pages/Find';
import { Report } from './pages/Report';
import { ProviderStatus } from './pages/Dev/ProviderStatus';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
        <TopNav />
        <Routes>
          <Route path="/" element={<Navigate to="/situation" replace />} />
          <Route path="/situation" element={<Situation />} />
          <Route path="/find" element={<Find />} />
          <Route path="/report" element={<Report />} />
          <Route path="/dev/providers" element={<ProviderStatus />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
