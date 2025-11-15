import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import styles from './Report.module.css';
import { FaWallet, FaTicketAlt, FaPercentage, FaClock, FaCalendarDay } from 'react-icons/fa';

const StatCard = ({ title, value, icon, footer }) => (
    <div className={`stat-card ${styles.statCard}`}>
        <div className="stat-card-title">
            <span>{title}</span>
            <div className="stat-card-icon">{icon}</div>
        </div>
        <div className="stat-card-value">{value}</div>
        {footer && <div className="stat-card-footer">{footer}</div>}
    </div>
);

function Report() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const { eventName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (eventName) {
          const salesDataCollection = collection(db, 'sales_data');
          const q = query(salesDataCollection, where('Event Name', '==', decodeURIComponent(eventName)));
          const querySnapshot = await getDocs(q);
          const firestoreData = querySnapshot.docs.map(doc => doc.data());

          let firstPerformanceDate = null;

          const calculatedSummary = firestoreData.reduce((acc, item) => {
              acc.totalBoxOffice += parseFloat(item['Sold Gross Value']) || 0;
              acc.totalTicketsSold += parseInt(item['Sold Tickets'], 10) || 0;
              acc.atpValues.push(parseFloat(item.atp) || 0);

              if (item.performanceDateTime && item.performanceDateTime.toDate) {
                const performanceDate = item.performanceDateTime.toDate();
                if (!firstPerformanceDate || performanceDate < firstPerformanceDate) {
                    firstPerformanceDate = performanceDate;
                }
              }

              return acc;
          }, { totalBoxOffice: 0, totalTicketsSold: 0, atpValues: [] });

          const overallATP = calculatedSummary.atpValues.length > 0
              ? (calculatedSummary.atpValues.reduce((a, b) => a + b, 0) / calculatedSummary.atpValues.length)
              : 0;
          
          calculatedSummary.overallATP = overallATP;

          if (firstPerformanceDate) {
            const today = new Date();
            const timeDiff = firstPerformanceDate.getTime() - today.getTime();
            calculatedSummary.daysToPerformance = Math.ceil(timeDiff / (1000 * 3600 * 24));
          }

          setSummary(calculatedSummary);
        }
      } catch (error) {
        console.error("Error fetching event data from Firestore: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventName]);

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <h1>{decodeURIComponent(eventName)}</h1>
            <p>A consolidated, at-a-glance dashboard for this Concert.</p>
        </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : summary ? (
        <div className={styles.dashboardGrid}>
            <StatCard 
                title="Total Box Office" 
                value={`£${summary.totalBoxOffice.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`}
                icon={<FaWallet />}
                footer="Lifetime Total"
            />
            <StatCard 
                title="Total Tickets Sold" 
                value={summary.totalTicketsSold.toLocaleString('en-GB')}
                icon={<FaTicketAlt />}
                footer="Lifetime Total"
            />
            <StatCard 
                title="% Occupancy" 
                value="[PLACEHOLDER]" 
                icon={<FaPercentage />}
                footer="Based on capacity"
            />
            <StatCard 
                title="Overall ATP" 
                value={`£${summary.overallATP.toFixed(2)}`}
                icon={<FaClock />}
                footer="Avg. Ticket Price"
            />
            <StatCard 
                title="Days to Performance" 
                value={summary.daysToPerformance !== undefined ? summary.daysToPerformance : 'N/A'}
                icon={<FaCalendarDay />}
                footer="Until first show"
            />
        </div>
      ) : (
        <p>No data available to generate a dashboard.</p>
      )}
    </div>
  );
}

export default Report;
