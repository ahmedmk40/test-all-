import apiClient from './apiClient';

// Risk Assessment service for managing customer risk assessments
const riskAssessmentService = {
  // Get all customer risk assessments
  getAllRiskAssessments: async (filters = {}) => {
    try {
      const response = await apiClient.get('/aml/risk-assessments', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific risk assessment by ID
  getRiskAssessment: async (assessmentId) => {
    try {
      const response = await apiClient.get(`/aml/risk-assessments/${assessmentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new risk assessment
  createRiskAssessment: async (assessmentData) => {
    try {
      const response = await apiClient.post('/aml/risk-assessments', assessmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing risk assessment
  updateRiskAssessment: async (assessmentId, assessmentData) => {
    try {
      const response = await apiClient.put(`/aml/risk-assessments/${assessmentId}`, assessmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get risk assessment for a specific customer
  getCustomerRiskAssessment: async (customerId) => {
    try {
      const response = await apiClient.get(`/aml/risk-assessments/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get risk assessment history for a customer
  getCustomerRiskAssessmentHistory: async (customerId) => {
    try {
      const response = await apiClient.get(`/aml/risk-assessments/customer/${customerId}/history`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Approve a risk assessment
  approveRiskAssessment: async (assessmentId, approvalData) => {
    try {
      const response = await apiClient.post(`/aml/risk-assessments/${assessmentId}/approve`, approvalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Reject a risk assessment
  rejectRiskAssessment: async (assessmentId, rejectionData) => {
    try {
      const response = await apiClient.post(`/aml/risk-assessments/${assessmentId}/reject`, rejectionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get risk assessment factors
  getRiskFactors: async () => {
    try {
      const response = await apiClient.get('/aml/risk-assessments/factors');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update risk assessment factors
  updateRiskFactors: async (factorsData) => {
    try {
      const response = await apiClient.put('/aml/risk-assessments/factors', factorsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Calculate risk score for a customer
  calculateCustomerRiskScore: async (customerId, assessmentData = {}) => {
    try {
      const response = await apiClient.post(`/aml/risk-assessments/calculate/${customerId}`, assessmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get risk level distribution
  getRiskLevelDistribution: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/aml/risk-assessments/distribution', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get high-risk customers
  getHighRiskCustomers: async (pagination = {}) => {
    try {
      const response = await apiClient.get('/aml/risk-assessments/high-risk-customers', { params: pagination });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get risk assessment statistics
  getRiskAssessmentStatistics: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/aml/risk-assessments/statistics', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default riskAssessmentService;
