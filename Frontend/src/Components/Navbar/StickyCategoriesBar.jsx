import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const StickyCategoriesBar = ({ categories = [], onCategoryClick, visible = true, selectedCategory }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Check scroll position to show/hide arrows
  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [categories]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!visible || !categories?.length) return null;

  return (
    <div className="sticky top-14 lg:top-16 z-40 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto relative">
        {/* Left scroll button */}
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border border-border shadow-md hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}

        {/* Categories scroll container */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-center justify-between gap-4 px-4 py-3 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category._id;
            return (
              <button
                key={category._id}
                onClick={() => onCategoryClick(category._id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 shrink-0 group border hover:shadow-md hover:-translate-y-0.5 ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-background border-border hover:bg-yellow-400/10 hover:border-yellow-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all group-hover:scale-110 ${
                    isSelected ? "border-primary-foreground" : "border-border"
                  }`}
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="font-medium text-sm">{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right scroll button */}
        {showRightArrow && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border border-border shadow-md hover:bg-muted"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default StickyCategoriesBar;