import React, { useState } from 'react';
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from '../services/firebase';

const DataFix = () => {
    const [status, setStatus] = useState('Idle.');
    const [processedCount, setProcessedCount] = useState(0);
    const [updatedCount, setUpdatedCount] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const fixData = async () => {
        setIsRunning(true);
        setStatus('Starting data fix...');
        let processed = 0;
        let updated = 0;

        try {
            const salesDataCollectionRef = collection(db, 'sales_data');
            const querySnapshot = await getDocs(salesDataCollectionRef);
            
            let batch = writeBatch(db);
            let batchCount = 0;

            setStatus(`Found ${querySnapshot.size} documents. Processing...`);

            for (const docSnapshot of querySnapshot.docs) {
                processed++;
                const data = docSnapshot.data();

                if (!data['Performance Date Time'] && data.PerformanceDate && data['Performance Start Time']) {
                    const performanceDate = data.PerformanceDate; // format: YYYY-MM-DD
                    const performanceStartTime = data['Performance Start Time']; // format: HH:mm:ss or similar

                    const [year, month, day] = performanceDate.split('-');
                    
                    const newPerformanceDateTime = `${day}/${month}/${year} ${performanceStartTime}`;
                    
                    batch.update(docSnapshot.ref, {
                        'Performance Date Time': newPerformanceDateTime
                    });
                    
                    batchCount++;
                    updated++;
                }

                if (batchCount >= 490) {
                    await batch.commit();
                    batch = writeBatch(db);
                    setUpdatedCount(prev => prev + batchCount);
                    batchCount = 0;
                    setStatus(`Committed a batch. Scanned ${processed} documents so far...`);
                }
            }

            if (batchCount > 0) {
                await batch.commit();
                setUpdatedCount(prev => prev + batchCount);
            }

            setStatus(`Data fix complete. Scanned ${processed} documents and updated ${updated} of them.`);

        } catch (error) {
            console.error("Error fixing data:", error);
            setStatus(`An error occurred: ${error.message}`);
        } finally {
            setIsRunning(false);
            setProcessedCount(processed);
        }
    };

    return (
        <div style={{ padding: '20px', margin: '20px auto', border: '2px solid #f44336', borderRadius: '8px', maxWidth: '800px', backgroundColor: '#fff5f5' }}>
            <h2 style={{ color: '#f44336' }}>Temporary Data Correction Tool</h2>
            <p>
                This tool will scan all records in the database. If a record is missing the <strong>'Performance Date Time'</strong> field, it will construct it using the 'PerformanceDate' and 'Performance Start Time' fields.
            </p>
            <p>This is a one-time operation to fix the data I previously corrupted. Click the button below to start the process.</p>
            <button 
                onClick={fixData} 
                disabled={isRunning}
                style={{ 
                    backgroundColor: isRunning ? '#ccc' : '#4CAF50', 
                    color: 'white', 
                    padding: '10px 20px', 
                    border: 'none', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
            >
                {isRunning ? 'Fixing Data...' : 'Fix Missing Performance Dates'}
            </button>
            <div style={{ marginTop: '20px', fontFamily: 'monospace' }}>
                <p><strong>Status:</strong> {status}</p>
                <p>Documents Scanned: {processedCount}</p>
                <p>Documents Updated: {updatedCount}</p>
            </div>
        </div>
    );
};

export default DataFix;
