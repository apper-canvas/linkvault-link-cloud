import { useState, useEffect } from "react";
import { bookmarkService } from "@/services/api/bookmarkService";
import { folderService } from "@/services/api/folderService";
import { toast } from "react-toastify";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [bookmarksData, foldersData] = await Promise.all([
        bookmarkService.getAll(),
        folderService.getAll()
      ]);
      setBookmarks(bookmarksData);
      setFolders(foldersData);
    } catch (err) {
      setError("Failed to load bookmarks");
      toast.error("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addBookmark = async (bookmarkData) => {
    try {
      const newBookmark = await bookmarkService.create(bookmarkData);
      setBookmarks(prev => [newBookmark, ...prev]);
      toast.success("Bookmark added successfully!");
      return newBookmark;
    } catch (err) {
      toast.error("Failed to add bookmark");
      throw err;
    }
  };

  const updateBookmark = async (id, bookmarkData) => {
    try {
      const updatedBookmark = await bookmarkService.update(id, bookmarkData);
      setBookmarks(prev => 
        prev.map(bookmark => 
          bookmark.Id === id ? updatedBookmark : bookmark
        )
      );
      toast.success("Bookmark updated successfully!");
      return updatedBookmark;
    } catch (err) {
      toast.error("Failed to update bookmark");
      throw err;
    }
  };

  const deleteBookmark = async (id) => {
    try {
      await bookmarkService.delete(id);
      setBookmarks(prev => prev.filter(bookmark => bookmark.Id !== id));
      toast.success("Bookmark deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete bookmark");
      throw err;
    }
  };

  const searchBookmarks = async (query) => {
    try {
      const results = await bookmarkService.search(query);
      return results;
    } catch (err) {
      toast.error("Failed to search bookmarks");
      return [];
    }
  };

  const addFolder = async (folderData) => {
    try {
      const newFolder = await folderService.create(folderData);
      setFolders(prev => [...prev, newFolder]);
      toast.success("Folder created successfully!");
      return newFolder;
    } catch (err) {
      toast.error("Failed to create folder");
      throw err;
    }
  };

  const updateFolder = async (id, folderData) => {
    try {
      const updatedFolder = await folderService.update(id, folderData);
      setFolders(prev => 
        prev.map(folder => 
          folder.Id === id ? updatedFolder : folder
        )
      );
      toast.success("Folder updated successfully!");
      return updatedFolder;
    } catch (err) {
      toast.error("Failed to update folder");
      throw err;
    }
  };

  const deleteFolder = async (id) => {
    try {
      await folderService.delete(id);
      setFolders(prev => prev.filter(folder => folder.Id !== id));
      // Update bookmarks to remove folder reference
      setBookmarks(prev => 
        prev.map(bookmark => 
          bookmark.folderId === id 
            ? { ...bookmark, folderId: null }
            : bookmark
        )
      );
      toast.success("Folder deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete folder");
      throw err;
    }
  };

  const getTags = () => {
    const tagCounts = {};
    bookmarks.forEach(bookmark => {
      if (bookmark.tags) {
        bookmark.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(tagCounts)
      .map(([name, count]) => ({
        name,
        count,
        color: "primary"
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getBookmarkCounts = () => {
    const counts = {
      total: bookmarks.length,
      folders: {}
    };

    folders.forEach(folder => {
      counts.folders[folder.Id] = bookmarks.filter(
        bookmark => bookmark.folderId === folder.Id
      ).length;
    });

    return counts;
  };

  return {
bookmarks,
    scoreBookmark: handleScoreBookmark,
    folders,
    loading,
    error,
    loadData,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    searchBookmarks,
    addFolder,
    updateFolder,
    deleteFolder,
    getTags,
getBookmarkCounts
  };

  const handleScoreBookmark = async (bookmarkId) => {
    setLoading(true);
    setError(null);
    
    try {
      await bookmarkService.scoreBookmark(bookmarkId);
      toast.success('Bookmark scored successfully');
      await loadData();
    } catch (err) {
      const errorMessage = err.message || 'Failed to score bookmark';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error scoring bookmark:', err);
    } finally {
      setLoading(false);
    }
  };
};