import apiClient from './apiClient';

// Watchlist service for managing AML watchlists
const watchlistService = {
  // Get all watchlists
  getAllWatchlists: async () => {
    try {
      const response = await apiClient.get('/aml/watchlists');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific watchlist by ID
  getWatchlist: async (watchlistId) => {
    try {
      const response = await apiClient.get(`/aml/watchlists/${watchlistId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new watchlist
  createWatchlist: async (watchlistData) => {
    try {
      const response = await apiClient.post('/aml/watchlists', watchlistData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing watchlist
  updateWatchlist: async (watchlistId, watchlistData) => {
    try {
      const response = await apiClient.put(`/aml/watchlists/${watchlistId}`, watchlistData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a watchlist
  deleteWatchlist: async (watchlistId) => {
    try {
      const response = await apiClient.delete(`/aml/watchlists/${watchlistId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get all entries in a watchlist
  getWatchlistEntries: async (watchlistId, filters = {}) => {
    try {
      const response = await apiClient.get(`/aml/watchlists/${watchlistId}/entries`, { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a specific watchlist entry
  getWatchlistEntry: async (watchlistId, entryId) => {
    try {
      const response = await apiClient.get(`/aml/watchlists/${watchlistId}/entries/${entryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Add an entry to a watchlist
  addWatchlistEntry: async (watchlistId, entryData) => {
    try {
      const response = await apiClient.post(`/aml/watchlists/${watchlistId}/entries`, entryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update a watchlist entry
  updateWatchlistEntry: async (watchlistId, entryId, entryData) => {
    try {
      const response = await apiClient.put(`/aml/watchlists/${watchlistId}/entries/${entryId}`, entryData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a watchlist entry
  deleteWatchlistEntry: async (watchlistId, entryId) => {
    try {
      const response = await apiClient.delete(`/aml/watchlists/${watchlistId}/entries/${entryId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Bulk import entries to a watchlist
  bulkImportWatchlistEntries: async (watchlistId, entriesData, fileFormat = 'csv') => {
    try {
      const formData = new FormData();
      formData.append('file', entriesData.file);
      formData.append('format', fileFormat);
      
      const response = await apiClient.post(`/aml/watchlists/${watchlistId}/bulk-import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Export watchlist entries
  exportWatchlistEntries: async (watchlistId, format = 'csv') => {
    try {
      const response = await apiClient.get(`/aml/watchlists/${watchlistId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `watchlist-${watchlistId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      throw error;
    }
  },
  
  // Search across all watchlists
  searchWatchlists: async (searchQuery) => {
    try {
      const response = await apiClient.get('/aml/watchlists/search', { params: { query: searchQuery } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Check if an entity is on any watchlist
  checkEntityAgainstWatchlists: async (entityData) => {
    try {
      const response = await apiClient.post('/aml/watchlists/check', entityData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get watchlist match history
  getWatchlistMatchHistory: async (filters = {}) => {
    try {
      const response = await apiClient.get('/aml/watchlists/match-history', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get external watchlist providers
  getExternalWatchlistProviders: async () => {
    try {
      const response = await apiClient.get('/aml/watchlists/external-providers');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Sync with external watchlist provider
  syncExternalWatchlist: async (providerId, syncOptions = {}) => {
    try {
      const response = await apiClient.post(`/aml/watchlists/external-providers/${providerId}/sync`, syncOptions);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default watchlistService;
