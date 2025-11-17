import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import styles from './style.module.css';
import Modal from '../../components/Modal/Modal.jsx';
import ShowForm from '../../components/ShowForm/ShowForm.jsx';
import { formatDate } from '../../utils/date'; // Import the new function

function Show() {
  const [shows, setShows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);

  const fetchShows = async () => {
    const querySnapshot = await getDocs(collection(db, 'shows'));
    const showsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setShows(showsData);
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleOpenModalForNew = () => {
    setEditingShow(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (show) => {
    setEditingShow(show);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingShow(null);
  };

  const handleSubmit = async (formData) => {
    if (editingShow) {
      // Update existing show
      const showRef = doc(db, 'shows', editingShow.id);
      await updateDoc(showRef, formData);
    } else {
      // Add new show
      await addDoc(collection(db, 'shows'), formData);
    }
    fetchShows();
    handleCloseModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Shows</h1>
        <button className={styles.addButton} onClick={handleOpenModalForNew}>Add New Show</button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingShow ? 'Edit Show' : 'Add a New Show'}
      >
        <ShowForm 
          initialData={editingShow}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Show Name</th>
              <th>Type</th>
              <th>Time</th>
              <th>First Show Date</th>
              <th>On Sale Date</th>
              <th>Tickets Available</th>
              <th>BO Gross Potential</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((show) => (
              <tr key={show.id}>
                <td>{show.name}</td>
                <td>{show.performanceType}</td>
                <td>{show.performanceTime}</td>
                <td>{formatDate(show.firstShowDate)}</td>
                <td>{formatDate(show.onSaleDate)}</td>
                <td>{show.ticketsAvailable}</td>
                <td>{show.boxOfficeGrossPotential}</td>
                <td>
                  <button className={styles.editButton} onClick={() => handleOpenModalForEdit(show)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Show;
