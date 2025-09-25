import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FolderItem = ({ 
  folder, 
  isActive, 
  onClick, 
  bookmarkCount = 0,
  className 
}) => {
  const colors = {
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    red: "text-red-500",
    yellow: "text-yellow-500",
    gray: "text-gray-500"
  };

  return (
    <button
      onClick={() => onClick(folder)}
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors text-left",
        isActive 
          ? "bg-primary/10 text-primary border-r-2 border-primary" 
          : "text-gray-700 hover:bg-gray-100",
        className
      )}
    >
      <ApperIcon 
        name="Folder" 
        size={16} 
        className={cn("mr-3 flex-shrink-0", colors[folder.color] || colors.gray)} 
      />
      <span className="flex-1 truncate">{folder.name}</span>
      {bookmarkCount > 0 && (
        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {bookmarkCount}
        </span>
      )}
    </button>
  );
};

export default FolderItem;