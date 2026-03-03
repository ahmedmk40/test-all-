import apiClient from './apiClient';

// Rule service for managing fraud detection rules
const ruleService = {
  // Get all rules with optional filtering
  getAllRules: async (filters = {}) => {
    try {
      const response = await apiClient.get('/rules', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific rule by ID
  getRule: async (ruleId) => {
    try {
      const response = await apiClient.get(`/rules/${ruleId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new rule
  createRule: async (ruleData) => {
    try {
      const response = await apiClient.post('/rules', ruleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing rule
  updateRule: async (ruleId, ruleData) => {
    try {
      const response = await apiClient.put(`/rules/${ruleId}`, ruleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a rule
  deleteRule: async (ruleId) => {
    try {
      const response = await apiClient.delete(`/rules/${ruleId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Activate a rule
  activateRule: async (ruleId) => {
    try {
      const response = await apiClient.post(`/rules/${ruleId}/activate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Deactivate a rule
  deactivateRule: async (ruleId) => {
    try {
      const response = await apiClient.post(`/rules/${ruleId}/deactivate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get rule performance metrics
  getRuleMetrics: async (ruleId, timeRange = {}) => {
    try {
      const response = await apiClient.get(`/rules/${ruleId}/metrics`, { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get rule execution history
  getRuleExecutionHistory: async (ruleId, pagination = {}) => {
    try {
      const response = await apiClient.get(`/rules/${ruleId}/executions`, { params: pagination });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get rule sets
  getRuleSets: async () => {
    try {
      const response = await apiClient.get('/rule-sets');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a rule set
  createRuleSet: async (ruleSetData) => {
    try {
      const response = await apiClient.post('/rule-sets', ruleSetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update a rule set
  updateRuleSet: async (ruleSetId, ruleSetData) => {
    try {
      const response = await apiClient.put(`/rule-sets/${ruleSetId}`, ruleSetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Add rule to rule set
  addRuleToSet: async (ruleSetId, ruleId) => {
    try {
      const response = await apiClient.post(`/rule-sets/${ruleSetId}/rules`, { rule_id: ruleId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Remove rule from rule set
  removeRuleFromSet: async (ruleSetId, ruleId) => {
    try {
      const response = await apiClient.delete(`/rule-sets/${ruleSetId}/rules/${ruleId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default ruleService;
