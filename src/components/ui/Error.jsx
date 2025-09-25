import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-error" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Oops! Something went wrong</h3>
          <p className="mt-2 text-sm text-gray-600">{message}</p>
        </div>

        {onRetry && (
          <Button onClick={onRetry} className="mt-4">
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;