import { Marquee } from "@/components/ui/marquee"
import { useState, useRef, useEffect } from "react"

interface MarqueeDemoProps {
  data: Array<{
    website: string;
    logoUrl: string;
    has_dark_mode: boolean;
    is_default: boolean;
  }>;
  activeMode: 'dark' | 'light';
  onLogoClick?: (website: string) => void;
}

export function MarqueeDemo({ data, activeMode, onLogoClick }: MarqueeDemoProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const PIXELS_PER_SECOND = 50; // Adjust this value to control speed

  const getHostname = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return hostname.startsWith('www.') ? hostname.slice(4) : hostname;
    } catch {
      return url;
    }
  };

  const getFaviconUrl = (website: string) => {
    const hostname = getHostname(website);
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  };

  // Remove duplicates based on hostname
  const deduplicatedData = data.reduce((acc, current) => {
    const hostname = getHostname(current.website);
    const exists = acc.find(item => getHostname(item.website) === hostname);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, [] as typeof data);

  const filteredData = deduplicatedData.filter(item => {
    // If there's a search query, search across all websites
    if (searchQuery) {
      return getHostname(item.website).toLowerCase().includes(searchQuery.toLowerCase());
    }
    // If no search query, filter by dark/light mode
    return activeMode === 'dark' ? item.has_dark_mode : !item.has_dark_mode;
  });

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    if (!containerRef.current) return;

    const progress = timestamp - startTimeRef.current;
    const pixels = (progress / 1000) * PIXELS_PER_SECOND;
    
    if (pixels >= scrollWidth / 2) {
      // Reset animation when we've moved half the width
      startTimeRef.current = timestamp;
      containerRef.current.style.transform = 'translateX(0)';
    } else {
      containerRef.current.style.transform = `translateX(-${pixels}px)`;
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.scrollWidth;
      setScrollWidth(width);
      
      // Start animation
      startTimeRef.current = undefined;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [filteredData]);

  return (
    <div className="w-full max-w-[1200px] my-8">
      <div className="relative">
        <div className="relative flex items-center">
          <i className="fas fa-search absolute left-3 text-gray-400 -translate-y-2"></i>
          <input
            type="text"
            placeholder="Search a website..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-4 pl-10 pr-10 py-2 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
          />
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute right-3 text-gray-400 hover:text-white ${!searchQuery && 'hidden'}`}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-lg rounded-lg py-8 text-center text-gray-400">
          No websites found matching "{searchQuery}"
        </div>
      ) : (
        <div className="bg-black/40 backdrop-blur-lg rounded-lg py-8 overflow-hidden">
          <div 
            ref={containerRef}
            className="flex"
            style={{
              width: 'max-content',
            }}
          >
            {[...filteredData, ...filteredData].map((item, index) => (
              <div
                key={`${getHostname(item.website)}-${index}`}
                className="relative h-full w-fit mx-[3rem] flex items-center justify-start cursor-pointer hover:scale-110 transition-transform duration-200"
                onClick={() => onLogoClick?.(item.website)}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 flex items-center justify-center min-w-[80px] min-h-[80px]">
                  <img 
                    src={getFaviconUrl(item.website)}
                    alt={`Logo for ${getHostname(item.website)}`}
                    className="h-[48px] w-[48px] object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-logo.png';
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 