import { toast } from "react-toastify";

export const folderService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('folder_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Transform database fields to component-expected format
      return response.data.map(folder => ({
        Id: folder.Id,
        name: folder.name_c || '',
        color: folder.color_c || 'blue',
        createdAt: folder.created_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching folders:", error?.response?.data?.message || error);
      toast.error("Failed to fetch folders");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('folder_c', parseInt(id), params);
      
      if (!response.data) {
        return null;
      }
      
      // Transform database fields to component-expected format
      const folder = response.data;
      return {
        Id: folder.Id,
        name: folder.name_c || '',
        color: folder.color_c || 'blue',
        createdAt: folder.created_at_c || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching folder ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(folderData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Prepare data with proper field mapping and visibility compliance
      const recordData = {
        name_c: folderData.name,
        color_c: folderData.color || 'blue',
        created_at_c: new Date().toISOString()
      };
      
      // Remove null/undefined values
      Object.keys(recordData).forEach(key => {
        if (recordData[key] === null || recordData[key] === undefined || recordData[key] === '') {
          delete recordData[key];
        }
      });
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.createRecord('folder_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} folders:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            name: created.name_c || '',
            color: created.color_c || 'blue',
            createdAt: created.created_at_c || new Date().toISOString()
          };
        }
      }
      
      throw new Error("Failed to create folder");
    } catch (error) {
      console.error("Error creating folder:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, folderData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Prepare data with proper field mapping and visibility compliance
      const recordData = {
        Id: parseInt(id),
        name_c: folderData.name,
        color_c: folderData.color || 'blue'
      };
      
      // Remove null/undefined values except for Id
      Object.keys(recordData).forEach(key => {
        if (key !== 'Id' && (recordData[key] === null || recordData[key] === undefined || recordData[key] === '')) {
          delete recordData[key];
        }
      });
      
      const params = {
        records: [recordData]
      };
      
      const response = await apperClient.updateRecord('folder_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} folders:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            }
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            name: updated.name_c || '',
            color: updated.color_c || 'blue',
            createdAt: updated.created_at_c || new Date().toISOString()
          };
        }
      }
      
      throw new Error("Failed to update folder");
    } catch (error) {
      console.error("Error updating folder:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('folder_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} folders:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting folder:", error?.response?.data?.message || error);
      throw error;
    }
  }
};