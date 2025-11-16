import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import styles from './style.module.css';
import { FaWallet, FaTicketAlt, FaPercentage, FaClock, FaCalendarDay, FaHistory } from 'react-icons/fa';

const StatCard = ({ title, value, icon, footer }) => (
    <div className={styles.statCard}>
        <div className={styles['stat-card-title']}>
            <span>{title}</span>
            <div className={styles['stat-card-icon']}>{icon}</div>
        </div>
        <div className={styles['stat-card-value']}>{value}</div>
        {footer && <div className={styles['stat-card-footer']}>{footer}</div>}
    </div>
);

function Report() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Stats');
  const { eventName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (eventName) {
          const decodedEventName = decodeURIComponent(eventName);

          const salesDataCollection = collection(db, 'sales_data');
          const salesQuery = query(salesDataCollection, where('Event Name', '==', decodedEventName));
          const salesQuerySnapshot = await getDocs(salesQuery);
          const firestoreData = salesQuerySnapshot.docs.map(doc => doc.data());

          const showsCollection = collection(db, 'shows');
          const showQuery = query(showsCollection, where('name', '==', decodedEventName));
          const showQuerySnapshot = await getDocs(showQuery);
          
          let totalTicketsAvailable = 0;
          if (!showQuerySnapshot.empty) {
            showQuerySnapshot.docs.forEach(showDoc => {
                totalTicketsAvailable += parseInt(showDoc.data().ticketsAvailable, 10) || 0;
            });
          }

          let firstPerformanceDate = null;

          const calculatedSummary = firestoreData.reduce((acc, item) => {
              acc.totalBoxOffice += parseFloat(item['Sold Gross Value']) || 0;
              acc.totalTicketsSold += parseInt(item['Sold Tickets'], 10) || 0;
              acc.atpValues.push(parseFloat(item.atp) || 0);

              if (item.PerformanceDate) {
                const performanceDate = new Date(item.PerformanceDate);
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

          const occupancy = (totalTicketsAvailable > 0)
            ? ((calculatedSummary.totalTicketsSold / totalTicketsAvailable) * 100).toFixed(1) + '%'
            : 'N/A';

          const ticketsRemaining = totalTicketsAvailable - calculatedSummary.totalTicketsSold;

          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayDateString = yesterday.toISOString().split('T')[0];

          const dailySummaryCollection = collection(db, 'daily_event_summary');
          const yesterdaySummaryQuery = query(
            dailySummaryCollection,
            where('Event Name', '==', decodedEventName),
            where('TransactionDate', '==', yesterdayDateString)
          );
          const yesterdaySummarySnapshot = await getDocs(yesterdaySummaryQuery);

          let lastDayTotalBoxOffice = 0;
          let lastDayTotalTicketsSold = 0;
          const lastDayAtpValues = [];

          if (!yesterdaySummarySnapshot.empty) {
            yesterdaySummarySnapshot.docs.forEach(doc => {
              const data = doc.data();
              lastDayTotalBoxOffice += parseFloat(data.totalSoldGrossValue) || 0;
              lastDayTotalTicketsSold += parseInt(data.totalSoldTickets, 10) || 0;
              const currentATP = (parseFloat(data.totalSoldTickets) > 0)
                ? (parseFloat(data.totalSoldGrossValue) / parseFloat(data.totalSoldTickets))
                : 0;
              if (currentATP > 0) lastDayAtpValues.push(currentATP);
            });
          }

          const lastDayOverallATP = lastDayAtpValues.length > 0
            ? (lastDayAtpValues.reduce((a, b) => a + b, 0) / lastDayAtpValues.length)
            : 0;

          calculatedSummary.lastDayBoxOffice = lastDayTotalBoxOffice;
          calculatedSummary.lastDayTicketsSold = lastDayTotalTicketsSold;
          calculatedSummary.lastDayOverallATP = lastDayOverallATP;

          setSummary({ ...calculatedSummary, occupancy, totalTicketsAvailable, ticketsRemaining });
        }
      } catch (error) {
        console.error("Error fetching event data from Firestore: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventName]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Stats':
        return (
          <div className={styles.dashboardGrid}>
            <div className={styles.rowTop}>
                <StatCard 
                    title="Total Box Office" 
                    value={`£${summary.totalBoxOffice.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`}
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
                    value={summary.occupancy}
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
                    title="Tickets Remaining"
                    value={summary.ticketsRemaining.toLocaleString('en-GB')}
                    icon={<FaTicketAlt />}
                    footer="Across all shows"
                />
            </div>
            <div className={styles.rowBottom}>
                <StatCard 
                    title="Days to Performance" 
                    value={summary.daysToPerformance !== undefined ? summary.daysToPerformance : 'N/A'}
                    icon={<FaCalendarDay />}
                    footer="Until first show"
                />
                <StatCard 
                    title="Last Day Gross" 
                    value={`£${summary.lastDayBoxOffice.toLocaleString('en-GB', { maximumFractionDigits: 0 })}`}
                    icon={<FaWallet />}
                    footer="Yesterday's Sales"
                />
                <StatCard 
                    title="Last Day Tickets" 
                    value={summary.lastDayTicketsSold.toLocaleString('en-GB')}
                    icon={<FaTicketAlt />}
                    footer="Yesterday's Sales"
                />
                <StatCard 
                    title="Last Day ATP" 
                    value={`£${summary.lastDayOverallATP.toFixed(2)}`}
                    icon={<FaClock />}
                    footer="Yesterday's Sales"
                />
            </div>
        </div>
        );
      case 'Charts':
        return <div>Charts Content</div>;
      case 'AI Deep Dive':
        return <div>AI Deep Dive Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <h1>{decodeURIComponent(eventName)}</h1>
            <p>A consolidated, at-a-glance dashboard for this Concert.</p>
        </div>

        <div className={styles.tabs}>
            <button 
                className={`${styles.tabButton} ${activeTab === 'Stats' ? styles.active : ''}`}
                onClick={() => setActiveTab('Stats')}
            >
                Stats
            </button>
            <button 
                className={`${styles.tabButton} ${activeTab === 'Charts' ? styles.active : ''}`}
                onClick={() => setActiveTab('Charts')}
            >
                Charts
            </button>
            <button 
                className={`${styles.tabButton} ${activeTab === 'AI Deep Dive' ? styles.active : ''}`}
                onClick={() => setActiveTab('AI Deep Dive')}
            >
                AI Deep Dive
            </button>
        </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : summary ? (
        renderTabContent()
      ) : (
        <p>No data available to generate a dashboard.</p>
      )}
    </div>
  );
}

export default Report;
