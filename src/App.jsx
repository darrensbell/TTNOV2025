import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FaHome, FaCog, FaUpload } from 'react-icons/fa';
import Home from './pages/Home';
import Report from './pages/Report';
import IngestCSV from './components/IngestCSV';
import styles from './App.module.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <Link to="/">TheatreTrack®</Link>
        </div>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navButton}><FaHome /> HOME</Link>
          <button className={styles.navButton} onClick={() => setIsModalOpen(true)}><FaUpload /> INGEST CSV</button>
          <button className={styles.navButton} onClick={() => alert('Settings not implemented yet')}><FaCog /> SETTINGS</button>
        </nav>
      </header>
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report/:eventName" element={<Report />} />
        </Routes>
      </main>
      <IngestCSV isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
