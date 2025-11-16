
import React from 'react';
import styles from './SalesSummary.module.css';

const SalesSummary = ({ title, gross, ticketsSold }) => {
  return (
    <div className={styles.salesSummary}>
      <h4>{title}</h4>
      <div className={styles.data}>
        <p>Gross: £{gross}</p>
        <p>Tickets Sold: {ticketsSold}</p>
      </div>
    </div>
  );
};

export default SalesSummary;
