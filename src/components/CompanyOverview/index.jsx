import React from 'react';
import styles from './style.module.css';
import { FaHome, FaPoundSign, FaTicketAlt, FaRegCalendarAlt } from 'react-icons/fa';

// CompanyOverview component to display key company stats
const CompanyOverview = ({ stats }) => {
    return (
        <div className={styles.overviewCard}>
            <div className={styles.header}>
                <FaHome className={styles.icon} />
                <h2 className={styles.title}>Company Overview</h2>
            </div>
            <div className={styles.statsGrid}>
                <div className={styles.stat}>
                    <div className={styles.statTitle}><FaPoundSign /> Total Revenue</div>
                    <div className={styles.statValue}>£{stats.totalRevenue.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statTitle}><FaTicketAlt /> Global ATP</div>
                    <div className={styles.statValue}>£{stats.avgAtp.toFixed(2)}</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statTitle}><FaRegCalendarAlt /> Tickets Sold</div>
                    <div className={styles.statValue}>{stats.totalTicketsSold.toLocaleString('en-GB')}</div>
                </div>
                <div className={styles.stat}>
                    <div className={styles.statTitle}><FaRegCalendarAlt /> Tickets Remaining</div>
                    <div className={styles.statValue}>{stats.ticketsRemaining.toLocaleString('en-GB')}</div>
                </div>
            </div>
        </div>
    );
};

export default CompanyOverview;
