import { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import AnimatedGlowingSearchBar from "@/components/ui/animated-glowing-search-bar";
import logoImage from "@/assets/breaking-math-logo-latest.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin, isOverseer } = useAuth();
  const menuItems = [{
    label: "Home",
    href: "/"
  }, {
    label: "About Us",
    href: "#about"
  }, {
    label: "Events",
    href: "/events"
  }, {
    label: "Announcements",
    href: "/announcements"
  }, {
    label: "Contact",
    href: "#contact"
  }];
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-all duration-300 hover:border-primary/30">
      <div className="w-full px-2 lg:px-1 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left side with animation */}
          <div className="flex items-center space-x-2 lg:ml-1 animate-fade-in group">
            <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <img 
                src={logoImage} 
                alt="Breaking Math Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 object-contain"
              />
            </div>
            {/* Desktop/Laptop - Horizontal layout */}
            <div className="hidden sm:block ml-1">
              <h1 className="text-lg lg:text-xl xl:text-2xl font-bold text-primary whitespace-nowrap group-hover:scale-105 transition-transform duration-300">Breaking Math</h1>
              <p className="text-xs lg:text-sm text-muted-foreground whitespace-nowrap">Bramalea Secondary School</p>
            </div>
            {/* Mobile - Vertical layout */}
            <div className="sm:hidden ml-1">
              <div>
                <h1 className="text-sm font-bold text-primary leading-tight">Breaking Math</h1>
                <p className="text-xs text-muted-foreground leading-tight">Bramalea Secondary School</p>
              </div>
            </div>
          </div>

          {/* Right side - Admin Panel and Search Bar (desktop/laptop only) */}
          <div className="flex items-center space-x-2 lg:mr-1 animate-fade-in" style={{ animationDelay: "200ms" }}>
            {/* Admin Panel - Desktop only */}
            {(isAdmin || isOverseer) && (
              <div className="hidden md:block">
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="whitespace-nowrap hover:scale-105 transition-transform duration-300 hover:border-primary/50 group">
                    <Shield className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Admin
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Search Bar - Desktop and laptop only, not on mobile */}
            <div className="hidden sm:block">
              <AnimatedGlowingSearchBar />
            </div>

            {/* Mobile Menu Button with animation */}
            <div className="md:hidden ml-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              >
                {isMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with animation */}
        {isMenuOpen && <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item, index) => item.href.startsWith('#') ? (
                window.location.pathname === '/' ? 
                  <a 
                    key={item.label} 
                    href={item.href} 
                    className="text-foreground hover:text-primary transition-all font-medium py-2 hover:translate-x-2 duration-300 animate-fade-in" 
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a> : 
                  <Link 
                    key={item.label} 
                    to={'/' + item.href} 
                    className="text-foreground hover:text-primary transition-all font-medium py-2 hover:translate-x-2 duration-300 animate-fade-in" 
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
              ) : <Link 
                    key={item.label} 
                    to={item.href} 
                    className="text-foreground hover:text-primary transition-all font-medium py-2 hover:translate-x-2 duration-300 animate-fade-in" 
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>)}
              {(isAdmin || isOverseer) && (
                <Link 
                  to="/admin" 
                  className="text-foreground hover:text-primary transition-all font-medium py-2 hover:translate-x-2 duration-300 animate-fade-in" 
                  style={{ animationDelay: `${menuItems.length * 50}ms` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </nav>}
      </div>
    </header>;
};
export default Header;