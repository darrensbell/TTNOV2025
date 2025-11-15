import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import styles from './style.module.css';
import { FaHome, FaPoundSign, FaTicketAlt } from 'react-icons/fa';

function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const salesDataCollection = collection(db, 'sales_data');
        const querySnapshot = await getDocs(salesDataCollection);
        const firestoreData = querySnapshot.docs.map(doc => doc.data());

        const eventsData = firestoreData.reduce((acc, item) => {
            const eventName = item['Event Name'];
            if (!acc[eventName]) {
                acc[eventName] = {
                    name: eventName,
                    totalGross: 0,
                    atpValues: [],
                };
            }
            acc[eventName].totalGross += parseFloat(item['Sold Gross Value']) || 0;
            acc[eventName].atpValues.push(parseFloat(item.atp) || 0);
            return acc;
        }, {});

        const eventsSummary = Object.values(eventsData).map(event => {
            const avgAtp = event.atpValues.length > 0
                ? (event.atpValues.reduce((a, b) => a + b, 0) / event.atpValues.length)
                : 0;
            return {
                name: event.name,
                totalGross: event.totalGross,
                avgAtp: avgAtp,
            };
        });

        setEvents(eventsSummary);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events from Firestore: ", error);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className={styles.cardContainer}>
          <div className={`${styles.card} ${styles.overviewCard}`}>
            <div className={styles.overviewContent}>
                <FaHome className={styles.overviewIcon} />
                <h2>Company Overview</h2>
                <p>REPORT</p>
            </div>
            <div className={styles.cardFooter}>
                <span>View Dashboard</span>
            </div>
          </div>
          {events.map(event => (
            <Link to={`/report/${encodeURIComponent(event.name)}`} key={event.name} className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>{event.name}</h2>
                <p>CONCERT</p>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.stat}>
                    <FaPoundSign />
                    <span>{event.totalGross.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className={styles.stat}>
                    <FaTicketAlt />
                    <span>{event.avgAtp > 0 ? `£${event.avgAtp.toFixed(2)}` : 'N/A'}</span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <span>View Dashboard</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
