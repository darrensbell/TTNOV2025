# Project Structure

This document outlines the file and folder structure of the TheatreTrack application.

## File Tree

```
.
├── GOVERNANCE.md
├── README.md
├── blueprint.md
├── eslint.config.js
├── file-tree.md
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── functions
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── index.html
├── package-lock.json
├── package.json
├── public
│   ├── index.html
│   ├── run-summary.html
│   ├── run-summary.js
│   └── vite.svg
├── src
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── CompanyOverview
│   │   │   ├── index.jsx
│   │   │   └── style.module.css
│   │   ├── ConfirmationModal
│   │   │   ├── ConfirmationModal.module.css
│   │   │   └── index.jsx
│   │   ├── EventCard
│   │   │   ├── index.jsx
│   │   │   └── style.module.css
│   │   ├── Footer
│   │   │   ├── Footer.module.css
│   │   │   └── index.jsx
│   │   ├── IngestionModal
│   │   │   ├── IngestionModal.module.css
│   │   │   └── index.jsx
│   │   ├── Logo
│   │   │   ├── index.jsx
│   │   │   └── style.css
│   │   ├── Sidebar
│   │   │   ├── Sidebar.module.css
│   │   │   └── index.jsx
│   │   ├── SidebarButton
│   │   │   ├── SidebarButton.module.css
│   │   │   ├── button.module.css
│   │   │   └── index.jsx
│   │   └── UpdateDBModal
│   │       ├── UpdateDBModal.module.css
│   │       └── index.jsx
│   ├── features
│   │   ├── DataFix
│   │   │   └── index.jsx
│   │   ├── IngestCSV
│   │   │   ├── index.jsx
│   │   │   └── style.module.css
│   │   └── IngestionModal
│   │       ├── IngestionModal.module.css
│   │       └── index.jsx
│   ├── hooks
│   │   └── useIngestion.js
│   ├── index.css
│   ├── main.jsx
│   ├── pages
│   │   ├── Admin
│   │   │   ├── index.jsx
│   │   │   └── style.module.css
│   │   ├── App
│   │   │   ├── index.jsx
│   │   │   └── style.css
│   │   ├── DataFix
│   │   │   ├── index.jsx
│   │   │   └── style.module.css
│   │   ├── Home
│   │   │   ├── index.jsx
│   │   │   └── style.module.css
│   │   ├── Report
│   │   │   ├── index.jsx
│   │   │   └── style.module.css
│   │   └── Show
│   │       ├── index.jsx
│   │       └── style.module.css
│   ├── services
│   │   ├── firebase
│   │   │   └── index.js
│   │   └── ingestion.js
│   └── styles
│       ├── components
│       │   └── button.css
│       ├── components.css
│       ├── index.css
│       └── variables.css
├── storage.rules
└── vite.config.js
```

## Mermaid Diagram

```mermaid
graph TD
    A[TheatreTrack] --> B(src);
    B --> C(components);
    C --> D(CompanyOverview);
    C --> E(ConfirmationModal);
    C --> F(EventCard);
    C --> G(Footer);
    C --> H(IngestionModal);
    C --> I(Logo);
    C --> J(Sidebar);
    C --> K(SidebarButton);
    C --> L(UpdateDBModal);
    B --> M(features);
    M --> N(DataFix);
    M --> O(IngestCSV);
    M --> P(IngestionModal);
    B --> Q(hooks);
    Q --> R(useIngestion.js);
    B --> S(pages);
    S --> T(Admin);
    S --> U(App);
    S --> V(DataFix);
    S --> W(Home);
    S --> X(Report);
    S --> Y(Show);
    B --> Z(services);
    Z --> AA(firebase);
    Z --> AB(ingestion.js);
    B --> AC(styles);
```
