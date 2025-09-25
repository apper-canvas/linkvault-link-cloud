import BookmarkCard from "@/components/molecules/BookmarkCard";

const BookmarkGrid = ({ 
  bookmarks, 
  folders,
  onEdit, 
  onDelete, 
  onFolderClick 
}) => {
  const getFolderById = (folderId) => {
    return folders.find(folder => folder.Id === folderId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.Id}
          bookmark={bookmark}
          folder={getFolderById(bookmark.folderId)}
          onEdit={onEdit}
          onDelete={onDelete}
          onFolderClick={onFolderClick}
        />
      ))}
    </div>
  );
};

export default BookmarkGrid;