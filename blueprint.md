# TheatreTrack Analytics Dashboard Blueprint

## 1. Project Overview

**Purpose:** To create a modern, at-a-glance analytics dashboard for theatre productions, mirroring the "TheatreTrack" branding and focusing on key performance indicators (KPIs) and summary statistics rather than raw data dumps.

**Core Capabilities:**
- **Home Dashboard:** Display a grid of "event cards," each representing a different show with high-level summary data.
- **Event-Specific Dashboard:** A detailed view for each event, showcasing critical metrics like Total Box Office, Tickets Sold, Occupancy, and Average Ticket Price (ATP) in visually distinct stat cards.
- **Modern UI/UX:** A dark-themed, responsive interface with clear typography, intuitive navigation, and icon-based indicators, based on the provided design images.
- **Scalable & Maintainable:** Built on a clean React foundation with component-based architecture and clear routing.

---

## 2. Implemented Features & Design

This section will be updated as features are implemented.

*   **Initial Setup (Previous session):**
    *   Basic React app structure with Vite.
    *   Firebase integration for data fetching (`sales_data` collection).
    *   `react-router-dom` for navigation.
    *   A simple home page with clickable cards for each event.
    *   A basic detail page showing raw data for a selected event.

---

## 3. Current Plan: Rebrand and Refactor to "TheatreTrack"

This plan outlines the steps to transform the existing application into the "TheatreTrack" dashboard, aligning with the provided images and brand identity.

### Step 1: Establish Global Branding and Styles
-   **Action:** Update the main CSS file (`index.css`) to establish the dark theme.
-   **Details:** Implement the core color palette (dark backgrounds, accent colors), set the primary font, and define global styles for a consistent look and feel.
-   **Action:** Redesign the main navigation bar in `App.jsx`.
-   **Details:** Replicate the "TheatreTrack" logo and navigation button style (Home, Ingest CSV, Settings).

### Step 2: Redesign the Home Page Dashboard
-   **Action:** Refactor the `Home` page component (`src/pages/Home/index.jsx`).
-   **Details:**
    -   Fetch summary data for each event (e.g., total gross, occupancy).
    -   Redesign the event cards to match the provided image, including fields for event name, concert type, gross revenue, and occupancy/ATP.
    -   Incorporate icons (`react-icons`) for a polished look.

### Step 3: Create the Event Summary Dashboard
-   **Action:** Overhaul the `Report` page component (`src/pages/Report/index.jsx`).
-   **Details:**
    -   Replace the raw data table with a high-level summary dashboard.
    -   Create a grid of "stat cards" for key metrics: Total Box Office, Total Tickets Sold, % Occupancy, Overall ATP, etc.
    -   Implement the calculation logic for these summary statistics based on the full dataset for the selected event.
    -   Style the cards and typography to precisely match the "Jamie Muscato" example dashboard.

### Step 4: Iterative Refinement and Error Checking
-   **Action:** Continuously lint, format, and test throughout the development process.
-   **Details:** After each major change, I will check for console errors, visual bugs, and data inconsistencies, ensuring the application remains stable and accurate.
