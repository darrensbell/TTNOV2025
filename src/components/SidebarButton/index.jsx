
import { Link } from 'react-router-dom';
import styles from './SidebarButton.module.css';

function SidebarButton({ to, onClick, children }) {
  const buttonClassName = `button button-secondary ${styles.sidebarButton}`;

  if (to) {
    return (
      <Link to={to} className={buttonClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={buttonClassName} onClick={onClick}>
      {children}
    </button>
  );
}

export default SidebarButton;
