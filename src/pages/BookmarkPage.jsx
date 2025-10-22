import React, { useEffect, useMemo, useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import Modal from "@/components/atoms/Modal";
import BookmarkForm from "@/components/organisms/BookmarkForm";
import BookmarkGrid from "@/components/organisms/BookmarkGrid";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import FolderForm from "@/components/organisms/FolderForm";
import Header from "@/components/organisms/Header";
import MobileSidebar from "@/components/organisms/MobileSidebar";
import Sidebar from "@/components/organisms/Sidebar";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const BookmarkPage = () => {
const {
    bookmarks,
    folders,
    loading,
    error,
    loadData,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    addFolder,
    updateFolder,
    getTags,
    getBookmarkCounts,
    scoreBookmark
  } = useBookmarks();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFolder, setActiveFolder] = useState(null);
  const [activeTags, setActiveTags] = useState([]);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const tags = useMemo(() => getTags(), [bookmarks]);
  const bookmarkCounts = useMemo(() => getBookmarkCounts(), [bookmarks, folders]);

  const filteredBookmarks = useMemo(() => {
    let filtered = [...bookmarks];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bookmark =>
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query) ||
        (bookmark.description && bookmark.description.toLowerCase().includes(query)) ||
        (bookmark.tags && bookmark.tags.some(tag => 
          tag.toLowerCase().includes(query)
        ))
      );
    }

    // Filter by folder
    if (activeFolder) {
      filtered = filtered.filter(bookmark => bookmark.folderId === activeFolder.Id);
    }

    // Filter by tags
    if (activeTags.length > 0) {
      filtered = filtered.filter(bookmark =>
        bookmark.tags && activeTags.some(tag =>
          bookmark.tags.includes(tag)
        )
      );
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [bookmarks, searchQuery, activeFolder, activeTags]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleAddBookmark = () => {
    setEditingBookmark(null);
    setShowBookmarkModal(true);
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setShowBookmarkModal(true);
  };

  const handleDeleteBookmark = (bookmark) => {
    setBookmarkToDelete(bookmark);
    setShowDeleteConfirm(true);
  };

  const handleBookmarkSubmit = async (bookmarkData) => {
    if (editingBookmark) {
      await updateBookmark(editingBookmark.Id, bookmarkData);
    } else {
      await addBookmark(bookmarkData);
    }
    setShowBookmarkModal(false);
    setEditingBookmark(null);
  };

  const handleConfirmDelete = async () => {
    if (bookmarkToDelete) {
      await deleteBookmark(bookmarkToDelete.Id);
      setBookmarkToDelete(null);
    }
  };

  const handleFolderSelect = (folder) => {
    setActiveFolder(folder);
    setActiveTags([]);
    setSearchQuery("");
    setShowMobileSidebar(false);
  };

  const handleShowAllBookmarks = () => {
    setActiveFolder(null);
    setActiveTags([]);
    setSearchQuery("");
    setShowMobileSidebar(false);
  };

  const handleTagToggle = (tagName) => {
    setActiveTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(t => t !== tagName);
      } else {
        return [...prev, tagName];
      }
    });
    setActiveFolder(null);
    setSearchQuery("");
    setShowMobileSidebar(false);
  };

  const handleCreateFolder = () => {
    setEditingFolder(null);
    setShowFolderModal(true);
  };

const handleFolderSubmit = async (folderData) => {
    if (editingFolder) {
      await updateFolder(editingFolder.Id, folderData);
    } else {
      await addFolder(folderData);
    }
    setShowFolderModal(false);
    setEditingFolder(null);
  };

  const handleScoreBookmark = async (bookmarkId) => {
    await scoreBookmark(bookmarkId);
  };

  const getPageTitle = () => {
    if (activeFolder) {
      return `${activeFolder.name} (${filteredBookmarks.length})`;
    }
    if (activeTags.length > 0) {
      return `Tagged: ${activeTags.join(", ")} (${filteredBookmarks.length})`;
    }
    if (searchQuery) {
      return `Search results for "${searchQuery}" (${filteredBookmarks.length})`;
    }
    return `All Bookmarks (${filteredBookmarks.length})`;
  };

  if (loading) {
    return (
      <div className="h-screen bg-background flex">
        <div className="hidden lg:block">
          <div className="w-64 bg-surface border-r border-gray-200 h-full">
            <div className="p-4 space-y-4 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="bg-surface border-b border-gray-200 p-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex-1 p-6">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <Error message={error} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar
          folders={folders}
          tags={tags}
          activeFolder={activeFolder}
          activeTags={activeTags}
          bookmarkCounts={bookmarkCounts}
          onFolderSelect={handleFolderSelect}
          onTagToggle={handleTagToggle}
          onShowAllBookmarks={handleShowAllBookmarks}
          onCreateFolder={handleCreateFolder}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
        folders={folders}
        tags={tags}
        activeFolder={activeFolder}
        activeTags={activeTags}
        bookmarkCounts={bookmarkCounts}
        onFolderSelect={handleFolderSelect}
        onTagToggle={handleTagToggle}
        onShowAllBookmarks={handleShowAllBookmarks}
        onCreateFolder={handleCreateFolder}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onSearch={handleSearch}
          onAddBookmark={handleAddBookmark}
          onToggleMobileSidebar={() => setShowMobileSidebar(true)}
          searchQuery={searchQuery}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
              {(activeFolder || activeTags.length > 0 || searchQuery) && (
                <button
                  onClick={handleShowAllBookmarks}
                  className="mt-2 text-sm text-primary hover:text-blue-700 transition-colors"
                >
                  ← Back to all bookmarks
                </button>
              )}
            </div>

            {filteredBookmarks.length === 0 ? (
              <Empty
                title={searchQuery ? "No bookmarks found" : "No bookmarks yet"}
                message={
                  searchQuery
                    ? `No bookmarks match "${searchQuery}". Try adjusting your search.`
                    : "Start building your bookmark collection by adding your first link"
                }
                actionText="Add Your First Bookmark"
                onAction={handleAddBookmark}
                icon={searchQuery ? "Search" : "BookOpen"}
              />
            ) : (
<BookmarkGrid
                bookmarks={filteredBookmarks}
                folders={folders}
                onEdit={handleEditBookmark}
                onDelete={handleDeleteBookmark}
                onFolderClick={handleFolderSelect}
                onScoreGenerate={handleScoreBookmark}
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showBookmarkModal}
        onClose={() => {
          setShowBookmarkModal(false);
          setEditingBookmark(null);
        }}
        title={editingBookmark ? "Edit Bookmark" : "Add New Bookmark"}
        size="lg"
      >
        <BookmarkForm
          bookmark={editingBookmark}
          folders={folders}
          onSubmit={handleBookmarkSubmit}
          onCancel={() => {
            setShowBookmarkModal(false);
            setEditingBookmark(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showFolderModal}
        onClose={() => {
          setShowFolderModal(false);
          setEditingFolder(null);
        }}
        title={editingFolder ? "Edit Folder" : "Create New Folder"}
        size="sm"
      >
        <FolderForm
          folder={editingFolder}
          onSubmit={handleFolderSubmit}
          onCancel={() => {
            setShowFolderModal(false);
            setEditingFolder(null);
          }}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setBookmarkToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Bookmark"
        message={`Are you sure you want to delete "${bookmarkToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default BookmarkPage;