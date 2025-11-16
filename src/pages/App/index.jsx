import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../Home';
import Report from '../Report';
import Admin from '../Admin';
import Show from '../Show';
import DataFix from '../DataFix';
import IngestCSV from '../../features/IngestCSV';
import Sidebar from '../../components/Sidebar';
import './style.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleIngestClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="appLayout">
      <Sidebar onIngestClick={handleIngestClick} />
      <main className="mainContent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report/:eventName" element={<Report />} />
          <Route path="/shows" element={<Show />} />
          <Route path="/datafix" element={<DataFix />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <IngestCSV isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
