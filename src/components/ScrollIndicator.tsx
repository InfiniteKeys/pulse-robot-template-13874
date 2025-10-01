import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Hide the indicator after scrolling down 100px
      if (window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40 cursor-pointer animate-bounce-subtle"
      onClick={scrollToContent}
    >
      <div className="flex flex-col items-center group">
        <div className="text-sm text-muted-foreground mb-2 group-hover:text-primary transition-colors">
          Scroll to explore
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-slow"></div>
          <div className="relative bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full p-3 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300">
            <ChevronDown className="h-6 w-6 text-primary animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollIndicator;
