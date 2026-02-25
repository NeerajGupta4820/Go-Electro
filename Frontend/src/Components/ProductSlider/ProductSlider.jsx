import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/Components/ui/carousel";
import ProductCard from "../ProductCard/ProductCard";
import Loader from "../Loader/Loader";

const ProductSlider = ({ products, title, isLoading, link }) => {
  return (
    <div className="p-8 bg-white rounded-lg shadow-[0_2px_8px_rgba(35,39,47,0.07)] max-w-[95vw] mx-auto mb-8 font-['Inter','Roboto','Segoe_UI',Arial,sans-serif] md:p-[1.2rem_0.5rem] sm:p-[0.8rem_0.2rem]">
      <div className="flex items-center justify-between px-6 sm:px-8 pt-8 pb-6 border-b border-border/50">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
        {link && (
          <Link
            to="allProducts"
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200 flex items-center gap-1 group"
          >
            View All
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        )}
      </div>
      <main className="relative">
        {isLoading ? (
          <Loader type="data" />
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true, // Enable looping like original slider
            }}
            className="w-95vw"
          >
            <CarouselContent className="flex">
              {products.map((product, index) => (
                <CarouselItem
                  key={`${product._id}-${index}`}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/4 p-4 pl-8"
                >
                  <ProductCard
                    product={product}
                    className="flex-[0_0_auto] transition-[width,transform] duration-300 ease-in-out md:w-[150px]"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious
              variant="default"
              size="icon"
              className="rounded-full w-11 h-11 z-10  left-[-20px]"
            >
              <ArrowLeftIcon className="h-8 w-8" />
            </CarouselPrevious>
            <CarouselNext
              variant="default"
              size="icon"
              className="rounded-full w-11 h-11 z-10  right-[-24px]"
            >
              <ArrowRightIcon className="h-8 w-8" />
            </CarouselNext>
          </Carousel>
        )}
      </main>
    </div>
  );
};

export default ProductSlider;
