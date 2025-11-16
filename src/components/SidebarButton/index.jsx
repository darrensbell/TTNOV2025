
import { Link } from 'react-router-dom';
import styles from './SidebarButton.module.css';
import buttonStyles from './button.module.css';

function SidebarButton({ to, onClick, children }) {
  const buttonClassName = `${buttonStyles.button} ${buttonStyles['button-secondary']} ${styles.sidebarButton}`;

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
