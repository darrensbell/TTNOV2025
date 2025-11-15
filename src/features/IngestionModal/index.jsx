import { useState, useCallback } from 'react';
import Modal from 'react-modal';
import { useIngestion } from '../../hooks/useIngestion';
import styles from './IngestionModal.module.css';

Modal.setAppElement('#root');

function IngestionModal({ isOpen, onClose }) {
    const [file, setFile] = useState(null);
    const [ingestionMessage, setIngestionMessage] = useState('');
    const { isIngesting, progress, ingestedCount, errorRows, startIngestion } = useIngestion();

    const handleFileChange = (e) => {
        setFile(e.target.files[0] || null);
        setIngestionMessage('');
    };

    const handleIngest = useCallback(() => {
        if (!file) return;
        setIngestionMessage('');

        startIngestion(file, {
            onComplete: (message, errors) => {
                setIngestionMessage(message);
                if (!errors || errors.length === 0) {
                    setTimeout(() => { // Close modal on success after a delay
                        onClose();
                    }, 3000);
                }
            },
            onError: (error) => {
                setIngestionMessage(`Error: ${error}`);
            }
        });
    }, [file, startIngestion, onClose]);

    const handleClose = () => {
        if (!isIngesting) {
            onClose();
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onRequestClose={handleClose} 
            className={styles.modal} 
            overlayClassName={styles.overlay}
        >
            <h2>Ingest Sales Data</h2>
            <input type="file" accept=".csv" onChange={handleFileChange} disabled={isIngesting} />
            
            {isIngesting && (
                <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar} style={{ width: `${progress}%` }}>
                        {progress > 10 && `${Math.round(progress)}%`}
                    </div>
                </div>
            )}

            {ingestionMessage && <p className={styles.ingestionMessage}>{ingestionMessage}</p>}

            {errorRows.length > 0 && (
                <div className={styles.errorList}>
                    <h4>Rows with errors:</h4>
                    <ul>
                        {errorRows.slice(0, 10).map((err, index) => ( // Show first 10 errors
                            <li key={index}><b>Row {err.row}:</b> {err.error}</li>
                        ))}
                    </ul>
                    {errorRows.length > 10 && <p>...and {errorRows.length - 10} more errors.</p>}
                </div>
            )}

            <div className={styles.buttons}>
                <button onClick={handleIngest} className={styles.ingestButton} disabled={isIngesting || !file}>
                    {isIngesting ? 'Ingesting...' : 'Start Ingestion'}
                </button>
                <button onClick={handleClose} className={styles.cancelButton} disabled={isIngesting}>Close</button>
            </div>
        </Modal>
    );
}

export default IngestionModal;
