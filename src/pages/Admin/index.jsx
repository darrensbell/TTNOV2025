import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import IngestionModal from '../../components/IngestionModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import styles from './style.module.css';

// Helper function to format Firestore Timestamps into dd/MM/yyyy HH:mm:ss
const formatTimestamp = (timestamp) => {
  if (!timestamp || typeof timestamp.toDate !== 'function') {
    return 'Invalid Date';
  }
  const date = timestamp.toDate();
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

function Admin() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const fetchData = async () => {
    try {
        const salesDataCollection = collection(db, 'sales_data');
        const querySnapshot = await getDocs(salesDataCollection);
        const firestoreData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(firestoreData);
    } catch (error) {
        console.error("Error fetching data from Firestore: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchData(); // Refresh data only when the modal is closed
  };

  const openConfirmationModal = () => setIsConfirmationModalOpen(true);
  const closeConfirmationModal = () => setIsConfirmationModalOpen(false);

  const handleDeleteAllData = async () => {
    closeConfirmationModal();
    try {
        const salesDataCollection = collection(db, 'sales_data');
        const querySnapshot = await getDocs(salesDataCollection);
        const deletePromises = querySnapshot.docs.map((document) => 
            deleteDoc(doc(db, 'sales_data', document.id))
        );
        await Promise.all(deletePromises);
        setData([]);
        alert('All data has been deleted.');
    } catch (error) {
        console.error("Error deleting data: ", error);
        alert('An error occurred while deleting data.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Admin - Raw Data</h1>
      <button onClick={handleOpenModal}>Ingest Data</button>
      <button onClick={openConfirmationModal} className={styles.deleteButton}>Delete All Data</button>
      <IngestionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleDeleteAllData}
        message="Are you sure you want to delete all data? This action cannot be undone."
      />
      {data.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ingestion Time</th>
                <th>Transaction Date</th>
                <th>Event Name</th>
                <th>Channel Name</th>
                <th>Price Band Name</th>
                <th>Performance Date Time</th>
                <th>Performance Date</th>
                <th>Performance Start Time</th>
                <th>Performance Type</th>
                <th>Transaction Completed At</th>
                <th>Sold Tickets</th>
                <th>Comp Tickets</th>
                <th>Sold Gross Value</th>
                <th>ATP</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.ingestionTime ? new Date(row.ingestionTime).toLocaleString() : 'N/A'}</td>
                  <td>{row.TransactionDate}</td>
                  <td>{row['Event Name']}</td>
                  <td>{row['Channel Name']}</td>
                  <td>{row['Price Band Name']}</td>
                  <td>{row['Performance Date Time'] || formatTimestamp(row.performanceDateTime)}</td>
                  <td>{row.PerformanceDate}</td>
                  <td>{row['Performance Start Time']}</td>
                  <td>{row.performanceType}</td>
                  <td>{row['Transaction Completed At']}</td>
                  <td>{row['Sold Tickets']}</td>
                  <td>{row['Comp Tickets']}</td>
                  <td>{row['Sold Gross Value']}</td>
                  <td>{row.atp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data ingested yet.</p>
      )}
    </div>
  );
}

export default Admin;
