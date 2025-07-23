import * as React from "react";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = "", value = 0, max = 100, ...props }, ref) => (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={`relative w-full h-3 bg-gray-700 rounded-full ${className}`}
      {...props}
    >
      <div
        className="absolute left-0 top-0 h-3 bg-green-500 rounded-full transition-all duration-300"
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
  )
);
Progress.displayName = "Progress";
export { Progress };
