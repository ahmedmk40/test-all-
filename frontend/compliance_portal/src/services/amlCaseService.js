import apiClient from './apiClient';

// AML Case service for managing AML cases
const amlCaseService = {
  // Get all AML cases with optional filtering
  getAllAMLCases: async (filters = {}) => {
    try {
      const response = await apiClient.get('/aml/cases', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific AML case by ID
  getAMLCase: async (caseId) => {
    try {
      const response = await apiClient.get(`/aml/cases/${caseId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new AML case
  createAMLCase: async (caseData) => {
    try {
      const response = await apiClient.post('/aml/cases', caseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing AML case
  updateAMLCase: async (caseId, caseData) => {
    try {
      const response = await apiClient.put(`/aml/cases/${caseId}`, caseData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get AML case details including all related information
  getAMLCaseDetails: async (caseId) => {
    try {
      const response = await apiClient.get(`/aml/cases/${caseId}/details`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get related transactions for an AML case
  getAMLCaseTransactions: async (caseId) => {
    try {
      const response = await apiClient.get(`/aml/cases/${caseId}/transactions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get customer information for an AML case
  getAMLCaseCustomer: async (caseId) => {
    try {
      const response = await apiClient.get(`/aml/cases/${caseId}/customer`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update AML case status
  updateAMLCaseStatus: async (caseId, statusData) => {
    try {
      const response = await apiClient.put(`/aml/cases/${caseId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Assign AML case to compliance officer
  assignAMLCase: async (caseId, assignmentData) => {
    try {
      const response = await apiClient.post(`/aml/cases/${caseId}/assign`, assignmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Add a note to an AML case
  addAMLCaseNote: async (caseId, noteData) => {
    try {
      const response = await apiClient.post(`/aml/cases/${caseId}/notes`, noteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get AML case notes
  getAMLCaseNotes: async (caseId) => {
    try {
      const response = await apiClient.get(`/aml/cases/${caseId}/notes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Upload document to an AML case
  uploadAMLCaseDocument: async (caseId, documentData) => {
    try {
      const formData = new FormData();
      formData.append('file', documentData.file);
      formData.append('name', documentData.name);
      formData.append('description', documentData.description);
      
      const response = await apiClient.post(`/aml/cases/${caseId}/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get AML case documents
  getAMLCaseDocuments: async (caseId) => {
    try {
      const response = await apiClient.get(`/aml/cases/${caseId}/documents`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Close an AML case
  closeAMLCase: async (caseId, resolutionData) => {
    try {
      const response = await apiClient.post(`/aml/cases/${caseId}/close`, resolutionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Escalate an AML case
  escalateAMLCase: async (caseId, escalationData) => {
    try {
      const response = await apiClient.post(`/aml/cases/${caseId}/escalate`, escalationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // File SAR for an AML case
  fileSAR: async (caseId, sarData) => {
    try {
      const response = await apiClient.post(`/aml/cases/${caseId}/file-sar`, sarData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get SAR details for an AML case
  getSARDetails: async (caseId) => {
    try {
      const response = await apiClient.get(`/aml/cases/${caseId}/sar-details`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get AML case statistics
  getAMLCaseStatistics: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/aml/cases/statistics', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get AML case volume by time period
  getAMLCaseVolume: async (timeRange = {}, groupBy = 'day') => {
    try {
      const response = await apiClient.get('/aml/cases/volume', { 
        params: { ...timeRange, group_by: groupBy } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get AML case distribution by status
  getAMLCaseDistributionByStatus: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/aml/cases/distribution/status', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get AML case distribution by risk level
  getAMLCaseDistributionByRiskLevel: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/aml/cases/distribution/risk-level', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default amlCaseService;
