import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../../services/firebase';
import ConfirmationModal from '../../components/ConfirmationModal';
import styles from './style.module.css';
import { formatDate } from '../../utils/date'; // Import the date utility

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
      const mapped = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setSummaryData(mapped);
    } catch (error) {
      console.error('Error fetching daily summaries from Firestore: ', error);
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
      // Delete from sales_data
      const salesDataCollection = collection(db, 'sales_data');
      const salesSnapshot = await getDocs(salesDataCollection);
      const deleteSales = salesSnapshot.docs.map((document) =>
        deleteDoc(doc(db, 'sales_data', document.id)),
      );
      await Promise.all(deleteSales);

      // Delete from daily_event_summary
      const summaryCollection = collection(db, 'daily_event_summary');
      const summarySnapshot = await getDocs(summaryCollection);
      const deleteSummary = summarySnapshot.docs.map((document) =>
        deleteDoc(doc(db, 'daily_event_summary', document.id)),
      );
      await Promise.all(deleteSummary);

      setSummaryData([]);
      alert('All data has been deleted.');
    } catch (error) {
      console.error('Error deleting data: ', error);
      alert('An error occurred while deleting data.');
    }
  };

  const handleConsolidate = async () => {
    closeConsolidateModal();
    setConsolidationStatus('Processing... Please wait.');
    try {
      const salesSnapshot = await getDocs(collection(db, 'sales_data'));
      const summary = {};

      salesSnapshot.forEach((docSnap) => {
        const sale = docSnap.data();
        const key = `${sale.TransactionDate}-${sale['Event Name']}-${sale.performanceType}`;

        if (!summary[key]) {
          summary[key] = {
            TransactionDate: sale.TransactionDate,
            'Event Name': sale['Event Name'],
            performanceType: sale.performanceType,
            totalSoldGrossValue: 0,
            totalSoldTickets: 0,
            totalCompTickets: 0,
          };
        }

        summary[key].totalSoldGrossValue += parseFloat(
          sale['Sold Gross Value'],
        );
        summary[key].totalSoldTickets += parseInt(
          sale['Sold Tickets'],
          10,
        );
        summary[key].totalCompTickets += parseInt(
          sale['Comp Tickets'],
          10,
        );
      });

      const batch = writeBatch(db);
      Object.values(summary).forEach((row) => {
        const summaryRef = doc(collection(db, 'daily_event_summary'));
        batch.set(summaryRef, row);
      });

      await batch.commit();
      setConsolidationStatus('Successfully consolidated all data!');
      fetchSummaryData();
    } catch (error) {
      console.error('Error consolidating data:', error);
      setConsolidationStatus(
        'An error occurred. Please check the console for details.',
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1>Admin</h1>

      <Link to="/" className={styles.backButton}>
        Back to Home
      </Link>

      <Link to="/datafix" className={styles.actionButton}>
        Migrate Old Data
      </Link>

      <button
        onClick={openConsolidateModal}
        className={styles.actionButton}
      >
        Consolidate All Data
      </button>

      <button
        onClick={openDeleteModal}
        className={styles.deleteButton}
      >
        Delete All Data
      </button>

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
                  <td>{formatDate(row.TransactionDate)}</td>
                  <td>{row['Event Name']}</td>
                  <td>{row.performanceType}</td>
                  <td>{row.totalSoldGrossValue}</td>
                  <td>{row.totalSoldTickets}</td>
                  <td>{row.totalCompTickets}</td>
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
