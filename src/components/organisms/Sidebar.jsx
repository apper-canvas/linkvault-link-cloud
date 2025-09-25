import { useState } from "react";
import FolderItem from "@/components/molecules/FolderItem";
import TagItem from "@/components/molecules/TagItem";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({
  folders,
  tags,
  activeFolder,
  activeTags,
  bookmarkCounts,
  onFolderSelect,
  onTagToggle,
  onShowAllBookmarks,
  onCreateFolder
}) => {
  const [expandedSections, setExpandedSections] = useState({
    folders: true,
    tags: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isAllBookmarksActive = !activeFolder && activeTags.length === 0;

  return (
    <div className="w-64 bg-surface border-r border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <ApperIcon name="Bookmark" className="text-primary" size={24} />
          LinkVault
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* All Bookmarks */}
        <div>
          <button
            onClick={onShowAllBookmarks}
            className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors text-left ${
              isAllBookmarksActive 
                ? "bg-primary/10 text-primary border-r-2 border-primary" 
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ApperIcon name="BookOpen" size={16} className="mr-3 flex-shrink-0" />
            <span className="flex-1">All Bookmarks</span>
            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {bookmarkCounts.total || 0}
            </span>
          </button>
        </div>

        {/* Folders Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={() => toggleSection("folders")}
              className="flex items-center text-sm font-medium text-gray-900 hover:text-primary"
            >
              <ApperIcon 
                name={expandedSections.folders ? "ChevronDown" : "ChevronRight"} 
                size={16} 
                className="mr-1" 
              />
              Folders
            </button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateFolder}
              className="p-1 h-auto text-gray-400 hover:text-primary"
            >
              <ApperIcon name="Plus" size={14} />
            </Button>
          </div>

          {expandedSections.folders && (
            <div className="space-y-1 ml-2">
              {folders.length === 0 ? (
                <p className="text-xs text-gray-500 px-3 py-2">No folders yet</p>
              ) : (
                folders.map((folder) => (
                  <FolderItem
                    key={folder.Id}
                    folder={folder}
                    isActive={activeFolder?.Id === folder.Id}
                    onClick={onFolderSelect}
                    bookmarkCount={bookmarkCounts.folders[folder.Id] || 0}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection("tags")}
            className="flex items-center text-sm font-medium text-gray-900 hover:text-primary"
          >
            <ApperIcon 
              name={expandedSections.tags ? "ChevronDown" : "ChevronRight"} 
              size={16} 
              className="mr-1" 
            />
            Tags
          </button>

          {expandedSections.tags && (
            <div className="space-y-2 ml-2">
              {tags.length === 0 ? (
                <p className="text-xs text-gray-500 px-3 py-2">No tags yet</p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {tags.slice(0, 15).map((tag) => (
                    <TagItem
                      key={tag.name}
                      tag={tag}
                      isActive={activeTags.includes(tag.name)}
                      onClick={() => onTagToggle(tag.name)}
                    />
                  ))}
                  {tags.length > 15 && (
                    <p className="text-xs text-gray-500 px-2 py-1">
                      +{tags.length - 15} more
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recently Added */}
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors text-gray-700 hover:bg-gray-100 text-left">
          <ApperIcon name="Clock" size={16} className="mr-3 flex-shrink-0" />
          <span>Recently Added</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;