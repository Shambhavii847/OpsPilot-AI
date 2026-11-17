# OpsPilot AI 🚀

**From Business Insights to Intelligent Action.**

**Hackathon:** PromptWars x AgentX 2.0  
**Challenge:** PS05 – AI Operations Agent for Businesses

## Overview

OpsPilot AI is a local, full-stack business operations platform built for the PromptWars x AgentX 2.0 hackathon.

It demonstrates a multi-agent operations workflow that analyzes business data, identifies operational issues, generates actionable recommendations, and supports human-approved actions.

The application uses a React frontend, FastAPI backend, and SQLite database.

## Problem Statement

Businesses often struggle with fragmented operational data, manual KPI monitoring, inventory issues, and delayed responses to unusual business patterns.

OpsPilot AI demonstrates how intelligent automation can help transform business data into useful operational insights.

## Solution

OpsPilot AI uses seven specialized agent modules to support business operations:

- Business Analytics
- Inventory Management
- Anomaly Detection
- Workflow Planning
- Recommendation
- Action Execution
- Verification and Audit

The application includes a human-in-the-loop approval process. Actions in the demo environment are simulated locally and require approval before execution.

## Key Features

- **Multi-Agent Architecture:** Seven specialized operational agent modules.
- **Business Dashboard:** KPIs, revenue trends, and business health indicators.
- **Inventory Management:** Product and stock monitoring.
- **Business Analytics:** Revenue and product performance insights.
- **Anomaly Detection:** Rule-based identification of operational issues.
- **Recommendations:** Prioritized business recommendations.
- **Human Approval:** Approval and rejection of pending recommendations.
- **Audit Trail:** Records decisions and simulated actions.
- **Local Demo Mode:** Runs locally using SQLite and sample data.
- **No API Key Required:** Rule-based functionality works without an external AI service.

## Multi-Agent Architecture

```text
             OpsPilot AI
             Orchestrator
                  |
       +----------+----------+
       |          |          |
   Business   Inventory   Anomaly
  Analytics  Management  Detection
       |          |          |
       +----------+----------+
                  |
           Workflow Planning
                  |
            Recommendation
                  |
          HUMAN APPROVAL
                  |
          Action Execution
                  |
          Verification
             & Audit
```

## Technology Stack

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

## Project Structure

```text
OpsPilot-AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   └── services/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .venv/
│   └── opspilot.db
│
├── data/
├── README.md
├── run_local.bat
└── stop_local.bat
```

## Getting Started (macOS)

### Prerequisites

- Python 3
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone YOUR_PUBLIC_GITHUB_REPOSITORY_URL
cd OpsPilot-AI
```

Replace the placeholder URL with your actual repository URL.

### 2. Start the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python main.py
```

The backend runs at:

http://127.0.0.1:8000

Keep this terminal open.

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the application:

http://localhost:5173

## API Documentation

FastAPI Swagger documentation:

http://127.0.0.1:8000/docs

Health check:

http://127.0.0.1:8000/api/health

## Application Pages

| Page | Description |
|---|---|
| Overview | Business KPIs and dashboard |
| AI Operations | Seven-agent operations control center |
| Inventory | Product and stock management |
| Analytics | Revenue and product performance |
| Recommendations | Human approval workflow |
| Workflows | Operational workflow overview |
| Audit Log | Decision and action history |
| Settings | Application settings and demo reset |

## Human-in-the-Loop Safety

OpsPilot AI demonstrates human oversight through its recommendation workflow.

1. Agents analyze the available demo data.
2. The system generates recommendations.
3. A human reviews and approves or rejects recommendations.
4. Only approved recommendations can proceed to simulated execution.
5. Actions and decisions are recorded in the audit log.

**No real purchases, payments, or external business transactions are performed.**

## Demo Data

The application initializes sample business data in its local SQLite database.

To reset the demo data, use the Settings page and select **Reset Demo Data**.

## Testing API Endpoints

Check backend health:

```bash
curl http://127.0.0.1:8000/api/health
```

Check dashboard KPIs:

```bash
curl http://127.0.0.1:8000/api/dashboard/kpis
```

Run agent analysis:

```bash
curl -X POST http://127.0.0.1:8000/api/agents/run-analysis
```

## Future Improvements

- Gemini-powered natural-language insights
- Advanced machine-learning anomaly detection
- Email and Slack notifications
- Multi-user authentication
- Real supplier integrations
- PDF and Excel report exports
- Role-based access control

## License

MIT License.

Built with ❤️ using Google Antigravity, React, FastAPI, and SQLite.

**OpsPilot AI — From Business Insights to Intelligent Action.**
