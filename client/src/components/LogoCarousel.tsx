import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LogoCarouselProps {
  items: string[];
  title: string;
}

export function LogoCarousel({ items, title }: LogoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + itemsPerPage) % items.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [items.length]);

  const visibleItems = [];
  for (let i = 0; i < itemsPerPage; i++) {
    visibleItems.push(items[(currentIndex + i) % items.length]);
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-muted-foreground mb-4 text-center">
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {visibleItems.map((item, idx) => (
          <div
            key={`${currentIndex}-${idx}`}
            className={cn(
              "flex items-center justify-center h-16 px-4 rounded-md border border-border bg-card",
              "hover-elevate transition-all duration-300",
              "animate-in fade-in slide-in-from-bottom-2"
            )}
            style={{
              animationDelay: `${idx * 50}ms`,
              animationDuration: "400ms",
            }}
          >
            <span className="text-xs text-center font-medium text-muted-foreground">
              {item}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: Math.ceil(items.length / itemsPerPage) }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx * itemsPerPage)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              Math.floor(currentIndex / itemsPerPage) === idx
                ? "w-6 bg-primary"
                : "w-1.5 bg-border hover-elevate"
            )}
            data-testid={`carousel-dot-${idx}`}
          />
        ))}
      </div>
    </div>
  );
}
