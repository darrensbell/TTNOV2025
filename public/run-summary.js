document.addEventListener('DOMContentLoaded', function() {
  const runButton = document.getElementById('runButton');
  const statusDiv = document.getElementById('status');

  runButton.addEventListener('click', async () => {
    runButton.disabled = true;
    statusDiv.textContent = 'Processing... Please wait.';

    try {
      const db = firebase.firestore();
      const salesSnapshot = await db.collection('sales').get();
      const salesByDay = {};

      salesSnapshot.forEach(doc => {
        const sale = doc.data();
        const saleDate = sale.createdAt.toDate();
        const dateString = saleDate.toISOString().split('T')[0]; // YYYY-MM-DD

        if (!salesByDay[dateString]) {
          salesByDay[dateString] = {
            total: 0,
            saleIds: []
          };
        }

        salesByDay[dateString].total += sale.total;
        salesByDay[dateString].saleIds.push(doc.id);
      });

      const batch = db.batch();
      for (const dateString in salesByDay) {
        const summaryRef = db.collection('dailySummaries').doc(dateString);
        batch.set(summaryRef, salesByDay[dateString]);
      }

      await batch.commit();
      statusDiv.textContent = 'Successfully generated daily sales summaries!';
    } catch (error) {
      console.error('Error generating sales summary:', error);
      statusDiv.textContent = 'An error occurred. Please check the console for details.';
    } finally {
      runButton.disabled = false;
    }
  });
});
