import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { EditorPage } from './pages/EditorPage';
import { WaitlistLandingPage } from './pages/WaitlistLandingPage';
import { WaitlistJoinPage } from './pages/WaitlistJoinPage';
import { WaitlistSuccessPage } from './pages/WaitlistSuccessPage';
import { AdminPage } from './pages/AdminPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WaitlistLandingPage />} />
        <Route path="/join" element={<WaitlistJoinPage />} />
        <Route path="/success" element={<WaitlistSuccessPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
