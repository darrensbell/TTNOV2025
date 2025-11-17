import { useState, useEffect } from 'react';
import styles from './ShowForm.module.css';

function ShowForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    performanceType: '',
    performanceTime: '',
    firstShowDate: '',
    onSaleDate: '',
    ticketsAvailable: '',
    boxOfficeGrossPotential: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset form if no initial data
      setFormData({
        name: '',
        performanceType: '',
        performanceTime: '',
        firstShowDate: '',
        onSaleDate: '',
        ticketsAvailable: '',
        boxOfficeGrossPotential: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <fieldset className={styles.fieldset}>
        <legend>Show Details</legend>
        <div className={styles.formRow}>
          <label htmlFor="name">Show Name</label>
          <input id="name" type="text" name="name" placeholder="e.g., Les Misérables" value={formData.name} onChange={handleChange} required />
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Performance Schedule</legend>
        <div className={styles.formGrid}>
          <div className={styles.formRow}>
            <label htmlFor="performanceType">Type</label>
            <input id="performanceType" type="text" name="performanceType" placeholder="e.g., Evening, Matinee" value={formData.performanceType} onChange={handleChange} />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="performanceTime">Time</label>
            <input id="performanceTime" type="text" name="performanceTime" placeholder="e.g., 7:30 PM" value={formData.performanceTime} onChange={handleChange} />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="firstShowDate">First Show Date</label>
            <input id="firstShowDate" type="date" name="firstShowDate" value={formData.firstShowDate} onChange={handleChange} />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="onSaleDate">On Sale Date</label>
            <input id="onSaleDate" type="date" name="onSaleDate" value={formData.onSaleDate} onChange={handleChange} />
          </div>
        </div>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend>Ticketing Information</legend>
        <div className={styles.formGrid}>
          <div className={styles.formRow}>
            <label htmlFor="ticketsAvailable">Tickets Available</label>
            <input id="ticketsAvailable" type="number" name="ticketsAvailable" placeholder="e.g., 500" value={formData.ticketsAvailable} onChange={handleChange} />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="boxOfficeGrossPotential">BO Gross Potential</label>
            <input id="boxOfficeGrossPotential" type="number" name="boxOfficeGrossPotential" placeholder="e.g., 25000" value={formData.boxOfficeGrossPotential} onChange={handleChange} />
          </div>
        </div>
      </fieldset>
      
      <div className={styles.actions}>
        <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
        <button type="submit" className={styles.submitButton}>{initialData ? 'Update Show' : 'Add Show'}</button>
      </div>
    </form>
  );
}

export default ShowForm;
