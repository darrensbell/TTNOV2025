# TheatreTrack® Blueprint

## Overview

TheatreTrack® is a web application designed to provide at-a-glance analytics for theatre productions. It allows users to ingest sales data from CSV files and view a dashboard with key metrics for each event.

## Project Structure

- `src/`
  - `components/`: Reusable React components.
    - `ConfirmationModal/`: A modal for confirming actions.
    - `IngestCSV/`: A component for uploading and processing CSV data.
    - `IngestionModal/`: A modal for initiating data ingestion.
  - `hooks/`: Custom React hooks.
    - `useIngestion.js`: A hook for handling data ingestion logic.
  - `main/`: The main application entry point.
    - `index.jsx`: Renders the root `App` component.
  - `pages/`: Application pages.
    - `Admin/`: The admin page for viewing raw data.
    - `App/`: The main application shell.
    - `Home/`: The home page with a list of events.
    - `Report/`: The report page with a dashboard for a specific event.
  - `services/`: Services for interacting with external APIs.
    - `firebase/`: Firebase configuration and services.
    - `ingestion.js`: Data ingestion services.
  - `styles/`: Global and component-specific styles.
    - `index.css`: Global styles.

## Implemented Changes

- **CSS Refactoring:**
  - Consolidated all CSS files into a `styles` directory.
  - Renamed CSS files to `style.module.css` for CSS Modules and `style.css` for regular CSS.
  - Updated all component import paths to reflect the new file structure.
  - Removed redundant and unused CSS files.
- **Component Path Correction:**
  - Corrected the import paths for the `Home` and `Report` components in `src/pages/App/index.jsx`.
- **App Component Fix:**
  - Fixed the `App` component to use direct class names instead of CSS modules, as it uses a regular CSS file.
  - Removed the unused `App.module.css` file.
- **Main Entry Point Fix:**
  - Corrected the import path for the global stylesheet in `src/main/index.jsx`.
