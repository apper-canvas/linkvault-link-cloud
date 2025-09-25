import { useState } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { formatDistanceToNow } from "date-fns";

const BookmarkCard = ({ 
  bookmark, 
  onEdit, 
  onDelete, 
  onFolderClick,
  folder 
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleOpenLink = () => {
    window.open(bookmark.url, "_blank", "noopener,noreferrer");
  };

  const getDomainFromUrl = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  const getFaviconUrl = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  return (
    <Card 
      hover 
      className="p-4 group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 mt-0.5">
              <img
                src={getFaviconUrl(bookmark.url)}
                alt=""
                className="w-5 h-5 rounded-sm"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="w-5 h-5 rounded-sm bg-gray-100 items-center justify-center hidden">
                <ApperIcon name="Globe" size={12} className="text-gray-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <button
                onClick={handleOpenLink}
                className="text-left w-full group-hover:text-primary transition-colors"
              >
                <h3 className="font-medium text-gray-900 truncate">
                  {bookmark.title}
                </h3>
                <p className="text-sm text-secondary truncate mt-1">
                  {getDomainFromUrl(bookmark.url)}
                </p>
              </button>
            </div>
          </div>
          
          {/* Actions */}
          <div className={`flex items-center gap-1 transition-opacity ${showActions ? "opacity-100" : "opacity-0"}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(bookmark)}
              className="p-1.5 h-auto"
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(bookmark)}
              className="p-1.5 h-auto text-gray-400 hover:text-error"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </div>
        </div>

        {/* Description */}
        {bookmark.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {bookmark.description}
          </p>
        )}

        {/* Tags */}
        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {bookmark.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} size="sm" variant="primary">
                {tag}
              </Badge>
            ))}
            {bookmark.tags.length > 3 && (
              <Badge size="sm" variant="default">
                +{bookmark.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            {folder && (
              <button
                onClick={() => onFolderClick?.(folder)}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <ApperIcon name="Folder" size={12} />
                {folder.name}
              </button>
            )}
            <span>
              {formatDistanceToNow(new Date(bookmark.createdAt), { addSuffix: true })}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenLink}
            className="p-1 h-auto text-gray-400 hover:text-primary"
          >
            <ApperIcon name="ExternalLink" size={12} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BookmarkCard;