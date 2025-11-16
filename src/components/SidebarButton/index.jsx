import { Link } from 'react-router-dom';
import styles from './SidebarButton.module.css';

const SidebarButton = ({ to, onClick, children, icon }) => {
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={styles.sidebarButton}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={styles.sidebarButton}>
      {content}
    </button>
  );
};

export default SidebarButton;
