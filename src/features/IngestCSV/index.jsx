import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { collection, addDoc, doc, setDoc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import styles from './style.module.css';

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
        const newDocs = await Promise.all(promises);

        const summary = {};

        results.data.forEach((sale, index) => {
          const key = `${sale.TransactionDate}-${sale['Event Name']}-${sale.performanceType}`;

          if (!summary[key]) {
            summary[key] = {
              'TransactionDate': sale.TransactionDate,
              'Event Name': sale['Event Name'],
              'performanceType': sale.performanceType,
              'totalSoldGrossValue': 0,
              'totalSoldTickets': 0,
              'totalCompTickets': 0,
            };
          }

          summary[key].totalSoldGrossValue += parseFloat(sale['Sold Gross Value']);
          summary[key].totalSoldTickets += parseInt(sale['Sold Tickets'], 10);
          summary[key].totalCompTickets += parseInt(sale['Comp Tickets'], 10);
        });

        const summaryCollection = collection(db, 'daily_event_summary');
        const summaryPromises = Object.keys(summary).map(async key => {
            const data = summary[key];
            const q = query(summaryCollection, 
                where('TransactionDate', '==', data.TransactionDate),
                where('Event Name', '==', data['Event Name']),
                where('performanceType', '==', data.performanceType));

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                const summaryRef = doc(summaryCollection);
                return setDoc(summaryRef, data);
            } else {
                const docToUpdate = querySnapshot.docs[0];
                const updatedData = { ...docToUpdate.data() };
                updatedData.totalSoldGrossValue += data.totalSoldGrossValue;
                updatedData.totalSoldTickets += data.totalSoldTickets;
                updatedData.totalCompTickets += data.totalCompTickets;
                return setDoc(docToUpdate.ref, updatedData);
            }
        });

        await Promise.all(summaryPromises);

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
