import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { EditorPage } from './pages/EditorPage';
import { WaitlistPage } from './pages/WaitlistPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/waitlist" element={<WaitlistPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
