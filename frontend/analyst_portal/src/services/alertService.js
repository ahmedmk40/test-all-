import apiClient from './apiClient';

// Alert service for managing and monitoring alerts
const alertService = {
  // Get all alerts with optional filtering
  getAllAlerts: async (filters = {}) => {
    try {
      const response = await apiClient.get('/alerts', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific alert by ID
  getAlert: async (alertId) => {
    try {
      const response = await apiClient.get(`/alerts/${alertId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get alert details including all related information
  getAlertDetails: async (alertId) => {
    try {
      const response = await apiClient.get(`/alerts/${alertId}/details`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get related transactions for an alert
  getAlertTransactions: async (alertId) => {
    try {
      const response = await apiClient.get(`/alerts/${alertId}/transactions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update alert status
  updateAlertStatus: async (alertId, statusData) => {
    try {
      const response = await apiClient.put(`/alerts/${alertId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Assign alert to analyst
  assignAlert: async (alertId, assignmentData) => {
    try {
      const response = await apiClient.post(`/alerts/${alertId}/assign`, assignmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Add a note to an alert
  addAlertNote: async (alertId, noteData) => {
    try {
      const response = await apiClient.post(`/alerts/${alertId}/notes`, noteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get alert notes
  getAlertNotes: async (alertId) => {
    try {
      const response = await apiClient.get(`/alerts/${alertId}/notes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a case from an alert
  createCaseFromAlert: async (alertId, caseData) => {
    try {
      const response = await apiClient.post(`/alerts/${alertId}/create-case`, caseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Close an alert
  closeAlert: async (alertId, resolutionData) => {
    try {
      const response = await apiClient.post(`/alerts/${alertId}/close`, resolutionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get alert statistics
  getAlertStatistics: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/alerts/statistics', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get alert volume by time period
  getAlertVolume: async (timeRange = {}, groupBy = 'day') => {
    try {
      const response = await apiClient.get('/alerts/volume', { 
        params: { ...timeRange, group_by: groupBy } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get alert distribution by type
  getAlertDistributionByType: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/alerts/distribution/type', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get alert distribution by status
  getAlertDistributionByStatus: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/alerts/distribution/status', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default alertService;
