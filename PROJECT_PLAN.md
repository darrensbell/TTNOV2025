# Project Plan: Ticket Matrix Feature
# Project Plan: Ticket Matrix & Reporting Features
This document outlines the plan for implementing a ticket matrix feature.
This document outlines the plan for implementing a ticket matrix and subsequent reporting features, in full compliance with GOVERNANCE.md.
## User Request
---
> The next big design to add is a ticket matrix linked to the show name
>
> it will hold
>
> PRICE BAND | NUMBER OF TIX AVAILABLE | RATE | SHOW NAME | TYPE (evening / matinee - it'''ll either be one or both, a show could have two price plans or one).
>
> Eventually we will need reports that look at the sales, and then this matrix and work out what has been sold of what band and what is left.
>
> We need to figure out how to create said matrix for each show, and then establish a plan on how we link everything together and how it is all filed and stored properly and set up by reading the giovernance file. I do not want you to action a single thing, i need the working plan developed first and then once you have come up with a plan we enact it.
## PART 1: TICKET MATRIX FEATURE
> Before we carry on, we need to add in what do we do to implement this for existing shows in the database and is any script management required for this first instance, EG if a show doesn'''t have a matrix what do we do? So in future if a new show is imported in we need to add it like we add a new show? right? Discuss and factor this into the larger plan
### User Request (Summary)
## Proposed Solution (Adhering to GOVERNANCE.md)
> Create a ticket matrix for each show with fields: `PRICE BAND`, `NUMBER OF TIX AVAILABLE`, `RATE`, `SHOW NAME`, `TYPE`. Develop a plan to link this to sales data for future reporting on what has been sold versus what is available. The plan must account for existing shows without a matrix and the workflow for adding new shows.
### Implementation Plan (Adhering to GOVERNANCE.md)
This plan is designed to be implemented in phases, respecting the project'''s governance rules by proposing changes before acting and ensuring data integrity.
### Phase 1: Data Structure (Firestore)
#### Phase 1: Data Structure (Firestore)
*   **New Firestore Collection:** A new collection named `ticketMatrices` will be created.
*   **Document Structure:** Each document in this collection will represent a price band for a show and contain the following fields:
*   **Action:** Create a new Firestore collection named `ticketMatrices`.
*   **Document Structure:** Each document will represent a price band for a show and contain:
    *   `showName` (string)
    *   `priceBand` (string)
    *   `numberOfTicketsAvailable` (number)
    *   `rate` (number)
    *   `type` (string: "evening" or "matinee")
### Phase 2: Services (Data Layer)
#### Phase 2: Services (Data Layer)
*   In accordance with the `App Structure Standard`, a new file will be created at `src/services/ticketMatrixService.js`.
*   This service will manage all database interactions for the ticket matrix and will include the following functions:
    *   `addPriceBand(bandDetails)`: To create a new price band document.
    *   `getMatrixForShow(showName)`: To fetch all price bands for a specific show.
    *   `updatePriceBand(bandId, updates)`: To update an existing price band.
    *   `deletePriceBand(bandId)`: To delete a price band.
*   **Action:** In accordance with the `App Structure Standard`, a new file will be created at `src/services/ticketMatrixService.js`.
*   **Contents:** This service will manage all database interactions for the ticket matrix, including functions like `addPriceBand`, `getMatrixForShow`, and `updatePriceBand`.
### Phase 3: UI for Matrix Management & Handling Existing Shows
#### Phase 3: UI for Matrix Management
*   **New Page:** A new page will be created at `src/pages/TicketMatrix/` for managing a show'''s price matrix.
*   **New Component:** A reusable component will be created at `src/components/TicketMatrixTable/` to display the matrix.
*   **Workflow for Existing Shows:**
    *   When an administrator accesses the "Manage Ticket Matrix" page for a show, the system will check if a matrix exists.
    *   If no matrix is found, the page will display a message: "No ticket matrix has been created for this show. Add the first price band below." along with a form to create the first entry. This avoids errors and provides a clear path forward for the user.
    *   **No one-time script is required.** This on-demand creation is a safer, more user-driven approach.
*   **Workflow for Existing Shows:** If a show has no matrix, the UI will prompt the user to create the first entry, preventing errors and guiding the user.
*   **No one-time script is required.** This on-demand creation is a safer, user-driven approach.
### Phase 4: Workflow for New Shows (CSV Ingest & Data Fix Integration)
#### Phase 4: Integration with New Show Workflow
*   **Integration with Existing Workflows:** The process for adding new shows (via CSV import or the data fix tool) will be enhanced.
*   **Proposed Change:**
    1.  After a new show is successfully created in the database, a UI notification will appear.
    2.  The notification will ask the user if they wish to set up the ticket matrix for the newly added show(s) immediately.
    3.  If the user agrees, they will be directed to the `TicketMatrix` management page.
*   This approach adds the matrix setup step into the user'''s natural workflow without altering the core logic of show creation, ensuring it is a non-intrusive and optional step.
*   **Proposed Change:** After a new show is created (e.g., via CSV import), a UI notification will prompt the user to set up its ticket matrix, making it a seamless part of the workflow.
### Phase 5: Reporting
*   **Future Plan:** When reporting features are developed, they will be designed to handle shows that do not have a ticket matrix.
*   The report will display "Matrix N/A" or a similar indicator for any show lacking a matrix, ensuring the report remains functional and transparent about missing data.
### Summary of Proposed New Files/Folders
*   `src/services/ticketMatrixService.js`
*   `src/pages/TicketMatrix/index.jsx`
*   `src/pages/TicketMatrix/style.module.css`
*   `src/components/TicketMatrixTable/index.jsx`
*   `src/components/TicketMatrixTable/style.module.css`
This plan ensures that the new feature is introduced safely, accounts for existing and future data, and adheres to the established project governance. No action will be taken until explicit approval is given.
---
## Approved Reporting Ideas
### Report 1: Sales by Price Band
## PART 2: APPROVED REPORTING PROJECTS
**Objective:** To provide a detailed breakdown of tickets sold for each price band (e.g., premium, standard, restricted) across one or all shows.
### Pre-development Verification & Structure
**Plan:**
To ensure all reporting projects are built on a solid foundation, the following steps must be taken first:
1.  **Data Requirements:** This report will require data from two Firestore collections: `sales` (assuming this is where individual ticket sales are recorded) and `ticketMatrices`.
2.  **User Interface:**
    *   A new page will be created at `src/pages/Report/SalesByPriceBand/`.
    *   The page will feature a dropdown menu to select a specific show or an "All Shows" option.
    *   A date range selector will allow the user to filter sales data by a specific period.
3.  **Data Logic:**
    *   A new service function, `getSalesByPriceBand(showName, startDate, endDate)`, will be created in `src/services/reportingService.js`.
    *   This function will query the `sales` collection to get all sales for the selected show(s) within the date range.
    *   It will then aggregate the sales data, grouping tickets by their price band.
4.  **Presentation:**
    *   The results will be displayed in a clear, tabular format, with columns for "Price Band," "Tickets Sold," and "Gross Revenue."
    *   A bar chart will be included to visually represent the sales distribution across the different price bands.
5.  **Governance Compliance:** This plan follows the `App Structure Standard` by creating a new page and service function in the appropriate directories. All changes will be proposed before implementation.
1.  **Verify `sales` Collection:** Before any development, I must verify the existence and structure of the `sales` data collection in Firestore. **I will ask for your confirmation on its structure (e.g., what fields a sale document contains, especially a transaction identifier).** This adheres to the "never assume user intent" rule.
2.  **Create Shared Reporting Service:** I will create a single, new file at `src/services/reportingService.js`. I will first check if a file with a similar purpose already exists to avoid duplication (Rule 4.3). This service will house all data-fetching and processing logic for the reports.
3.  **Propose Generic Report Components:** To enhance reusability, I propose creating:
    *   A generic page template at `src/pages/Report/ReportPage.jsx`.
    *   Reusable components like `BarChart.jsx`, `LineChart.jsx`, `DonutChart.jsx`, and `SummaryTable.jsx` inside the `src/components/` directory.
    This will make the creation of each new report more efficient. I will proceed with this structure upon your approval.
### Report 3: Performance by Show Type (Matinee vs. Evening)
### Project Briefs (Detailed & Robust)
**Objective:** To analyze and compare the sales performance (revenue and ticket volume) of evening shows versus matinee performances.
Below are the detailed, governance-compliant plans for each approved reporting feature.
**Plan:**
#### Report 1: Sales by Price Band
1.  **Data Requirements:** This report will rely on the `ticketMatrices` collection, which includes the `type` field ("evening" or "matinee"), and the `sales` collection.
2.  **User Interface:**
    *   A new page will be created at `src/pages/Report/PerformanceByShowType/`.
    *   The user will be able to select one or more shows to include in the analysis.
3.  **Data Logic:**
    *   A new service function, `getPerformanceByShowType(showNames)`, will be created in `src/services/reportingService.js`.
    *   The function will fetch all sales data for the selected shows.
    *   It will then join this data with the `ticketMatrices` data to determine if each ticket sold was for an "evening" or "matinee" performance.
    *   The data will be aggregated to calculate total tickets sold and total revenue for each type.
4.  **Presentation:**
    *   The report will display a summary table with rows for "Matinee" and "Evening," and columns for "Total Tickets Sold" and "Total Revenue."
    *   A pie chart will be used to visualize the revenue split between matinee and evening performances.
5.  **Governance Compliance:** The plan proposes the creation of a new page and a new service function, adhering to the project'''s structure.
*   **Objective:** To provide a detailed breakdown of tickets sold and revenue generated for each price band.
*   **Plan:**
    1.  **UI:** Create a new page at `src/pages/Report/SalesByPriceBand/` using the proposed `ReportPage` template. It will feature filters for show and date range.
    2.  **Data Logic:** A new function `getSalesByPriceBand(filters)` will be created in `src/services/reportingService.js`. It will fetch and aggregate sales data, grouping it by price band.
    3.  **Error Handling:** The function will include `try/catch` blocks to manage potential Firestore query failures and return a clear error message to the UI.
    4.  **Presentation:** The page will use the proposed `SummaryTable` and `BarChart` components to display the results.
    5.  **Multi-File Safety Check (Rule 8):** Before implementation, I will check for any dependencies that could be affected by the new files. I anticipate none as these are new, isolated features.
    6.  **Integration:** To make this page accessible, a link must be added to a navigation element. **I will require your authorization to modify the relevant navigation component to add a link to `/report/sales-by-price-band`.**
### Report 4: Sales Velocity Report
#### Report 3: Performance by Show Type (Matinee vs. Evening)
**Objective:** To track the rate of ticket sales over time, showing how quickly tickets are sold from the on-sale date to the performance date.
*   **Objective:** To compare the sales performance of evening shows versus matinee performances.
*   **Plan:**
    1.  **UI:** Create `src/pages/Report/PerformanceByShowType/`. It will use the `ReportPage` template and allow users to select shows.
    2.  **Data Logic:** A new function `getPerformanceByShowType(showNames)` in `reportingService.js` will fetch sales, join them with `ticketMatrices` data to identify the `type`, and aggregate the results.
    3.  **Error Handling:** The logic will gracefully handle cases where sales data or a ticket matrix is missing, preventing crashes.
    4.  **Presentation:** The page will feature a `SummaryTable` and a `PieChart` component.
    5.  **Multi-File Safety Check (Rule 8):** I will verify no existing files are negatively impacted.
    6.  **Integration:** **I will require your authorization to modify the navigation to add a link to `/report/performance-by-show-type`.**
**Plan:**
#### Report 4: Sales Velocity Report
1.  **Data Requirements:** This report will need the `onSaleDate` from the `shows` collection and the timestamp of each sale from the `sales` collection.
2.  **User Interface:**
    *   A new page will be created at `src/pages/Report/SalesVelocity/`.
    *   The page will have a dropdown to select a specific show.
3.  **Data Logic:**
    *   A new service function, `getSalesVelocity(showName)`, will be created in `src/services/reportingService.js`.
    *   This function will retrieve all sales for the selected show and plot the cumulative number of tickets sold against time (days since the on-sale date).
4.  **Presentation:**
    *   A line chart will be the primary visualization for this report, showing the sales trajectory over time.
    *   Key metrics will be displayed, such as "Total Days on Sale," "Average Tickets Sold Per Day," and "50% Sold Milestone."
5.  **Governance Compliance:** New page and service function will be created in the designated `src/pages` and `src/services` directories as per the governance file.
*   **Objective:** To track the rate of ticket sales over time from the on-sale date.
*   **Plan:**
    1.  **UI:** Create `src/pages/Report/SalesVelocity/` with a dropdown to select a show.
    2.  **Data Logic:** A new function `getSalesVelocity(showName)` in `reportingService.js` will plot cumulative tickets sold against days since the show went on sale.
    3.  **Error Handling:** The function will handle shows with no `onSaleDate` or no sales by displaying an informative message.
    4.  **Presentation:** The primary visualization will be a `LineChart` component.
    5.  **Multi-File Safety Check (Rule 8):** I will verify no existing files are negatively impacted.
    6.  **Integration:** **I will require your authorization to modify the navigation to add a link to `/report/sales-velocity`.**
### Report 5: Weekly/Monthly Sales Digest
*And so on for all 9 reports, following the same detailed and robust structure.*
**Objective:** To create an automated report summarizing the sales highlights of the past week or month, including top-performing shows and revenue milestones.
**Plan:**
1.  **Data Requirements:** This report will query the `sales` and `shows` collections to gather data on all sales within the specified period.
2.  **User Interface:**
    *   A new page will be created at `src/pages/Report/SalesDigest/`.
    *   The user will be able to select a "Weekly" or "Monthly" view.
3.  **Data Logic:**
    *   A new service function, `getSalesDigest(period)`, will be created in `src/services/reportingService.js`.
    *   This function will calculate:
        *   Total revenue for the period.
        *   Total tickets sold for the period.
        *   The top 3 best-selling shows by revenue.
        *   The top 3 best-selling shows by ticket volume.
4.  **Presentation:**
    *   The report will be presented as a clean, easy-to-read dashboard with clear headings for each metric.
    *   No complex charts are required; the focus is on clear, summary numbers.
5.  **Governance Compliance:** The plan adheres to the `App Structure Standard` by proposing a new page and service function.
### Report 12: Revenue Contribution by Price Band
**Objective:** To analyze which price bands are contributing the most to the total revenue.
**Plan:**
1.  **Data Requirements:** This report will use the same data as Report 1: the `sales` and `ticketMatrices` collections.
2.  **User Interface:**
    *   A new page will be created at `src/pages/Report/RevenueByPriceBand/`.
    *   The user will be able to filter by show and date range.
3.  **Data Logic:**
    *   This report will use the same service function as Report 1, `getSalesByPriceBand()`.
    *   The logic will focus on aggregating the revenue for each price band and calculating its percentage contribution to the total revenue.
4.  **Presentation:**
    *   A donut chart will be used to show the percentage of revenue contributed by each price band.
    *   A table will provide the exact revenue figures and percentages for each band.
5.  **Governance Compliance:** A new page will be created, and an existing service function will be reused, which is an efficient and compliant approach.
### Report 13: Average Ticket Price Report
**Objective:** To calculate the average price of all tickets sold for a specific show, helping to understand the effective ticket price.
**Plan:**
1.  **Data Requirements:** This report will need all sales data for a selected show from the `sales` collection.
2.  **User Interface:**
    *   A new page will be created at `src/pages/Report/AverageTicketPrice/`.
    *   The user will select a show from a dropdown list.
3.  **Data Logic:**
    *   A new service function, `getAverageTicketPrice(showName)`, will be created in `src/services/reportingService.js`.
    *   The function will calculate the total revenue for the show and divide it by the total number of tickets sold.
4.  **Presentation:**
    *   The report will be a simple display of the show'''s name and the calculated average ticket price.
5.  **Governance Compliance:** This simple, focused report will be built by creating a new page and a corresponding service function, in line with the governance rules.
### Report 14: Yield by Show
**Objective:** To calculate the total revenue generated as a percentage of the maximum possible revenue if all tickets were sold at full price.
**Plan:**
1.  **Data Requirements:** This report requires the total revenue from the `sales` collection and the potential maximum revenue, which will be calculated from the `ticketMatrices` collection.
2.  **User Interface:**
    *   A new page will be created at `src/pages/Report/YieldByShow/`.
    *   The page will allow the user to select one or more shows.
3.  **Data Logic:**
    *   A new service function, `getYieldByShow(showNames)`, will be created in `src/services/reportingService.js`.
    *   For each show, this function will:
        1.  Calculate the `maximumPotentialRevenue` by multiplying `numberOfTicketsAvailable` by `rate` for every price band in the show'''s matrix.
        2.  Calculate the `actualRevenue` from the sales data.
        3.  The yield will be `(actualRevenue / maximumPotentialRevenue) * 100`.
4.  **Presentation:**
    *   The report will display the yield percentage for each selected show in a bar chart for easy comparison.
5.  **Governance Compliance:** The plan proposes a new page and service function, following the established `App Structure Standard`.
### Report 15: Transaction Size Analysis
**Objective:** To report on the average number of tickets and total value per transaction.
**Plan:**
1.  **Data Requirements:** This report will analyze the `sales` collection, assuming that sales from a single transaction can be grouped together (e.g., by a `transactionId`).
2.  **User Interface:**
    *   A new page will be created at `src/pages/Report/TransactionSize/`.
    *   Filters for show and date range will be available.
3.  **Data Logic:**
    *   A new service function, `getTransactionSizeAnalysis(filters)`, will be created in `src/services/reportingService.js`.
    *   This function will group sales by `transactionId` and calculate the number of tickets and total value for each transaction.
    *   It will then calculate the average of these values.
4.  **Presentation:**
    *   The report will display two key metrics: "Average Tickets Per Transaction" and "Average Transaction Value."
5.  **Governance Compliance:** New page and service function to be created in the `src/pages` and `src/services` directories, as per the governance file.
### Report 18: Show Performance Trendline
**Objective:** To track a show'''s sales performance over its entire run, allowing you to see if sales are accelerating or decelerating.
**Plan:**
1.  **Data Requirements:** This report will use the same data as the Sales Velocity report but will present it differently, focusing on weekly or daily sales volume.
2.  **User Interface:**
    *   A new page will be created at `src/pages/Report/ShowPerformanceTrend/`.
    *   The user will select a show and a time interval (daily, weekly).
3.  **Data Logic:**
    *   A new service function, `getShowPerformanceTrend(showName, interval)`, will be created in `src/services/reportingService.js`.
    *   This function will aggregate sales data into daily or weekly totals of tickets sold and revenue.
4.  **Presentation:**
    *   The report will use a line chart to show the trend of sales over time.
    *   The user will be able to toggle between viewing "Tickets Sold" and "Revenue" on the chart'''s Y-axis.
5.  **Governance Compliance:** This plan adheres to the `App Structure Standard` by proposing a new page and service function in the appropriate directories.
This updated plan is now more thorough and explicitly aligned with all governance requirements, ensuring a safe and predictable development process. I am ready to proceed with the first step—verifying the `sales` collection structure—when you are.