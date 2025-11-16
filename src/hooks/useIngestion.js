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

    // Attempt to parse standard ISO format first (e.g., from previous processing)
    let parsedDate = new Date(dateTimeStr);
    if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
    }

    // Fallback to custom parsing for DD/MM/YYYY HH:MM:SS or YYYY-MM-DD HH:MM:SS
    const dateTimeParts = dateTimeStr.split(' ');
    const datePart = dateTimeParts[0];
    const timePart = dateTimeParts[1];

    if (!datePart || !timePart) {
        throw new Error(`Row ${rowIndex}: Invalid date/time format for '${fieldName}': ${dateTimeStr}. Expected 'DD/MM/YYYY HH:MM:SS' or 'YYYY-MM-DD HH:MM:SS'.`);
    }

    let day, month, year, hours, minutes, seconds = 0;

    // Detect date format
    if (datePart.includes('/')) { // DD/MM/YYYY
        const dateSegments = datePart.split('/');
        if (dateSegments.length !== 3) {
            throw new Error(`Row ${rowIndex}: Invalid date structure for '${fieldName}': ${datePart}. Expected DD/MM/YYYY.`);
        }
        [day, month, year] = dateSegments.map(s => parseInt(s, 10));
    } else if (datePart.includes('-')) { // YYYY-MM-DD
        const dateSegments = datePart.split('-');
        if (dateSegments.length !== 3) {
            throw new Error(`Row ${rowIndex}: Invalid date structure for '${fieldName}': ${datePart}. Expected YYYY-MM-DD.`);
        }
        [year, month, day] = dateSegments.map(s => parseInt(s, 10));
    } else {
        throw new Error(`Row ${rowIndex}: Unrecognized date format for '${fieldName}': ${datePart}.`);
    }

    const timeSegments = timePart.split(':');
    if (timeSegments.length >= 2) {
        [hours, minutes] = timeSegments.map(s => parseInt(s, 10));
        if (timeSegments.length === 3) {
            seconds = parseInt(timeSegments[2], 10);
        }
    } else {
        throw new Error(`Row ${rowIndex}: Invalid time structure for '${fieldName}': ${timePart}. Expected HH:MM or HH:MM:SS.`);
    }

    if (isNaN(day) || isNaN(month) || isNaN(year) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
        throw new Error(`Row ${rowIndex}: Date/Time parts are not valid numbers in '${fieldName}': ${dateTimeStr}`);
    }

    // Month is 0-indexed in JavaScript Date constructor
    const finalDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds));

    if (isNaN(finalDate.getTime())) {
        throw new Error(`Row ${rowIndex}: Could not parse a valid date/time for '${fieldName}' from '${dateTimeStr}'`);
    }
    return finalDate;
};

export const validateAndCreateFirestoreRow = (row, rowIndex) => {
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

    let transactionCompletedDateTime;
    let performanceDateTime;
    let transactionDate = null; 
    let performanceDate = null; 
    let performanceType = null; 
    let atp = 0; 
    let soldTickets = 0;
    let soldGrossValue = 0;
    let compTickets = 0;
    let compGrossValue = 0;

    try {
        transactionCompletedDateTime = parseDateTime(row['Transaction Completed Date Time'], 'Transaction Completed Date Time', rowIndex);
        transactionDate = transactionCompletedDateTime.toISOString().split('T')[0];
    } catch (e) {
        throw new Error(`Row ${rowIndex}: Error processing 'Transaction Completed Date Time': ${e.message}`);
    }

    try {
        performanceDateTime = parseDateTime(row['Performance Date Time'], 'Performance Date Time', rowIndex);
        performanceDate = performanceDateTime.toISOString().split('T')[0];
    } catch (e) {
        throw new Error(`Row ${rowIndex}: Error processing 'Performance Date Time': ${e.message}`);
    }

    // Derive performanceType from 'Performance Start Time'
    const perfStartTimeStr = String(row['Performance Start Time']).trim();
    if (perfStartTimeStr) {
        const timeParts = perfStartTimeStr.split(':');
        if (timeParts.length >= 2) {
            const perfStartHour = parseInt(timeParts[0], 10);
            if (!isNaN(perfStartHour)) {
                performanceType = perfStartHour >= 17 ? 'Evening' : 'Matinee';
            } else {
                throw new Error(`Row ${rowIndex}: Could not parse hour from 'Performance Start Time'. Value was '${perfStartTimeStr}'`);
            }
        } else {
            throw new Error(`Row ${rowIndex}: Invalid format for 'Performance Start Time'. Expected HH:MM or HH:MM:SS. Value was '${perfStartTimeStr}'`);
        }
    } else {
        throw new Error(`Row ${rowIndex}: Missing or invalid 'Performance Start Time'. Value was '${perfStartTimeStr}'`);
    }

    // Parse Sold Tickets
    soldTickets = parseInt(row['Sold Tickets'], 10);
    if (isNaN(soldTickets)) {
        throw new Error(`Row ${rowIndex}: Invalid number for 'Sold Tickets'. Value was '${row['Sold Tickets']}'`);
    }

    // Parse Sold Gross Value
    soldGrossValue = parseFloat(row['Sold Gross Value']);
    if (isNaN(soldGrossValue)) {
        throw new Error(`Row ${rowIndex}: Invalid number for 'Sold Gross Value'. Value was '${row['Sold Gross Value']}'`);
    }

    // Parse Comp Tickets (default to 0 if not a number or missing)
    compTickets = parseInt(row['Comp Tickets'], 10) || 0;

    // Parse Comp Gross Value (optional, default to 0 if not a number or missing)
    compGrossValue = parseFloat(row['Comp Gross Value']) || 0;

    atp = soldTickets > 0 ? soldGrossValue / soldTickets : 0;

    // Return a complete and valid object
    return {
        transactionCompletedDateTime: transactionCompletedDateTime,
        performanceDateTime: performanceDateTime,
        TransactionDate: transactionDate, 
        PerformanceDate: performanceDate, 
        'Event Name': row['Event Name'],
        'Channel Name': row['Channel Name'],
        'Price Band Name': row['Price Band Name'],
        'Performance Date Time': row['Performance Date Time'], 
        'Performance Start Time': row['Performance Start Time'], 
        'Transaction Completed At': row['Transaction Completed At'],
        'Sold Tickets': soldTickets,
        'Comp Tickets': compTickets,
        'Sold Gross Value': soldGrossValue,
        'Comp Gross Value': compGrossValue,
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
