"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Calendar, User, MessageCircle, Info, Users } from "lucide-react";

const FloatingNav = () => {
  const [active, setActive] = useState(() => {
    // Set active state based on current page
    const path = window.location.pathname;
    if (path === '/announcements') return 4;
    if (path === '/events') return 2;
    return 0;
  });
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const items = [
    { id: 0, icon: <Home size={22} />, label: "Home", href: "#home" },
    { id: 1, icon: <Info size={22} />, label: "About", href: "#about" },
    { id: 2, icon: <Calendar size={22} />, label: "Events", href: "/events" },
    { id: 3, icon: <MessageCircle size={22} />, label: "FAQ", href: "#faq" },
    { id: 4, icon: <Users size={22} />, label: "Announcements", href: "/announcements" },
  ];

  // Update indicator position when active changes or resize
  useEffect(() => {
    const updateIndicator = () => {
      if (btnRefs.current[active] && containerRef.current) {
        const btn = btnRefs.current[active];
        const container = containerRef.current;
        if (!btn) return;
        const btnRect = btn.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setIndicatorStyle({
          width: btnRect.width,
          left: btnRect.left - containerRect.left,
        });
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [active]);

  // Update active state when route changes
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/announcements') setActive(4);
    else if (path === '/events') setActive(2);
    else if (path === '/') setActive(0);
  }, []);

  const handleClick = (index: number, href: string) => {
    setActive(index);
    if (href.startsWith('#')) {
      // Check if we're on the home page
      if (window.location.pathname === '/') {
        const element = document.querySelector(href);
        if (element) {
          // Account for fixed header height (approx 80px)
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        // Navigate to home page with the hash
        window.location.href = '/' + href;
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-2">
      <div
        ref={containerRef}
        className="relative flex items-center justify-between bg-background/95 backdrop-blur-sm shadow-xl rounded-full px-1 py-2 border border-border"
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => (btnRefs.current[index] = el)}
            onClick={() => handleClick(index, item.href)}
            className="relative flex flex-col items-center justify-center flex-1 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <div className="z-10">{item.icon}</div>
            {/* hide labels on small screens */}
            <span className="text-xs mt-1 hidden sm:block">{item.label}</span>
          </button>
        ))}

        {/* Sliding Active Indicator */}
        <motion.div
          animate={indicatorStyle}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute top-1 bottom-1 rounded-full bg-primary/20"
        />
      </div>
    </div>
  );
};

export default FloatingNav;