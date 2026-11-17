import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from "./layouts/MainLayout.jsx";
import OverviewPage from './pages/OverviewPage.jsx'
import AIOperationsPage from './pages/AIOperationsPage.jsx'
import InventoryPage from './pages/InventoryPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import RecommendationsPage from './pages/RecommendationsPage.jsx'
import WorkflowsPage from './pages/WorkflowsPage.jsx'
import AuditLogPage from './pages/AuditLogPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/overview" replace />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="ai-operations" element={<AIOperationsPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="workflows" element={<WorkflowsPage />} />
        <Route path="audit-log" element={<AuditLogPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
