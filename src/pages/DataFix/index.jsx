import { useState, useEffect } from 'react';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import styles from './style.module.css';

function DataFix() {
  const [unlinkedShows, setUnlinkedShows] = useState([]);
  const [unlinkedSales, setUnlinkedSales] = useState([]);
  const [showDetails, setShowDetails] = useState({});
  const [migrationStatus, setMigrationStatus] = useState('');

  useEffect(() => {
    const findUnlinkedEvents = async () => {
      setMigrationStatus('Scanning for unlinked sales data...');
      const salesSnapshot = await getDocs(collection(db, 'sales_data'));
      const salesData = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const unlinkedSalesData = salesData.filter(sale => !sale.showId);
      setUnlinkedSales(unlinkedSalesData);

      if (unlinkedSalesData.length === 0) {
        setMigrationStatus('All sales data is already linked to a show.');
        return;
      }

      const showsToCreate = {};

      for (const sale of unlinkedSalesData) {
        const eventName = sale['Event Name'];
        const perfType = sale.performanceType;
        const perfTime = sale['Performance Time']; // Correctly reference Performance Time
        const perfDate = sale['Performance Date']; // Correctly reference Performance Date
        const showKey = `${eventName} - ${perfType}`;

        if (!showsToCreate[showKey]) {
          showsToCreate[showKey] = {
            name: eventName,
            performanceType: perfType,
            performanceTime: perfTime,
            onSaleDate: sale.TransactionDate,
            firstShowDate: perfDate,
          };
        } else {
          if (sale.TransactionDate && new Date(sale.TransactionDate) < new Date(showsToCreate[showKey].onSaleDate)) {
            showsToCreate[showKey].onSaleDate = sale.TransactionDate;
          }
          if (perfDate && new Date(perfDate) < new Date(showsToCreate[showKey].firstShowDate)) {
            showsToCreate[showKey].firstShowDate = perfDate;
          }
        }
      }

      const showsSnapshot = await getDocs(collection(db, 'shows'));
      const existingShowNames = showsSnapshot.docs.map(d => `${d.data().name} - ${d.data().performanceType}`);

      const finalShowsToCreate = Object.values(showsToCreate).filter(show => !existingShowNames.includes(`${show.name} - ${show.performanceType}`));

      if (finalShowsToCreate.length === 0 && unlinkedSalesData.length > 0) {
        setMigrationStatus('All shows are created, but some sales data is not linked. Please run the migration to link them.');
      } else if (finalShowsToCreate.length === 0) {
         setMigrationStatus('All sales data is linked to a show. No migration needed.');
         return;
      }

      const initialDetails = {};
      finalShowsToCreate.forEach(show => {
        const key = `${show.name} - ${show.performanceType}`;
        initialDetails[key] = {
          name: show.name,
          performanceType: show.performanceType,
          performanceTime: show.performanceTime,
          firstShowDate: show.firstShowDate,
          onSaleDate: show.onSaleDate,
          ticketsAvailable: '',
          boxOfficeGrossPotential: '',
        };
      });

      setUnlinkedShows(finalShowsToCreate);
      setShowDetails(initialDetails);
      setMigrationStatus('');
    };

    findUnlinkedEvents();
  }, []);

  const handleDetailChange = (showKey, field, value) => {
    setShowDetails(prev => ({
      ...prev,
      [showKey]: {
        ...prev[showKey],
        [field]: value,
      },
    }));
  };

  const handleMigrateData = async () => {
    setMigrationStatus('Migration in progress... This may take a moment.');
    const newShowRefs = {};

    const createShowsBatch = writeBatch(db);
    for (const show of unlinkedShows) {
        const showKey = `${show.name} - ${show.performanceType}`;
        const showData = showDetails[showKey];
        const newShowRef = doc(collection(db, 'shows'));
        createShowsBatch.set(newShowRef, {
            name: show.name,
            performanceType: show.performanceType,
            performanceTime: showData.performanceTime,
            firstShowDate: showData.firstShowDate,
            onSaleDate: showData.onSaleDate,
            ticketsAvailable: showData.ticketsAvailable,
            boxOfficeGrossPotential: showData.boxOfficeGrossPotential
        });
        newShowRefs[showKey] = newShowRef;
    }
    await createShowsBatch.commit();

    const newShowIds = {};
    for (const key in newShowRefs) {
        newShowIds[key] = newShowRefs[key].id;
    }

    const updateSalesBatch = writeBatch(db);
    for (const sale of unlinkedSales) {
        const showKey = `${sale['Event Name']} - ${sale.performanceType}`;
        const showId = newShowIds[showKey];
        if (showId) {
            const saleRef = doc(db, 'sales_data', sale.id);
            updateSalesBatch.update(saleRef, { showId });
        }
    }

    await updateSalesBatch.commit();

    setMigrationStatus('Data migration complete! All sales have been linked.');
    setUnlinkedShows([]);
  };

  return (
    <div className={styles.container}>
      <h1>Data Migration: Link Sales to Shows</h1>
      {migrationStatus && <p><strong>{migrationStatus}</strong></p>}

      {unlinkedShows.length > 0 ? (
        <div>
          <p>The following shows were found in your sales data but do not exist in the database. We've pre-filled the date information. Please provide the remaining details and click migrate.</p>
          {unlinkedShows.map(show => {
            const showKey = `${show.name} - ${show.performanceType}`;
            return (
              <div key={showKey} className={styles.showForm}>
                <h3>{show.name} ({show.performanceType})</h3>
                <div className={styles.readOnlyField}>
                    <strong>Performance Time:</strong> {showDetails[showKey]?.performanceTime}
                </div>
                <div className={styles.readOnlyField}>
                    <strong>On Sale Date (earliest transaction):</strong> {showDetails[showKey]?.onSaleDate}
                </div>
                 <div className={styles.readOnlyField}>
                    <strong>First Show Date (performance date):</strong> {showDetails[showKey]?.firstShowDate}
                </div>
                <input
                  type="number"
                  placeholder="Tickets Available"
                  value={showDetails[showKey]?.ticketsAvailable || ''}
                  onChange={(e) => handleDetailChange(showKey, 'ticketsAvailable', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Box Office Gross Potential"
                  value={showDetails[showKey]?.boxOfficeGrossPotential || ''}
                  onChange={(e) => handleDetailChange(showKey, 'boxOfficeGrossPotential', e.target.value)}
                />
              </div>
            )
          })}
          <button onClick={handleMigrateData}>Migrate Data</button>
        </div>
      ) : (
        !migrationStatus.includes('Scanning') && <p>All sales data is linked to a show. No migration needed.</p>
      )}
    </div>
  );
}

export default DataFix;
