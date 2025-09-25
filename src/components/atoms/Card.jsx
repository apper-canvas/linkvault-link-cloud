import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className,
  hover = false,
  children,
  ...props 
}, ref) => {
  const baseClasses = "rounded-lg border border-gray-200 bg-surface shadow-sm";
  const hoverClasses = hover ? "hover:-translate-y-0.5 transition-transform duration-200 ease-out cursor-pointer" : "";

  return (
    <div
      className={cn(baseClasses, hoverClasses, className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;