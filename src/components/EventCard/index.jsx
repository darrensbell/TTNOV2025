import React from 'react';
import { Link } from 'react-router-dom';
import styles from './style.module.css';
import { FaPoundSign, FaTicketAlt, FaCalendarAlt, FaHourglassHalf } from 'react-icons/fa';

const EventCard = ({ event }) => {
    return (
        <Link to={`/report/${encodeURIComponent(event.name)}`} className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>{event.name}</h2>
                <p>CONCERT</p>
            </div>
            <div className={styles.cardBody}>
                <div className={styles.stat}>
                    <FaPoundSign />
                    <span className={styles.totalGross}>{event.totalGross.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                </div>
                <div className={styles.stat}>
                    <FaTicketAlt />
                    <span>{event.avgAtp > 0 ? `£${event.avgAtp.toFixed(2)}` : 'N/A'}</span>
                </div>
                <div className={styles.stat}>
                    <FaCalendarAlt />
                    <span>{event.firstShowDate}</span>
                </div>
                <div className={styles.stat}>
                    <FaHourglassHalf />
                    <span>{event.daysToShow >= 0 ? `${event.daysToShow} days to go` : 'Show has passed'}</span>
                </div>
            </div>
            <div className={styles.cardFooter}>
                <span>View Dashboard</span>
            </div>
        </Link>
    );
};

export default EventCard;
