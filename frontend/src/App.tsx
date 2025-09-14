import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';
import DemoPage from './pages/DemoPage';
import ProblemPage from './pages/ProblemPage';
import ProcessPage from './pages/ProcessPage';
import ResultsPage from './pages/ResultsPage';
import RoadmapPage from './pages/RoadmapPage';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/problem" element={<ProblemPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
        </Routes>
        
        {/* Footer on all pages */}
        <Footer />
      </Layout>
    </Router>
  );
}

export default App;