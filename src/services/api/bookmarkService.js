import { toast } from "react-toastify";
import React from "react";
import Error from "@/components/ui/Error";

export const bookmarkService = {
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
{"field": {"Name": "title_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "folder_id_c"}},
          {"field": {"Name": "score_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('bookmark_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      if (!response.data || response.data.length === 0) {
        return [];
      }
      
      // Transform database fields to component-expected format
      return response.data.map(bookmark => ({
        Id: bookmark.Id,
        title: bookmark.title_c || '',
        url: bookmark.url_c || '',
        description: bookmark.description_c || '',
        folderId: bookmark.folder_id_c?.Id || bookmark.folder_id_c || null,
        tags: bookmark.tags_c ? (typeof bookmark.tags_c === 'string' ? bookmark.tags_c.split(',') : bookmark.tags_c) : [],
        createdAt: bookmark.created_at_c || new Date().toISOString(),
updatedAt: bookmark.updated_at_c || new Date().toISOString(),
        score: bookmark.score_c || null
      }));
    } catch (error) {
      console.error("Error fetching bookmarks:", error?.response?.data?.message || error);
      toast.error("Failed to fetch bookmarks");
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
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "folder_id_c"}},
          {"field": {"Name": "score_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('bookmark_c', parseInt(id), params);
      
      if (!response.data) {
        return null;
      }
      
      // Transform database fields to component-expected format
      const bookmark = response.data;
      return {
        Id: bookmark.Id,
        title: bookmark.title_c || '',
        url: bookmark.url_c || '',
        description: bookmark.description_c || '',
        folderId: bookmark.folder_id_c?.Id || bookmark.folder_id_c || null,
        tags: bookmark.tags_c ? (typeof bookmark.tags_c === 'string' ? bookmark.tags_c.split(',') : bookmark.tags_c) : [],
createdAt: bookmark.created_at_c || new Date().toISOString(),
        updatedAt: bookmark.updated_at_c || new Date().toISOString(),
        score: bookmark.score_c || null
      };
    } catch (error) {
      console.error(`Error fetching bookmark ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(bookmarkData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Prepare data with proper field mapping and visibility compliance
      const recordData = {
        title_c: bookmarkData.title,
        url_c: bookmarkData.url,
        description_c: bookmarkData.description || '',
        tags_c: Array.isArray(bookmarkData.tags) ? bookmarkData.tags.join(',') : (bookmarkData.tags || ''),
folder_id_c: bookmarkData.folderId ? parseInt(bookmarkData.folderId) : null,
        score_c: bookmarkData.score ? parseFloat(bookmarkData.score) : null,
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString()
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
      
      const response = await apperClient.createRecord('bookmark_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} bookmarks:`, JSON.stringify(failed));
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
            title: created.title_c || '',
            url: created.url_c || '',
            description: created.description_c || '',
            folderId: created.folder_id_c?.Id || created.folder_id_c || null,
            tags: created.tags_c ? (typeof created.tags_c === 'string' ? created.tags_c.split(',') : created.tags_c) : [],
            createdAt: created.created_at_c || new Date().toISOString(),
updatedAt: created.updated_at_c || new Date().toISOString(),
            score: created.score_c || null
          };
        }
      }
      
      throw new Error("Failed to create bookmark");
    } catch (error) {
      console.error("Error creating bookmark:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, bookmarkData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Prepare data with proper field mapping and visibility compliance
      const recordData = {
        Id: parseInt(id),
        title_c: bookmarkData.title,
        url_c: bookmarkData.url,
        description_c: bookmarkData.description || '',
        tags_c: Array.isArray(bookmarkData.tags) ? bookmarkData.tags.join(',') : (bookmarkData.tags || ''),
folder_id_c: bookmarkData.folderId ? parseInt(bookmarkData.folderId) : null,
        score_c: bookmarkData.score ? parseFloat(bookmarkData.score) : null,
        updated_at_c: new Date().toISOString()
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
      
      const response = await apperClient.updateRecord('bookmark_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} bookmarks:`, JSON.stringify(failed));
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
            title: updated.title_c || '',
            url: updated.url_c || '',
            description: updated.description_c || '',
            folderId: updated.folder_id_c?.Id || updated.folder_id_c || null,
            tags: updated.tags_c ? (typeof updated.tags_c === 'string' ? updated.tags_c.split(',') : updated.tags_c) : [],
            createdAt: updated.created_at_c || new Date().toISOString(),
updatedAt: updated.updated_at_c || new Date().toISOString(),
            score: updated.score_c || null
          };
        }
      }
      
      throw new Error("Failed to update bookmark");
    } catch (error) {
      console.error("Error updating bookmark:", error?.response?.data?.message || error);
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
      
      const response = await apperClient.deleteRecord('bookmark_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} bookmarks:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting bookmark:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getByFolder(folderId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
{"field": {"Name": "folder_id_c"}},
          {"field": {"Name": "score_c"}}
        ],
        where: [{"FieldName": "folder_id_c", "Operator": "EqualTo", "Values": [parseInt(folderId)]}],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('bookmark_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data) {
        return [];
      }
      
      // Transform database fields to component-expected format
      return response.data.map(bookmark => ({
        Id: bookmark.Id,
        title: bookmark.title_c || '',
        url: bookmark.url_c || '',
        description: bookmark.description_c || '',
        folderId: bookmark.folder_id_c?.Id || bookmark.folder_id_c || null,
tags: bookmark.tags_c ? (typeof bookmark.tags_c === 'string' ? bookmark.tags_c.split(',') : bookmark.tags_c) : [],
        createdAt: bookmark.created_at_c || new Date().toISOString(),
        score: bookmark.score_c || null,
        updatedAt: bookmark.updated_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching bookmarks by folder:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByTag(tag) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "url_c"}},
{"field": {"Name": "description_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"Name": "folder_id_c"}},
          {"field": {"Name": "score_c"}}
        ],
        where: [{"FieldName": "tags_c", "Operator": "Contains", "Values": [tag]}],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('bookmark_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data) {
        return [];
      }
      
      // Transform database fields to component-expected format
      return response.data.map(bookmark => ({
        Id: bookmark.Id,
        title: bookmark.title_c || '',
        url: bookmark.url_c || '',
        description: bookmark.description_c || '',
        folderId: bookmark.folder_id_c?.Id || bookmark.folder_id_c || null,
        tags: bookmark.tags_c ? (typeof bookmark.tags_c === 'string' ? bookmark.tags_c.split(',') : bookmark.tags_c) : [],
        createdAt: bookmark.created_at_c || new Date().toISOString(),
updatedAt: bookmark.updated_at_c || new Date().toISOString(),
        score: bookmark.score_c || null
      }));
    } catch (error) {
      console.error("Error fetching bookmarks by tag:", error?.response?.data?.message || error);
      return [];
    }
  },

  async search(query) {
    try {
      if (!query.trim()) return this.getAll();
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "url_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
{"field": {"Name": "folder_id_c"}},
          {"field": {"Name": "score_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "title_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {"fieldName": "url_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {"fieldName": "description_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            },
            {
              "conditions": [
                {"fieldName": "tags_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('bookmark_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      if (!response.data) {
        return [];
      }
      
      // Transform database fields to component-expected format
      return response.data.map(bookmark => ({
        Id: bookmark.Id,
        title: bookmark.title_c || '',
        url: bookmark.url_c || '',
        description: bookmark.description_c || '',
        folderId: bookmark.folder_id_c?.Id || bookmark.folder_id_c || null,
        tags: bookmark.tags_c ? (typeof bookmark.tags_c === 'string' ? bookmark.tags_c.split(',') : bookmark.tags_c) : [],
createdAt: bookmark.created_at_c || new Date().toISOString(),
        updatedAt: bookmark.updated_at_c || new Date().toISOString(),
        score: bookmark.score_c || null
      }));
    } catch (error) {
} catch (error) {
      console.error("Error searching bookmarks:", error?.response?.data?.message || error);
      return [];
    }
  }
};

export const scoreBookmark = async (bookmarkId) => {
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const result = await apperClient.functions.invoke(import.meta.env.VITE_SCORE_BOOKMARK, {
      body: JSON.stringify({ bookmarkId }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!result.success) {
      console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SCORE_BOOKMARK}. The response body is: ${JSON.stringify(result)}.`);
      throw new Error(result.message || 'Failed to score bookmark');
    }

    return result.data;
  } catch (error) {
    console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_SCORE_BOOKMARK}. The error is: ${error.message}`);
    throw error;
  }
}
};