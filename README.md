# OpsPilot AI

**From Business Insights to Intelligent Action.**

**Hackathon:** PromptWars x AgentX 2.0  
**Challenge:** PS05 – AI Operations Agent for Businesses

## 1. Overview

OpsPilot AI is a full-stack business operations demo that helps businesses monitor operational data, identify inventory risks, and review suggested actions.

It combines a React frontend, FastAPI backend, and SQLite database. Its rule-based analysis identifies low-stock products and generates recommendations for human review.

## 2. Problem Statement and Chosen Vertical

**Vertical: Business Operations and Inventory Management**

Businesses can lose sales when inventory levels are not monitored and replenishment decisions are delayed. OpsPilot AI demonstrates how operational data can be analyzed to identify potential stock shortages and turn them into actionable recommendations.

## 3. Solution and Logic

The application presents seven specialized agent modules in demo mode:

- Business Analytics
- Inventory Management
- Anomaly Detection
- Workflow Planning
- Recommendation
- Action Execution
- Verification and Audit

The implemented analysis currently uses rule-based inventory logic:

1. Retrieve products from the database.
2. Compare each product's quantity with its reorder level.
3. Identify products whose quantity is at or below the reorder level.
4. Generate a high-priority reorder recommendation when one does not already exist in pending status.
5. Save the recommendations and record an audit event.

The seven modules represent the intended operations workflow; they are not seven independently running AI models.

## 4. Key Features

- Business KPI dashboard
- Inventory and stock monitoring
- Rule-based low-stock analysis
- Prioritized recommendations
- Human approval and rejection
- Simulated recommendation execution
- Audit log for decisions and actions
- SQLite demo database
- API documentation through FastAPI Swagger

## 5. Human-in-the-Loop Workflow

1. The system analyzes demo business data.
2. Recommendations are generated.
3. A human reviews and approves or rejects them.
4. Approved recommendations can proceed to simulated execution.
5. Decisions and actions are recorded in the audit log.

No real purchases, payments, or external business transactions are performed.

## 6. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP Client | Axios |
| Backend | Python, FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| API Server | Uvicorn |

## 7. Project Structure

```text
OpsPilot-AI/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   └── tests/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── data/
├── README.md
└── .gitignore
```

## 8. Getting Started

### Prerequisites

- Python 3
- Node.js and npm
- Git

### Clone