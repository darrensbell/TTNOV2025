import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import styles from './IngestCSV.module.css';

function IngestCSV({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const salesDataCollection = collection(db, 'sales_data');
        const promises = results.data.map((row) => addDoc(salesDataCollection, row));
        await Promise.all(promises);
        setUploading(false);
        setUploadSuccess(true);
        setFile(null);
        setTimeout(() => {
          setUploadSuccess(false);
          onClose();
        }, 3000);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Ingest CSV</h2>
        <div {...getRootProps({ className: styles.dropzone })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop a CSV file here, or click to select a file</p>
          )}
        </div>
        {file && (
          <div className={styles.fileDetails}>
            <p>Selected file: {file.name}</p>
            <button onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        )}
        {uploadSuccess && <p className={styles.successMessage}>Upload successful!</p>}
        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default IngestCSV;
