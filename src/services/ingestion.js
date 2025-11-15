import { parse, isValid } from 'date-fns';

// A safer date parser that returns null for invalid or empty inputs.
const parseDate = (dateString, fieldName) => {
    if (!dateString) {
        throw new Error(`Field '${fieldName}' is empty.`);
    }
    const formats = [
        'dd/MM/yyyy HH:mm:ss',
        'dd/MM/yyyy H:mm:ss',
        'dd/MM/yyyy HH:mm',
        'dd/MM/yyyy H:mm',
        'MM/dd/yyyy HH:mm:ss',
        'MM/dd/yyyy H:mm',
        'yyyy-MM-dd HH:mm:ss',
        'yyyy-MM-ddTHH:mm:ss',
        'yyyy-MM-dd',
    ];
    for (const format of formats) {
        try {
            const parsedDate = parse(dateString, format, new Date());
            if (isValid(parsedDate)) {
                return parsedDate;
            }
        } catch (e) { /* try next format */ }
    }
    throw new Error(`Could not understand the date '${dateString}' in field '${fieldName}'.`);
};

// A strict validator for a single row.
export const validateAndCreateFirestoreRow = (row) => {
    const newRow = {};
    const errors = [];

    // Trim keys and check for undefined/empty values
    const requiredFields = [
        'Transaction Completed Date Time',
        'Event Name',
        'Channel Name',
        'Price Band Name',
        'Performance Date Time',
        'Sold Tickets',
        'Comp Tickets',
        'Sold Gross Value'
    ];

    const trimmedRow = {};
    for (const key in row) {
        trimmedRow[key.trim()] = row[key];
    }

    requiredFields.forEach(field => {
        const value = trimmedRow[field];
        if (value === null || value === undefined || value === '') {
            errors.push(`Field '${field}' is empty.`);
        }
    });

    if (errors.length > 0) {
        throw new Error(errors.join(' '));
    }

    // If all required fields are present, process them
    const transactionDate = parseDate(trimmedRow['Transaction Completed Date Time'], 'Transaction Completed Date Time');
    const performanceDate = parseDate(trimmedRow['Performance Date Time'], 'Performance Date Time');
    
    let performanceType = null;
    if (performanceDate) {
        const hour = performanceDate.getHours();
        performanceType = hour >= 17 ? 'Evening' : 'Matinee';
    }

    const soldGrossValue = parseFloat(trimmedRow['Sold Gross Value']);
    const soldTickets = parseInt(trimmedRow['Sold Tickets'], 10);

    if (isNaN(soldGrossValue)) {
        throw new Error('Field \'Sold Gross Value\' is not a valid number.');
    }
    if (isNaN(soldTickets)) {
        throw new Error('Field \'Sold Tickets\' is not a valid number.');
    }

    let atp = 0;
    if (soldTickets > 0) {
        atp = soldGrossValue / soldTickets;
    }

    return {
        ...trimmedRow,
        ingestionTime: new Date().toISOString(),
        TransactionDate: transactionDate.toISOString().split('T')[0],
        PerformanceDate: performanceDate.toISOString().split('T')[0],
        performanceType: performanceType,
        atp: atp,
    };
};