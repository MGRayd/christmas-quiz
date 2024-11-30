import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import QuizRound1 from './pages/QuizRound1';
import QuizRound2 from './pages/QuizRound2';
import QuizRound3 from './pages/QuizRound3';
import QuizRound4 from './pages/QuizRound4';
import QuizRound5 from './pages/QuizRound5';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/round1" element={<QuizRound1 />} />
        <Route path="/round2" element={<QuizRound2 />} />
        <Route path="/round3" element={<QuizRound3 />} />
        <Route path="/round4" element={<QuizRound4 />} />
        <Route path="/round5" element={<QuizRound5 />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App; 