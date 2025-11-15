
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.summarizeDailySales = functions.https.onCall(async (data) => {
  // If you want to limit this to run only for a specific date, you can pass it in the data object
  const dateToProcess = data ? data.date : null;

  try {
    let salesQuery = db.collection("sales_data");
    if (dateToProcess) {
      // This is a simplified example. You'd need to make sure the 'TransactionDate' field can be compared like this.
      // If 'TransactionDate' is a string in 'YYYY-MM-DD' format, this should work.
      salesQuery = salesQuery.where("TransactionDate", ">=", dateToProcess + "T00:00:00").where("TransactionDate", "<=", dateToProcess + "T23:59:59");
    }
    const snapshot = await salesQuery.get();

    if (snapshot.empty) {
      console.log("No sales data found.");
      return { result: "No sales data to process." };
    }

    const dailySummaries = {};

    snapshot.forEach(doc => {
      const sale = doc.data();
      const transactionDate = sale.TransactionDate.split('T')[0]; // Assuming ISO string format
      const eventName = sale["Event Name"];
      const performanceType = sale.performanceType;

      const key = `${transactionDate}|${eventName}|${performanceType}`;

      if (!dailySummaries[key]) {
        dailySummaries[key] = {
          TransactionDate: transactionDate,
          "Event Name": eventName,
          performanceType: performanceType,
          "Sold Gross Value": 0,
          "Sold Tickets": 0,
          "Comp Tickets": 0,
        };
      }

      dailySummaries[key]["Sold Gross Value"] += parseFloat(sale["Sold Gross Value"]) || 0;
      dailySummaries[key]["Sold Tickets"] += parseInt(sale["Sold Tickets"], 10) || 0;
      dailySummaries[key]["Comp Tickets"] += parseInt(sale["Comp Tickets"], 10) || 0;
    });

    const batch = db.batch();
    const summaryCollection = db.collection("DAILY_EVENT_SUMMARY");

    Object.keys(dailySummaries).forEach(key => {
        const summaryData = dailySummaries[key];
        // Use a consistent ID to prevent duplicate entries if the function is run multiple times
        const docId = `${summaryData.TransactionDate}_${summaryData["Event Name"]}_${summaryData.performanceType}`.replace(/[^a-zA-Z0-9_]/g, '');
        const docRef = summaryCollection.doc(docId);
        batch.set(docRef, summaryData, { merge: true });
    });

    await batch.commit();

    return { result: `Successfully created/updated ${Object.keys(dailySummaries).length} summaries.` };

  } catch (error) {
    console.error("Error summarizing daily sales:", error);
    throw new functions.https.HttpsError("internal", "Unable to summarize sales data.");
  }
});

