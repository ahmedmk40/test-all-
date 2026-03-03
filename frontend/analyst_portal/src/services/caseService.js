import apiClient from './apiClient';

// Case service for managing fraud cases
const caseService = {
  // Get all cases with optional filtering
  getAllCases: async (filters = {}) => {
    try {
      const response = await apiClient.get('/cases', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific case by ID
  getCase: async (caseId) => {
    try {
      const response = await apiClient.get(`/cases/${caseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new case
  createCase: async (caseData) => {
    try {
      const response = await apiClient.post('/cases', caseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing case
  updateCase: async (caseId, caseData) => {
    try {
      const response = await apiClient.put(`/cases/${caseId}`, caseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get case details including all related information
  getCaseDetails: async (caseId) => {
    try {
      const response = await apiClient.get(`/cases/${caseId}/details`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get related transactions for a case
  getCaseTransactions: async (caseId) => {
    try {
      const response = await apiClient.get(`/cases/${caseId}/transactions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get related alerts for a case
  getCaseAlerts: async (caseId) => {
    try {
      const response = await apiClient.get(`/cases/${caseId}/alerts`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update case status
  updateCaseStatus: async (caseId, statusData) => {
    try {
      const response = await apiClient.put(`/cases/${caseId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Assign case to analyst
  assignCase: async (caseId, assignmentData) => {
    try {
      const response = await apiClient.post(`/cases/${caseId}/assign`, assignmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Add a note to a case
  addCaseNote: async (caseId, noteData) => {
    try {
      const response = await apiClient.post(`/cases/${caseId}/notes`, noteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get case notes
  getCaseNotes: async (caseId) => {
    try {
      const response = await apiClient.get(`/cases/${caseId}/notes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Upload document to a case
  uploadCaseDocument: async (caseId, documentData) => {
    try {
      const formData = new FormData();
      formData.append('file', documentData.file);
      formData.append('name', documentData.name);
      formData.append('description', documentData.description);
      
      const response = await apiClient.post(`/cases/${caseId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get case documents
  getCaseDocuments: async (caseId) => {
    try {
      const response = await apiClient.get(`/cases/${caseId}/documents`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Close a case
  closeCase: async (caseId, resolutionData) => {
    try {
      const response = await apiClient.post(`/cases/${caseId}/close`, resolutionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Escalate a case
  escalateCase: async (caseId, escalationData) => {
    try {
      const response = await apiClient.post(`/cases/${caseId}/escalate`, escalationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get case statistics
  getCaseStatistics: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/cases/statistics', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get case volume by time period
  getCaseVolume: async (timeRange = {}, groupBy = 'day') => {
    try {
      const response = await apiClient.get('/cases/volume', { 
        params: { ...timeRange, group_by: groupBy } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get case distribution by status
  getCaseDistributionByStatus: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/cases/distribution/status', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default caseService;
