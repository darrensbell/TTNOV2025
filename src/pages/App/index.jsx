import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FaHome, FaCog, FaUpload } from 'react-icons/fa';
import Home from '../Home';
import Report from '../Report';
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
          <button className="button button-secondary" onClick={() => alert('Settings not implemented yet')}><FaCog /> SETTINGS</button>
        </nav>
      </header>
      <main className="mainContent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report/:eventName" element={<Report />} />
        </Routes>
      </main>
      <IngestCSV isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <Footer />
    </div>
  );
}

export default App;
