import { useState, useCallback } from 'react';
import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from '../services/firebase';
import Papa from 'papaparse';

const getErrorMessage = (error) => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    try { return JSON.stringify(error); } catch (e) { return 'An unknown error occurred.'; }
};

const parseDateTime = (dateTimeStr, fieldName, rowIndex) => {
    if (!dateTimeStr || dateTimeStr.trim() === '') {
        throw new Error(`Row ${rowIndex}: Missing required field '${fieldName}'`);
    }

    const dateTimeParts = dateTimeStr.split(' ');
    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1];

    if (!datePart || !timePart) {
        throw new Error(`Row ${rowIndex}: Invalid date format for '${fieldName}': ${dateTimeStr}. Expected 'dd/MM/yyyy HH:mm'`);
    }

    const dateSegments = datePart.split('/');
    const timeSegments = timePart.split(':');

    if (dateSegments.length !== 3 || timeSegments.length < 2) {
        throw new Error(`Row ${rowIndex}: Invalid date structure for '${fieldName}': ${dateTimeStr}.`);
    }

    const [day, month, year] = dateSegments.map(s => parseInt(s, 10));
    const [hours, minutes] = timeSegments.map(s => parseInt(s, 10));

    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes)) {
        throw new Error(`Row ${rowIndex}: Date parts are not valid numbers in '${fieldName}': ${dateTimeStr}`);
    }

    const isoDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));

    if (isNaN(isoDate.getTime())) {
        throw new Error(`Row ${rowIndex}: Could not parse a valid date for '${fieldName}' from '${dateTimeStr}'`);
    }
    return isoDate;
};


const validateAndCreateFirestoreRow = (row, rowIndex) => {
    const requiredFields = [
        'Transaction Completed Date Time',
        'Event Name',
        'Channel Name',
        'Price Band Name',
        'Performance Date Time',
        'Performance Start Time',
        'Transaction Completed At',
        'Sold Tickets',
        'Comp Tickets',
        'Sold Gross Value'
    ];

    for (const field of requiredFields) {
        if (row[field] === undefined || row[field] === null || String(row[field]).trim() === '') {
            throw new Error(`Row ${rowIndex}: Missing or empty required field '${field}'`);
        }
    }

    const transactionCompletedDateTime = parseDateTime(row['Transaction Completed Date Time'], 'Transaction Completed Date Time', rowIndex);
    const performanceDateTime = parseDateTime(row['Performance Date Time'], 'Performance Date Time', rowIndex);
    
    const transactionDate = transactionCompletedDateTime.toISOString().split('T')[0];
    const performanceDate = performanceDateTime.toISOString().split('T')[0];

    const perfStartTime = row['Performance Start Time'];
    const perfStartHour = parseInt(perfStartTime.split(':')[0], 10);
    if (isNaN(perfStartHour)) {
        throw new Error(`Row ${rowIndex}: Could not parse hour from 'Performance Start Time'. Value was '${perfStartTime}'`);
    }
    const performanceType = perfStartHour >= 17 ? 'Evening' : 'Matinee';

    const soldTickets = parseInt(row['Sold Tickets'], 10);
    if (isNaN(soldTickets)) {
        throw new Error(`Row ${rowIndex}: Invalid number for 'Sold Tickets'. Value was '${row['Sold Tickets']}'`);
    }

    const soldGrossValue = parseFloat(row['Sold Gross Value']);
    if (isNaN(soldGrossValue)) {
        throw new Error(`Row ${rowIndex}: Invalid number for 'Sold Gross Value'. Value was '${row['Sold Gross Value']}'`);
    }

    const atp = soldTickets > 0 ? soldGrossValue / soldTickets : 0;

    return {
        transactionCompletedDateTime: transactionCompletedDateTime,
        performanceDateTime: performanceDateTime,
        TransactionDate: transactionDate,
        PerformanceDate: performanceDate,
        'Event Name': row['Event Name'],
        'Channel Name': row['Channel Name'],
        'Price Band Name': row['Price Band Name'],
        'Performance Date Time': row['Performance Date Time'], // This line was missing
        'Performance Start Time': row['Performance Start Time'],
        'Transaction Completed At': row['Transaction Completed At'],
        'Sold Tickets': soldTickets,
        'Comp Tickets': parseInt(row['Comp Tickets'], 10) || 0,
        'Sold Gross Value': soldGrossValue,
        'Comp Gross Value': parseFloat(row['Comp Gross Value']) || 0,
        atp: atp,
        performanceType: performanceType,
        ingestionTime: new Date().toISOString(),
    };
};

export const useIngestion = () => {
    const [isIngesting, setIsIngesting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [ingestedCount, setIngestedCount] = useState(0);
    const [errorRows, setErrorRows] = useState([]);

    const startIngestion = useCallback((file, { onComplete, onError }) => {
        if (!file) {
            onError("Please select a file to ingest.");
            return;
        }

        setIsIngesting(true);
        setProgress(0);
        setIngestedCount(0);
        setErrorRows([]);
        
        const salesDataCollection = collection(db, 'sales_data');
        let batch = writeBatch(db);
        let rowCount = 0;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            worker: true,
            step: (results, parser) => {
                rowCount++;
                try {
                    const validatedRow = validateAndCreateFirestoreRow(results.data, rowCount);
                    const newDocRef = doc(salesDataCollection);
                    batch.set(newDocRef, validatedRow);

                    if (rowCount % 500 === 0) {
                        parser.pause();
                        batch.commit().then(() => {
                            batch = writeBatch(db);
                            setIngestedCount(prev => prev + 500);
                            parser.resume();
                        }).catch(err => {
                            parser.abort();
                            onError(`A critical error occurred while writing to the database: ${getErrorMessage(err)}`);
                        });
                    }
                } catch (error) {
                    setErrorRows(prev => [...prev, { row: rowCount, error: getErrorMessage(error), data: results.data }]);
                }

                if (results.meta.cursor && file.size) {
                    setProgress(Math.round((results.meta.cursor / file.size) * 100));
                }
            },
            complete: () => {
                 batch.commit().then(() => {
                    const finalCount = rowCount - errorRows.length;
                    setIngestedCount(finalCount);
                    setIsIngesting(false);
                    let completionMessage = `Ingestion complete. Processed ${rowCount} rows with ${finalCount} successful imports.`;
                    if (errorRows.length > 0) {
                        completionMessage += ` ${errorRows.length} rows had errors.`;
                    }
                    onComplete(completionMessage, errorRows);
                }).catch(err => {
                    setIsIngesting(false);
                    onError(`An error occurred during the final data write: ${getErrorMessage(err)}`);
                });
            },
            error: (error) => {
                setIsIngesting(false);
                onError(`An error occurred during parsing: ${getErrorMessage(error)}`);
            }
        });
    }, []);

    return { isIngesting, progress, ingestedCount, errorRows, startIngestion };
};
