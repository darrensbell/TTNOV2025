
import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const useSalesData = () => {
  const [totalGross, setTotalGross] = useState(0);
  const [totalTicketsSold, setTotalTicketsSold] = useState(0);
  const [yesterdayGross, setYesterdayGross] = useState(0);
  const [yesterdayTicketsSold, setYesterdayTicketsSold] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'daily_event_summary'));
      const querySnapshot = await getDocs(q);
      let totalGross = 0;
      let totalTicketsSold = 0;
      let yesterdayGross = 0;
      let yesterdayTicketsSold = 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalGross += data.totalSoldGrossValue;
        totalTicketsSold += data.totalSoldTickets;

        const transactionDate = new Date(data.TransactionDate);
        if (transactionDate.getTime() >= yesterday.getTime() && transactionDate.getTime() < today.getTime()) {
          yesterdayGross += data.totalSoldGrossValue;
          yesterdayTicketsSold += data.totalSoldTickets;
        }
      });

      setTotalGross(totalGross);
      setTotalTicketsSold(totalTicketsSold);
      setYesterdayGross(yesterdayGross);
      setYesterdayTicketsSold(yesterdayTicketsSold);
    };

    fetchData();
  }, []);

  return { totalGross, totalTicketsSold, yesterdayGross, yesterdayTicketsSold };
};

export default useSalesData;
