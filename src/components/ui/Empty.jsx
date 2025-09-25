import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No bookmarks yet",
  message = "Start building your bookmark collection by adding your first link",
  actionText = "Add Your First Bookmark",
  onAction,
  icon = "BookOpen",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} size={36} className="text-gray-400" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-gray-600">{message}</p>
        </div>

        {onAction && (
          <Button onClick={onAction} size="lg" className="mt-6">
            <ApperIcon name="Plus" size={18} className="mr-2" />
            {actionText}
          </Button>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p>💡 Tips for better organization:</p>
          <ul className="mt-2 space-y-1 text-left">
            <li>• Use folders to categorize by topic</li>
            <li>• Add tags for flexible filtering</li>
            <li>• Include descriptions for context</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Empty;