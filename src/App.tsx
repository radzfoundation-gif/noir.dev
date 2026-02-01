import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { EditorPage } from './pages/EditorPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { PricingPage } from './pages/PricingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ProjectsPage } from './pages/ProjectsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/editor" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

