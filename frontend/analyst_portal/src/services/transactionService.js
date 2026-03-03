import apiClient from './apiClient';

// Transaction service for managing and monitoring transactions
const transactionService = {
  // Get all transactions with optional filtering
  getAllTransactions: async (filters = {}) => {
    try {
      const response = await apiClient.get('/transactions', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific transaction by ID
  getTransaction: async (transactionId) => {
    try {
      const response = await apiClient.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get transaction details including all signals and evaluations
  getTransactionDetails: async (transactionId) => {
    try {
      const response = await apiClient.get(`/transactions/${transactionId}/details`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get transaction signals
  getTransactionSignals: async (transactionId) => {
    try {
      const response = await apiClient.get(`/transactions/${transactionId}/signals`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get transaction timeline
  getTransactionTimeline: async (transactionId) => {
    try {
      const response = await apiClient.get(`/transactions/${transactionId}/timeline`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Approve a transaction (manual override)
  approveTransaction: async (transactionId, approvalData) => {
    try {
      const response = await apiClient.post(`/transactions/${transactionId}/approve`, approvalData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Decline a transaction (manual override)
  declineTransaction: async (transactionId, declineData) => {
    try {
      const response = await apiClient.post(`/transactions/${transactionId}/decline`, declineData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Add a note to a transaction
  addTransactionNote: async (transactionId, noteData) => {
    try {
      const response = await apiClient.post(`/transactions/${transactionId}/notes`, noteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get transaction notes
  getTransactionNotes: async (transactionId) => {
    try {
      const response = await apiClient.get(`/transactions/${transactionId}/notes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get transaction statistics
  getTransactionStatistics: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/transactions/statistics', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get transaction volume by time period
  getTransactionVolume: async (timeRange = {}, groupBy = 'day') => {
    try {
      const response = await apiClient.get('/transactions/volume', { 
        params: { ...timeRange, group_by: groupBy } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get transaction amount by time period
  getTransactionAmount: async (timeRange = {}, groupBy = 'day') => {
    try {
      const response = await apiClient.get('/transactions/amount', { 
        params: { ...timeRange, group_by: groupBy } 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get transaction distribution by type
  getTransactionDistributionByType: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/transactions/distribution/type', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get transaction distribution by status
  getTransactionDistributionByStatus: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/transactions/distribution/status', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default transactionService;
