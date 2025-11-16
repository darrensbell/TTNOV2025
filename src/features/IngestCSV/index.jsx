import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { collection, addDoc, doc, setDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../../services/firebase';
import styles from './style.module.css';

function IngestCSV({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [missingShows, setMissingShows] = useState([]);
  const [showDetails, setShowDetails] = useState({});

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleShowDetailChange = (showName, field, value) => {
    setShowDetails(prev => ({
      ...prev,
      [showName]: {
        ...prev[showName],
        [field]: value,
      }
    }));
  };

  const handleSaveMissingShows = async () => {
    const batch = writeBatch(db);
    missingShows.forEach(showName => {
      const showData = showDetails[showName];
      const showRef = doc(collection(db, 'shows'));
      batch.set(showRef, { name: showName, ...showData });
    });
    await batch.commit();
    setMissingShows([]);
    setShowDetails({});
    // After saving, re-trigger the upload process.
    handleUpload(true);
  };


  const handleUpload = async (forceUpload = false) => {
    if (!file) return;

    setUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const salesData = results.data;

        // Get unique event names from CSV
        const eventNamesInCSV = [...new Set(salesData.map(row => row['Event Name']))];

        // Check which shows exist in the 'shows' collection
        const showsCollection = collection(db, 'shows');
        const q = query(showsCollection, where('name', 'in', eventNamesInCSV));
        const querySnapshot = await getDocs(q);
        const existingShows = querySnapshot.docs.map(doc => doc.data().name);

        const newMissingShows = eventNamesInCSV.filter(name => !existingShows.includes(name));

        if (newMissingShows.length > 0 && !forceUpload) {
          setMissingShows(newMissingShows);
          // Initialize showDetails state for the new missing shows
          const initialShowDetails = {};
          newMissingShows.forEach(name => {
            initialShowDetails[name] = {
              firstShowDate: '',
              onSaleDate: '',
              ticketsAvailable: '',
              boxOfficeGrossPotential: '',
            };
          });
          setShowDetails(initialShowDetails);
          setUploading(false);
          return; // Stop the process until user provides details
        }

        // --- If we are here, all shows exist or have been created ---

        // Create a map of show names to their IDs for easy lookup
        const allShowsSnapshot = await getDocs(query(collection(db, 'shows'), where('name', 'in', eventNamesInCSV)));
        const showIdMap = {};
        allShowsSnapshot.docs.forEach(doc => {
            showIdMap[doc.data().name] = doc.id;
        });

        const salesDataCollection = collection(db, 'sales_data');
        const salesPromises = salesData.map((row) => {
          const showId = showIdMap[row['Event Name']];
          return addDoc(salesDataCollection, { ...row, showId });
        });

        await Promise.all(salesPromises);


        const summary = {};

        salesData.forEach((sale) => {
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

        {missingShows.length > 0 ? (
          <div>
            <h3>Some shows are missing details</h3>
            <p>Please provide the following information for the new shows found in your CSV.</p>
            {missingShows.map(showName => (
              <div key={showName} className={styles.missingShowForm}>
                <h4>{showName}</h4>
                <input
                  type="date"
                  placeholder="First Show Date"
                  onChange={(e) => handleShowDetailChange(showName, 'firstShowDate', e.target.value)}
                />
                <input
                  type="date"
                  placeholder="On Sale Date"
                  onChange={(e) => handleShowDetailChange(showName, 'onSaleDate', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Tickets Available"
                  onChange={(e) => handleShowDetailChange(showName, 'ticketsAvailable', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Box Office Gross Potential"
                  onChange={(e) => handleShowDetailChange(showName, 'boxOfficeGrossPotential', e.target.value)}
                />
              </div>
            ))}
            <button onClick={handleSaveMissingShows}>Save Shows and Continue Upload</button>
            <button onClick={() => { setMissingShows([]); setUploading(false); }}>Cancel</button>
          </div>
        ) : (
          <>
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
                <button onClick={() => handleUpload(false)} disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            )}
            {uploadSuccess && <p className={styles.successMessage}>Upload successful!</p>}
          </>
        )}

        <button className={styles.closeButton} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default IngestCSV;
