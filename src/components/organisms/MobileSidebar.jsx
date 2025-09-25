import { useEffect } from "react";
import Sidebar from "./Sidebar";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const MobileSidebar = ({ 
  isOpen, 
  onClose, 
  ...sidebarProps 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-out">
        <div className="h-full bg-surface">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ApperIcon name="Bookmark" className="text-primary" size={24} />
              LinkVault
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-auto"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>
          
          <div className="h-[calc(100vh-73px)] overflow-hidden">
            <Sidebar {...sidebarProps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;