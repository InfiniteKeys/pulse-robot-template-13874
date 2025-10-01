import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const AnimatedGlowingSearchBar = () => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase();
      
      // Enhanced search functionality
      const searchMappings = {
        'about': 'about',
        'events': 'events', 
        'announcements': '/announcements',
        'contact': 'contact',
        'faq': 'faq',
        'timeline': 'timeline',
        'math': 'about',
        'club': 'about',
        'join': 'join',
        'team': 'about',
        'news': '/announcements'
      };
      
      // Find matching section or route
      const match = Object.keys(searchMappings).find(key => 
        searchTerm.includes(key) || key.includes(searchTerm)
      );
      
      if (match) {
        const target = searchMappings[match];
        if (target.startsWith('/')) {
          // Navigate to different page
          window.location.href = target;
        } else {
          // Scroll to section on current page
          const element = document.getElementById(target);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        setSearchValue(''); // Clear search after action
      } else {
        // Fallback: search page content
        const pageText = document.body.innerText.toLowerCase();
        if (pageText.includes(searchTerm)) {
          // Could implement text highlighting here
          alert(`Found "${searchTerm}" on this page!`);
        } else {
          alert(`No results found for "${searchTerm}"`);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center justify-center w-full max-w-xs">
      <div className="relative flex items-center justify-center group w-full">
        {/* Simple glow outline */}
        <div className="absolute inset-0 rounded-lg border-2 border-primary/30 group-focus-within:border-primary/60 group-hover:border-primary/50 transition-colors duration-300">
        </div>

        <div className="relative bg-background/95 backdrop-blur-sm border border-border rounded-lg overflow-hidden w-full z-10">
          <input 
            placeholder="Search..." 
            type="text" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent border-none w-full h-[40px] rounded-lg text-foreground px-10 pr-12 text-sm focus:outline-none placeholder-muted-foreground" 
          />
          
          <button 
            type="button"
            className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center h-7 w-7 rounded-md bg-muted/50 hover:bg-muted transition-colors border border-border/50"
          >
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AnimatedGlowingSearchBar;