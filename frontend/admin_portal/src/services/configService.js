import apiClient from './apiClient';

// System configuration service for managing system settings
const configService = {
  // Get all system configurations
  getAllConfigurations: async () => {
    try {
      const response = await apiClient.get('/configurations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get configuration by category
  getConfigurationByCategory: async (category) => {
    try {
      const response = await apiClient.get(`/configurations/category/${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific configuration by key
  getConfiguration: async (key) => {
    try {
      const response = await apiClient.get(`/configurations/${key}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update a configuration
  updateConfiguration: async (key, value) => {
    try {
      const response = await apiClient.put(`/configurations/${key}`, { value });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update multiple configurations at once
  updateMultipleConfigurations: async (configData) => {
    try {
      const response = await apiClient.put('/configurations/batch', { configurations: configData });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get service health status
  getServiceHealth: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get system metrics
  getSystemMetrics: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/metrics', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get database configuration
  getDatabaseConfig: async () => {
    try {
      const response = await apiClient.get('/configurations/database');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update database configuration
  updateDatabaseConfig: async (configData) => {
    try {
      const response = await apiClient.put('/configurations/database', configData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get email notification settings
  getEmailSettings: async () => {
    try {
      const response = await apiClient.get('/configurations/email');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update email notification settings
  updateEmailSettings: async (settingsData) => {
    try {
      const response = await apiClient.put('/configurations/email', settingsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Test email configuration
  testEmailConfiguration: async (emailData) => {
    try {
      const response = await apiClient.post('/configurations/email/test', emailData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get security policy settings
  getSecurityPolicies: async () => {
    try {
      const response = await apiClient.get('/configurations/security');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update security policy settings
  updateSecurityPolicies: async (policyData) => {
    try {
      const response = await apiClient.put('/configurations/security', policyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default configService;
