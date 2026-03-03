import apiClient from './apiClient';

// Report service for generating and managing reports
const reportService = {
  // Get all report templates
  getAllReportTemplates: async (filters = {}) => {
    try {
      const response = await apiClient.get('/reports/templates', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific report template by ID
  getReportTemplate: async (templateId) => {
    try {
      const response = await apiClient.get(`/reports/templates/${templateId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Generate a report from template
  generateReport: async (templateId, parameters = {}) => {
    try {
      const response = await apiClient.post(`/reports/generate/${templateId}`, parameters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get all generated reports
  getAllReports: async (filters = {}) => {
    try {
      const response = await apiClient.get('/reports', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific report by ID
  getReport: async (reportId) => {
    try {
      const response = await apiClient.get(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Download a report
  downloadReport: async (reportId, format = 'pdf') => {
    try {
      const response = await apiClient.get(`/reports/${reportId}/download`, {
        params: { format },
        responseType: 'blob'
      });
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error;
    }
  },
  
  // Schedule a report
  scheduleReport: async (templateId, scheduleData) => {
    try {
      const response = await apiClient.post(`/reports/schedule/${templateId}`, scheduleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get all scheduled reports
  getAllScheduledReports: async (filters = {}) => {
    try {
      const response = await apiClient.get('/reports/scheduled', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update a scheduled report
  updateScheduledReport: async (scheduleId, scheduleData) => {
    try {
      const response = await apiClient.put(`/reports/scheduled/${scheduleId}`, scheduleData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a scheduled report
  deleteScheduledReport: async (scheduleId) => {
    try {
      const response = await apiClient.delete(`/reports/scheduled/${scheduleId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a custom report template
  createReportTemplate: async (templateData) => {
    try {
      const response = await apiClient.post('/reports/templates', templateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update a report template
  updateReportTemplate: async (templateId, templateData) => {
    try {
      const response = await apiClient.put(`/reports/templates/${templateId}`, templateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a report template
  deleteReportTemplate: async (templateId) => {
    try {
      const response = await apiClient.delete(`/reports/templates/${templateId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Export report data
  exportReportData: async (reportId, format = 'csv') => {
    try {
      const response = await apiClient.get(`/reports/${reportId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-data-${reportId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error;
    }
  }
};

export default reportService;
