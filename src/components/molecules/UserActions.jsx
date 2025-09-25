import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const UserActions = () => {
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);
  
  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };
  
  return (
    <div className="flex items-center gap-3">
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md">
        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
          {user?.firstName?.charAt(0) || user?.emailAddress?.charAt(0) || 'U'}
        </div>
        <span className="text-sm text-gray-700">
          {user?.firstName || user?.emailAddress?.split('@')[0] || 'User'}
        </span>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <ApperIcon name="LogOut" size={16} />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
};

export default UserActions;