import Modal from 'react-modal';
import styles from './UpdateDBModal.module.css';

const UpdateDBModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={styles.modalContent}
      overlayClassName={styles.modalOverlay}
      ariaHideApp={false}
    >
      <h2>Confirm Database Update</h2>
      <p>Are you sure you want to force a database update? This may take a few moments.</p>
      <div className={styles.modalActions}>
        <button onClick={onConfirm} className={styles.confirmButton}>
          Confirm
        </button>
        <button onClick={onClose} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default UpdateDBModal;
