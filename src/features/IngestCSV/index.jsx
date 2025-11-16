import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { collection, addDoc, doc, setDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { validateAndCreateFirestoreRow } from '../../hooks/useIngestion'; // Import the helper
import styles from './style.module.css';

function IngestCSV({ isOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [missingShows, setMissingShows] = useState([]);
  const [showDetails, setShowDetails] = useState({});
  const [errorMessages, setErrorMessages] = useState([]);

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
    // After saving, re-trigger the the upload process to link new shows and summarize
    handleUpload(true);
  };


  const handleUpload = async (forceUpload = false) => {
    if (!file) return;

    setUploading(true);
    setErrorMessages([]); // Clear previous errors

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let processedSalesData = [];
        let currentErrorMessages = [];

        // Validate and transform each row using the helper from useIngestion
        results.data.forEach((row, index) => {
          try {
            const validatedRow = validateAndCreateFirestoreRow(row, index + 1); // +1 for 1-based indexing
            processedSalesData.push(validatedRow);
          } catch (error) {
            currentErrorMessages.push(error.message);
            console.error(`Error processing row ${index + 1}:`, error.message);
          }
        });
        setErrorMessages(currentErrorMessages);

        if (processedSalesData.length === 0) {
            setUploading(false);
            setFile(null);
            if(currentErrorMessages.length > 0) {
              alert("CSV ingestion failed. Please check for errors: " + currentErrorMessages.join("\n"));
            } else {
              alert("No valid data to ingest from CSV.");
            }
            onClose();
            return;
        }

        // Get unique event names from processed data
        const eventNamesInCSV = [...new Set(processedSalesData.map(row => row['Event Name']))];

        // Check which shows exist in the 'shows' collection
        const showsCollection = collection(db, 'shows');
        const q = query(showsCollection, where('name', 'in', eventNamesInCSV));
        const querySnapshot = await getDocs(q);
        const existingShowsMap = {};
        querySnapshot.docs.forEach(doc => { existingShowsMap[doc.data().name] = doc.id; });

        const newMissingShows = eventNamesInCSV.filter(name => !existingShowsMap[name]);

        if (newMissingShows.length > 0 && !forceUpload) {
          setMissingShows(newMissingShows);
          // Initialize showDetails state for the new missing shows
          const initialShowDetails = {};
          newMissingShows.forEach(name => {
            // Attempt to pre-fill dates if possible from the first occurrence in processedData
            const firstOccurrence = processedSalesData.find(sale => sale['Event Name'] === name);
            initialShowDetails[name] = {
              firstShowDate: firstOccurrence?.PerformanceDate || '',
              onSaleDate: firstOccurrence?.TransactionDate || '',
              performanceTime: firstOccurrence?.['Performance Start Time'] || '',
              performanceType: firstOccurrence?.performanceType || '',
              ticketsAvailable: '',
              boxOfficeGrossPotential: '',
            };
          });
          setShowDetails(initialShowDetails);
          setUploading(false);
          return; // Stop the process until user provides details
        }

        // --- If we are here, all shows exist or have been created ---

        // Update showIdMap with any newly created shows (if forceUpload was true)
        const updatedShowsSnapshot = await getDocs(query(collection(db, 'shows'), where('name', 'in', eventNamesInCSV)));
        updatedShowsSnapshot.docs.forEach(doc => { existingShowsMap[doc.data().name] = doc.id; });

        const salesDataCollection = collection(db, 'sales_data');
        const salesBatch = writeBatch(db);
        processedSalesData.forEach((row) => {
          const showId = existingShowsMap[row['Event Name']];
          const newDocRef = doc(salesDataCollection); // Firestore auto-generates ID
          salesBatch.set(newDocRef, { ...row, showId });
        });

        await salesBatch.commit();

        // --- Summarization Logic (now using processedSalesData) ---
        const summary = {};

        processedSalesData.forEach((sale) => {
          // Ensure critical fields are present after processing (should be guaranteed by validateAndCreateFirestoreRow)
          if (!sale.TransactionDate || !sale['Event Name'] || !sale.performanceType) {
              console.warn(`Skipping summary for a sale due to missing critical data after processing:`, sale);
              return; // Skip this sale from summary
          }

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
        const summaryOperations = []; // Array to hold all summary update/set promises

        for (const key in summary) {
            const data = summary[key];

            if (!data.TransactionDate || !data['Event Name'] || !data.performanceType) {
                console.warn(`Skipping final summary write for key ${key} due to missing critical data.`, data);
                continue; // Skip this entry
            }

            const q = query(summaryCollection, 
                where('TransactionDate', '==', data.TransactionDate),
                where('Event Name', '==', data['Event Name']),
                where('performanceType', '==', data.performanceType));

            // Perform async query to check for existing summary document
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                // If no existing summary, prepare to add a new document
                summaryOperations.push({ type: 'set', ref: doc(summaryCollection), data: data });
            } else {
                // If existing, prepare to update it
                const docToUpdate = querySnapshot.docs[0];
                const existingData = docToUpdate.data();
                const updatedData = {
                    ...existingData,
                    totalSoldGrossValue: existingData.totalSoldGrossValue + data.totalSoldGrossValue,
                    totalSoldTickets: existingData.totalSoldTickets + data.totalSoldTickets,
                    totalCompTickets: existingData.totalCompTickets + data.totalCompTickets,
                };
                summaryOperations.push({ type: 'set', ref: docToUpdate.ref, data: updatedData }); // Use set with existing ref to overwrite
            }
        }

        // Now, execute all summary operations in a single batch
        const summaryBatch = writeBatch(db);
        summaryOperations.forEach(op => {
            if (op.type === 'set') {
                summaryBatch.set(op.ref, op.data);
            } // Can add 'update' type if needed later, but 'set' with full data works for this case
        });
        await summaryBatch.commit();

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

        {errorMessages.length > 0 && (
          <div className={styles.errorContainer}>
            <h3>Errors during CSV Processing:</h3>
            {errorMessages.map((msg, index) => <p key={index} className={styles.errorMessage}>{msg}</p>)}
          </div>
        )}

        {missingShows.length > 0 ? (
          <div>
            <h3>Some shows are missing details</h3>
            <p>We've pre-filled some information. Please provide the remaining details and click 'Save Shows and Continue Upload'.</p>
            {missingShows.map(showName => (
              <div key={showName} className={styles.missingShowForm}>
                <h4>{showName}</h4>
                <input
                  type="text"
                  name="performanceType"
                  placeholder="Performance Type (e.g., Matinee, Evening)"
                  value={showDetails[showName]?.performanceType || ''}
                  onChange={(e) => handleShowDetailChange(showName, 'performanceType', e.target.value)}
                />
                <input
                  type="text"
                  name="performanceTime"
                  placeholder="Performance Time (e.g., 19:30)"
                  value={showDetails[showName]?.performanceTime || ''}
                  onChange={(e) => handleShowDetailChange(showName, 'performanceTime', e.target.value)}
                />
                <input
                  type="date"
                  name="firstShowDate"
                  placeholder="First Show Date"
                  value={showDetails[showName]?.firstShowDate || ''}
                  onChange={(e) => handleShowDetailChange(showName, 'firstShowDate', e.target.value)}
                />
                <input
                  type="date"
                  name="onSaleDate"
                  placeholder="On Sale Date"
                  value={showDetails[showName]?.onSaleDate || ''}
                  onChange={(e) => handleShowDetailChange(showName, 'onSaleDate', e.target.value)}
                />
                <input
                  type="number"
                  name="ticketsAvailable"
                  placeholder="Tickets Available"
                  value={showDetails[showName]?.ticketsAvailable || ''}
                  onChange={(e) => handleShowDetailChange(showName, 'ticketsAvailable', e.target.value)}
                />
                <input
                  type="number"
                  name="boxOfficeGrossPotential"
                  placeholder="Box Office Gross Potential"
                  value={showDetails[showName]?.boxOfficeGrossPotential || ''}
                  onChange={(e) => handleShowDetailChange(showName, 'boxOfficeGrossPotential', e.target.value)}
                />
              </div>
            ))}
            <button onClick={handleSaveMissingShows}>Save Shows and Continue Upload</button>
            <button onClick={() => { setMissingShows([]); setUploading(false); setErrorMessages([]); }}>Cancel</button>
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