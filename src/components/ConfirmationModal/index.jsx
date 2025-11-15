import Modal from 'react-modal';
import styles from './ConfirmationModal.module.css';

Modal.setAppElement('#root');

function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <h2>Confirmation</h2>
            <p>{message}</p>
            <div className={styles.buttons}>
                <button onClick={onConfirm} className={styles.confirmButton}>Confirm</button>
                <button onClick={onClose} className={styles.cancelButton}>Cancel</button>
            </div>
        </Modal>
    );
}

export default ConfirmationModal;
