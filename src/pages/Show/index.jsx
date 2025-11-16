import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import styles from './style.module.css';

function Show() {
  const [shows, setShows] = useState([]);
  const [newShow, setNewShow] = useState({
    name: '',
    performanceType: '',
    performanceTime: '',
    firstShowDate: '',
    onSaleDate: '',
    ticketsAvailable: '',
    boxOfficeGrossPotential: '',
  });
  const [editingShow, setEditingShow] = useState(null);

  const fetchShows = async () => {
    const querySnapshot = await getDocs(collection(db, 'shows'));
    const showsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setShows(showsData);
  };

  useEffect(() => {
    fetchShows();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShow(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddShow = async () => {
    if (!newShow.name) return; // Basic validation
    await addDoc(collection(db, 'shows'), newShow);
    setNewShow({
        name: '',
        performanceType: '',
        performanceTime: '',
        firstShowDate: '',
        onSaleDate: '',
        ticketsAvailable: '',
        boxOfficeGrossPotential: '',
    });
    fetchShows();
  };

  const handleEdit = (show) => {
    setEditingShow({ ...show });
  };

  const handleUpdateShow = async () => {
    if (!editingShow) return;
    const showRef = doc(db, 'shows', editingShow.id);
    await updateDoc(showRef, editingShow);
    setEditingShow(null);
    fetchShows();
  };

  return (
    <div className={styles.container}>
      <h1>Manage Shows</h1>

      <div className={styles.form}>
        <h2>Add a New Show</h2>
        <input
          type="text"
          name="name"
          placeholder="Show Name"
          value={newShow.name}
          onChange={handleInputChange}
        />
         <input
          type="text"
          name="performanceType"
          placeholder="Performance Type (e.g., Matinee, Evening)"
          value={newShow.performanceType}
          onChange={handleInputChange}
        />
         <input
          type="text"
          name="performanceTime"
          placeholder="Performance Time (e.g., 2:00 PM)"
          value={newShow.performanceTime}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="firstShowDate"
          value={newShow.firstShowDate}
          onChange={handleInputChange}
        />
        <input
          type="date"
          name="onSaleDate"
          value={newShow.onSaleDate}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="ticketsAvailable"
          placeholder="Tickets Available"
          value={newShow.ticketsAvailable}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="boxOfficeGrossPotential"
          placeholder="Box Office Gross Potential"
          value={newShow.boxOfficeGrossPotential}
          onChange={handleInputChange}
        />
        <button onClick={handleAddShow}>Add Show</button>
      </div>

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
                <td>{show.firstShowDate}</td>
                <td>{show.onSaleDate}</td>
                <td>{show.ticketsAvailable}</td>
                <td>{show.boxOfficeGrossPotential}</td>
                <td>
                  <button onClick={() => handleEdit(show)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingShow && (
        <div className={styles.modal}>
          <h2>Edit Show</h2>
           <input
            type="text"
            name="name"
            value={editingShow.name}
            onChange={(e) => setEditingShow({ ...editingShow, name: e.target.value })}
          />
            <input
            type="text"
            name="performanceType"
            value={editingShow.performanceType}
            onChange={(e) => setEditingShow({ ...editingShow, performanceType: e.target.value })}
            />
            <input
            type="text"
            name="performanceTime"
            value={editingShow.performanceTime}
            onChange={(e) => setEditingShow({ ...editingShow, performanceTime: e.target.value })}
            />
          <input
            type="date"
            name="firstShowDate"
            value={editingShow.firstShowDate}
            onChange={(e) => setEditingShow({ ...editingShow, firstShowDate: e.target.value })}
          />
          <input
            type="date"
            name="onSaleDate"
            value={editingShow.onSaleDate}
            onChange={(e) => setEditingShow({ ...editingShow, onSaleDate: e.target.value })}
          />
          <input
            type="number"
            name="ticketsAvailable"
            value={editingShow.ticketsAvailable}
            onChange={(e) => setEditingShow({ ...editingShow, ticketsAvailable: e.g.target.value })}
          />
          <input
            type="number"
            name="boxOfficeGrossPotential"
            value={editingShow.boxOfficeGrossPotential}
            onChange={(e) => setEditingShow({ ...editingShow, boxOfficeGrossPotential: e.target.value })}
          />
          <button onClick={handleUpdateShow}>Update</button>
          <button onClick={() => setEditingShow(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Show;
