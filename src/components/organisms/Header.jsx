import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  onSearch, 
  onAddBookmark,
  onToggleMobileSidebar,
  searchQuery = "" 
}) => {
  return (
    <header className="bg-surface border-b border-gray-200 px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 h-auto"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-gray-900">Your Bookmarks</h1>
            <p className="text-sm text-gray-600">Organize and access your saved links</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <SearchBar
            onSearch={onSearch}
            placeholder="Search bookmarks, tags, or URLs..."
            className="flex-1"
          />
          
          <Button onClick={onAddBookmark} className="flex items-center gap-2">
            <ApperIcon name="Plus" size={16} />
            <span className="hidden sm:inline">Add Bookmark</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;