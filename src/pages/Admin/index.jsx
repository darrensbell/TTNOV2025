import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, writeBatch, setDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../services/firebase';
import ConfirmationModal from '../../components/ConfirmationModal';
import styles from './style.module.css';

function Admin() {
  const [summaryData, setSummaryData] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConsolidateModalOpen, setIsConsolidateModalOpen] = useState(false);
  const [consolidationStatus, setConsolidationStatus] = useState('');

  const fetchSummaryData = async () => {
    try {
        const summaryCollection = collection(db, 'daily_event_summary');
        const q = query(summaryCollection, orderBy('TransactionDate', 'desc'));
        const querySnapshot = await getDocs(q);
        const summaryData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSummaryData(summaryData);
    } catch (error) {
        console.error("Error fetching daily summaries from Firestore: ", error);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  const openConsolidateModal = () => setIsConsolidateModalOpen(true);
  const closeConsolidateModal = () => setIsConsolidateModalOpen(false);

  const handleDeleteAllData = async () => {
    closeDeleteModal();
    try {
        const salesDataCollection = collection(db, 'sales_data');
        const querySnapshot = await getDocs(salesDataCollection);
        const deletePromises = querySnapshot.docs.map((document) => 
            deleteDoc(doc(db, 'sales_data', document.id))
        );
        await Promise.all(deletePromises);

        const summaryCollection = collection(db, 'daily_event_summary');
        const summarySnapshot = await getDocs(summaryCollection);
        const deleteSummaryPromises = summarySnapshot.docs.map((document) =>
            deleteDoc(doc(db, 'daily_event_summary', document.id))
        );
        await Promise.all(deleteSummaryPromises);

        setSummaryData([]);
        alert('All data has been deleted.');
    } catch (error) {
        console.error("Error deleting data: ", error);
        alert('An error occurred while deleting data.');
    }
  };

  const handleConsolidate = async () => {
    closeConsolidateModal();
    setConsolidationStatus('Processing... Please wait.');
    try {
      const salesSnapshot = await getDocs(collection(db, 'sales_data'));
      const summary = {};

      salesSnapshot.forEach(doc => {
        const sale = doc.data();
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

      const batchCommit = writeBatch(db);
      for (const key in summary) {
        const summaryRef = doc(collection(db, 'daily_event_summary'));
        batchCommit.set(summaryRef, summary[key]);
      }

      await batchCommit.commit();
      setConsolidationStatus('Successfully consolidated all data!');
      fetchSummaryData(); // Refresh the table
    } catch (error) {
      console.error('Error consolidating data:', error);
      setConsolidationStatus('An error occurred. Please check the console for details.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Admin</h1>
      <Link to="/" className={styles.backButton}>Back to Home</Link>
      <button onClick={openConsolidateModal} className={styles.actionButton}>Consolidate All Data</button>
      <button onClick={openDeleteModal} className={styles.deleteButton}>Delete All Data</button>
      
      <ConfirmationModal
        isOpen={isConsolidateModalOpen}
        onClose={closeConsolidateModal}
        onConfirm={handleConsolidate}
        message="Are you sure you want to consolidate all data? This will process all existing sales data and create a new summary collection."
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteAllData}
        message="Are you sure you want to delete all data? This action cannot be undone."
      />

      {consolidationStatus && <p>{consolidationStatus}</p>}

      <h2>Daily Event Summary</h2>
      {summaryData.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Transaction Date</th>
                <th>Event Name</th>
                <th>Performance Type</th>
                <th>Total Sold Gross Value</th>
                <th>Total Sold Tickets</th>
                <th>Total Comp Tickets</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((row) => (
                <tr key={row.id}>
                  <td>{row['TransactionDate']}</td>
                  <td>{row['Event Name']}</td>
                  <td>{row['performanceType']}</td>
                  <td>{row['totalSoldGrossValue']}</td>
                  <td>{row['totalSoldTickets']}</td>
                  <td>{row['totalCompTickets']}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No summary data available.</p>
      )}
    </div>
  );
}

export default Admin;
