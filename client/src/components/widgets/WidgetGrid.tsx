import { ReactNode } from "react";

interface WidgetGridProps {
  children: ReactNode;
}

export function WidgetGrid({ children }: WidgetGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 auto-rows-min">
      {children}
    </div>
  );
}

interface WidgetContainerProps {
  children: ReactNode;
  className?: string;
  colSpan?: 4 | 6 | 8 | 12;
}

export function WidgetContainer({ children, className = "", colSpan = 12 }: WidgetContainerProps) {
  const colSpanClass = {
    4: "lg:col-span-4",
    6: "lg:col-span-6",
    8: "lg:col-span-8",
    12: "lg:col-span-12",
  }[colSpan];

  return (
    <div className={`${colSpanClass} ${className}`}>
      {children}
    </div>
  );
}
