import { useState, useEffect } from 'react';
import { FaDatabase } from 'react-icons/fa';
import UpdateDBModal from '../UpdateDBModal';
import styles from './Footer.module.css';
import packageJson from '../../../package.json';

const Footer = () => {
  const [time, setTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDbIconClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmUpdate = () => {
    // Logic to force database update
    console.log('Forcing database update...');
    setIsModalOpen(false);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.dbStatus} onClick={handleDbIconClick}>
        <div className={styles.statusLight}></div>
        <FaDatabase className={styles.dbIcon} />
        <span>Database Connected</span>
      </div>
      <div className={styles.time}>
        {time.toLocaleDateString()} {time.toLocaleTimeString()}
      </div>
      <div className={styles.version}>v{packageJson.version}</div>
      <UpdateDBModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmUpdate}
      />
    </footer>
  );
};

export default Footer;
