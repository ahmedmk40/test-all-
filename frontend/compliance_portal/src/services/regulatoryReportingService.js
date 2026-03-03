import apiClient from './apiClient';

// Regulatory Reporting service for managing regulatory reports
const regulatoryReportingService = {
  // Get all regulatory reports
  getAllRegulatoryReports: async (filters = {}) => {
    try {
      const response = await apiClient.get('/aml/regulatory-reports', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific regulatory report by ID
  getRegulatoryReport: async (reportId) => {
    try {
      const response = await apiClient.get(`/aml/regulatory-reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new regulatory report
  createRegulatoryReport: async (reportData) => {
    try {
      const response = await apiClient.post('/aml/regulatory-reports', reportData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing regulatory report
  updateRegulatoryReport: async (reportId, reportData) => {
    try {
      const response = await apiClient.put(`/aml/regulatory-reports/${reportId}`, reportData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Submit a regulatory report to authorities
  submitRegulatoryReport: async (reportId, submissionData = {}) => {
    try {
      const response = await apiClient.post(`/aml/regulatory-reports/${reportId}/submit`, submissionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get regulatory report submission status
  getRegulatoryReportStatus: async (reportId) => {
    try {
      const response = await apiClient.get(`/aml/regulatory-reports/${reportId}/status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get regulatory report templates
  getRegulatoryReportTemplates: async (jurisdiction = null) => {
    try {
      const params = jurisdiction ? { jurisdiction } : {};
      const response = await apiClient.get('/aml/regulatory-reports/templates', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific regulatory report template
  getRegulatoryReportTemplate: async (templateId) => {
    try {
      const response = await apiClient.get(`/aml/regulatory-reports/templates/${templateId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Generate a regulatory report from a template
  generateRegulatoryReport: async (templateId, reportData) => {
    try {
      const response = await apiClient.post(`/aml/regulatory-reports/generate/${templateId}`, reportData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Upload attachment to a regulatory report
  uploadReportAttachment: async (reportId, attachmentData) => {
    try {
      const formData = new FormData();
      formData.append('file', attachmentData.file);
      formData.append('name', attachmentData.name);
      formData.append('description', attachmentData.description);
      
      const response = await apiClient.post(`/aml/regulatory-reports/${reportId}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get regulatory report attachments
  getReportAttachments: async (reportId) => {
    try {
      const response = await apiClient.get(`/aml/regulatory-reports/${reportId}/attachments`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Download a regulatory report
  downloadRegulatoryReport: async (reportId, format = 'pdf') => {
    try {
      const response = await apiClient.get(`/aml/regulatory-reports/${reportId}/download`, {
        params: { format },
        responseType: 'blob'
      });
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `regulatory-report-${reportId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error;
    }
  },
  
  // Get regulatory reporting statistics
  getRegulatoryReportingStatistics: async (timeRange = {}) => {
    try {
      const response = await apiClient.get('/aml/regulatory-reports/statistics', { params: timeRange });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get regulatory reporting deadlines
  getRegulatoryReportingDeadlines: async () => {
    try {
      const response = await apiClient.get('/aml/regulatory-reports/deadlines');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default regulatoryReportingService;
