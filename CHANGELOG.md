# Changelog

All notable changes to this project will be documented in this file.

## [1.2.7] - 2024-07-26

### Added
- Created a new, reusable `Modal` component for a clean pop-up experience.
- Implemented a new `ShowForm` component for adding and editing shows.
- Added a `date.js` utility to format dates consistently.
- Added new UI and accessibility rules to `GOVERNANCE.md` to enforce high contrast and prevent white text on light backgrounds.

### Changed
- Modernized the data entry experience on the "shows" page by replacing inline forms with the new modal and form components.
- Updated the "shows" page to display dates in `DD/MM/YYYY` format.
- Updated the "admin" page to display dates in the "Daily Event Summary" table in `DD/MM/YYYY` format.
- Updated `GOVERNANCE.md` to include rules for high contrast text and header styling.

## [1.2.6] - 2024-07-26

### Changed
- Formatted gross sales figures to use 'K' for thousands and 'M' for millions to save space.
- Removed decimal points from gross sales figures for a cleaner look.
- Increased the font weight of sales figures for better readability.
- Added a white glow effect to the sales summary cards.

## [1.2.0] - 2024-07-25

### Changed
- Replaced the header and footer with a persistent left sidebar for a more modern and user-friendly navigation experience.
- Fixed a layout issue where the sidebar and main content would overlap.
- Corrected the color of the database status icon and light in the sidebar to use the correct CSS variable, ensuring visual consistency.
