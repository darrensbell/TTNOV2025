import { useState, useEffect } from 'react';
import { FaHome, FaTicketAlt, FaUpload, FaCog, FaDatabase } from 'react-icons/fa';
import Logo from '../Logo';
import SidebarButton from '../SidebarButton';
import styles from './Sidebar.module.css';
import packageJson from '../../../package.json';

const Sidebar = ({ onIngestClick }) => {
  const [time, setTime] = useState(new Date());
  const commitDate = 'Sun Nov 16 19:30:47 2025 +0000';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <Logo />
      </div>
      <nav className={styles.nav}>
        <SidebarButton to="/" icon={<FaHome />}>HOME</SidebarButton>
        <SidebarButton to="/shows" icon={<FaTicketAlt />}>SHOWS</SidebarButton>
        <SidebarButton onClick={onIngestClick} icon={<FaUpload />}>INGEST CSV</SidebarButton>
        <SidebarButton to="/admin" icon={<FaCog />}>ADMIN</SidebarButton>
      </nav>
      <div className={styles.footer}>
        <div className={styles.dbStatus}>
            <div className={styles.statusLight}></div>
            <FaDatabase className={styles.dbIcon} />
            <span>Database Connected</span>
        </div>
        <div className={styles.time}>
            {time.toLocaleDateString()} {time.toLocaleTimeString()}
        </div>
        <div className={styles.version}>
          v{packageJson.version}
          <span className={styles.tooltip}>{commitDate}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
