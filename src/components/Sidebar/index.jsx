
import { FaHome, FaCog, FaUpload, FaTicketAlt } from 'react-icons/fa';
import Logo from '../Logo';
import Footer from '../Footer';
import SidebarButton from '../SidebarButton'; // <-- IMPORTING THE NEW COMPONENT
import styles from './Sidebar.module.css';
import buttonStyles from '../SidebarButton/SidebarButton.module.css'; // <-- IMPORTING THE BUTTON-SPECIFIC STYLES

function Sidebar({ onIngestClick }) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarTop}>
        <div className={styles.logoContainer}>
          <Logo />
        </div>
        <nav className={styles.mainNav}>
          <SidebarButton to="/">
            <FaHome className={buttonStyles.icon} /> HOME
          </SidebarButton>
          <SidebarButton to="/shows">
            <FaTicketAlt className={buttonStyles.icon} /> SHOWS
          </SidebarButton>
          <SidebarButton onClick={onIngestClick}>
            <FaUpload className={buttonStyles.icon} /> INGEST CSV
          </SidebarButton>
          <SidebarButton to="/admin">
            <FaCog className={buttonStyles.icon} /> ADMIN
          </SidebarButton>
        </nav>
      </div>
      <div className={styles.sidebarBottom}>
        <Footer />
      </div>
    </div>
  );
}

export default Sidebar;
