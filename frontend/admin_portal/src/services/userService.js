import apiClient from './apiClient';

// User service for managing system users
const userService = {
  // Get all users with optional filtering
  getAllUsers: async (filters = {}) => {
    try {
      const response = await apiClient.get('/users', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific user by ID
  getUser: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing user
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a user
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Activate a user
  activateUser: async (userId) => {
    try {
      const response = await apiClient.post(`/users/${userId}/activate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Deactivate a user
  deactivateUser: async (userId) => {
    try {
      const response = await apiClient.post(`/users/${userId}/deactivate`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Change user password
  changePassword: async (userId, passwordData) => {
    try {
      const response = await apiClient.post(`/users/${userId}/change-password`, passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Reset user password
  resetPassword: async (userId) => {
    try {
      const response = await apiClient.post(`/users/${userId}/reset-password`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user activity logs
  getUserActivityLogs: async (userId, pagination = {}) => {
    try {
      const response = await apiClient.get(`/users/${userId}/activity-logs`, { params: pagination });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user roles
  getRoles: async () => {
    try {
      const response = await apiClient.get('/roles');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Assign role to user
  assignRole: async (userId, roleId) => {
    try {
      const response = await apiClient.post(`/users/${userId}/roles`, { role_id: roleId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Remove role from user
  removeRole: async (userId, roleId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}/roles/${roleId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user permissions
  getUserPermissions: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}/permissions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userService;
