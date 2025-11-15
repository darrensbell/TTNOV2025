import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FaHome, FaCog, FaUpload } from 'react-icons/fa';
import Home from '../Home';
import Report from '../Report';
import Admin from '../Admin'; // Import the Admin component
import IngestCSV from '../../features/IngestCSV';
import Logo from '../../components/Logo';
import Footer from '../../components/Footer'; 
import './style.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app">
      <header className="app-header">
        <Logo />
        <nav className="main-nav">
          <Link to="/" className="button button-secondary"><FaHome /> HOME</Link>
          <button className="button button-secondary" onClick={() => setIsModalOpen(true)}><FaUpload /> INGEST CSV</button>
          {/* Changed settings button to a link to the Admin page */}
          <Link to="/admin" className="button button-secondary"><FaCog /> ADMIN</Link>
        </nav>
      </header>
      <main className="mainContent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report/:eventName" element={<Report />} />
          {/* Added the route for the Admin page */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <IngestCSV isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Footer />
    </div>
  );
}

export default App;
