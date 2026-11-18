import axios from 'axios'

const api = axios.create({
  baseURL: 'https://opspilot-backend-yk8q.onrender.com',
  headers: { 'Content-Type': 'application/json' }
})

// Dashboard
export const getDashboardKpis = () => api.get('/api/dashboard/kpis').then(r => r.data)
export const getRevenueTrend = () => api.get('/api/dashboard/revenue-trend').then(r => r.data)
export const getInventoryStatus = () => api.get('/api/dashboard/inventory-status').then(r => r.data)
export const getRecentActivities = () => api.get('/api/dashboard/recent-activities').then(r => r.data)
export const getHealthScore = () => api.get('/api/dashboard/health').then(r => r.data)

// Inventory
export const getInventory = () => api.get('/api/inventory/').then(r => r.data)
export const addProduct = (data) => api.post('/api/inventory/', data).then(r => r.data)
export const updateProduct = (id, data) => api.put(`/api/inventory/${id}`, data).then(r => r.data)
export const deleteProduct = (id) => api.delete(`/api/inventory/${id}`).then(r => r.data)
export const reorderProduct = (id) => api.post(`/api/inventory/reorder/${id}`).then(r => r.data)

// Analytics
export const getAnalytics = (days = 30) => api.get(`/api/analytics/revenue?days=${days}`).then(r => r.data)
export const getOrdersTrend = (days = 30) => api.get(`/api/analytics/orders?days=${days}`).then(r => r.data)
export const getProductPerformance = () => api.get('/api/analytics/product-performance').then(r => r.data)
export const getBusinessInsights = () => api.get('/api/analytics/insights').then(r => r.data)

// Agents
export const getAgentStatus = () => api.get('/api/agents/status').then(r => r.data)
export const runAgentAnalysis = () => api.post('/api/agents/run-analysis').then(r => r.data)

// Recommendations
export const getRecommendations = (status = '') => {
  const url = status ? `/api/recommendations/?status=${status}` : '/api/recommendations/'
  return api.get(url).then(r => r.data)
}
export const approveRecommendation = (id) => api.post(`/api/recommendations/${id}/approve`).then(r => r.data)
export const rejectRecommendation = (id, reason) => api.post(`/api/recommendations/${id}/reject`, { reason }).then(r => r.data)
export const executeRecommendation = (id) => api.post(`/api/recommendations/${id}/execute`).then(r => r.data)

// Workflows
export const getWorkflows = () => api.get('/api/workflows/').then(r => r.data)

// Audit
export const getAuditLogs = () => api.get('/api/audit/').then(r => r.data)

// Settings
export const getSettings = () => api.get('/api/settings/').then(r => r.data)
export const saveGeminiKey = (key) => api.post('/api/settings/gemini-key', { api_key: key }).then(r => r.data)
export const resetDemoData = () => api.post('/api/settings/reset-demo').then(r => r.data)

export default api
