import { ReactNode, useEffect, useRef } from "react";

interface TimelineItemProps {
  year: string;
  title: string;
  children: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  isLeft?: boolean;
}

const TimelineItem = ({ 
  year, 
  title, 
  children, 
  imageSrc, 
  imageAlt = "ECOviva timeline image",
  isLeft = false
}: TimelineItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    
    if (itemRef.current) {
      observer.observe(itemRef.current);
    }
    
    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);
  
  return (
    <div 
      ref={itemRef}
      className={`reveal-animation relative grid grid-cols-1 ${
        isLeft 
          ? "md:grid-cols-[1fr_auto_1fr] md:text-right" 
          : "md:grid-cols-[1fr_auto_1fr] md:[&>*:first-child]:col-start-3"
      } gap-4 md:gap-8 pb-12 md:pb-16`}
    >
      {/* Content */}
      <div className="space-y-3">
        <div className="inline-block px-3 py-1 rounded-full bg-eco-100 text-eco-800 text-sm font-medium">
          {year}
        </div>
        <h3 className="text-xl font-semibold text-eco-800">{title}</h3>
        <div className="text-eco-700 max-w-lg md:mx-auto">{children}</div>
        
        {imageSrc && (
          <div className="mt-5 overflow-hidden rounded-lg shadow-md">
            <img 
              src={imageSrc} 
              alt={imageAlt}
              className="w-full h-auto object-cover transition-transform hover:scale-105 duration-700"
              loading="lazy"
            />
          </div>
        )}
      </div>
      
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        <div className="h-full w-0.5 bg-eco-200"></div>
        <div className="absolute top-0 w-5 h-5 rounded-full border-4 border-eco-100 bg-eco-500 z-10"></div>
      </div>
      
      {/* Empty column for layout on desktop */}
      <div className="hidden md:block"></div>
    </div>
  );
};

export default TimelineItem;