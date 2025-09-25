import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const TagItem = ({ 
  tag, 
  isActive, 
  onClick, 
  className 
}) => {
  return (
    <button
      onClick={() => onClick(tag)}
      className={cn(
        "text-left transition-opacity",
        isActive ? "opacity-100" : "opacity-70 hover:opacity-100",
        className
      )}
    >
      <Badge 
        variant={isActive ? "primary" : "default"}
        size="md"
        className="cursor-pointer"
      >
        {tag.name}
        <span className="ml-1 text-xs">({tag.count})</span>
      </Badge>
    </button>
  );
};

export default TagItem;