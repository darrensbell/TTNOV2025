import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import styles from './style.module.css';

function DataFix() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'sales'));
      const salesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setData(salesData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleUpdate = async (id, field, value) => {
    const db = getFirestore();
    const docRef = doc(db, 'sales', id);
    await updateDoc(docRef, { [field]: value });
    // Optimistically update the UI
    setData(prevData => prevData.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Fix Sales Data</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Event</th>
            <th>Price</th>
            <th>Customer</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td><input type="text" value={item.Event} onChange={e => handleUpdate(item.id, 'Event', e.target.value)} /></td>
              <td><input type="number" value={item.Price} onChange={e => handleUpdate(item.id, 'Price', e.target.value)} /></td>
              <td><input type="text" value={item.Customer} onChange={e => handleUpdate(item.id, 'Customer', e.target.value)} /></td>
              <td><input type="text" value={item.Date} onChange={e => handleUpdate(item.id, 'Date', e.target.value)} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataFix;
