
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'How It Works', path: '/how-it-works' },
    { title: 'About', path: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-medium tracking-tight">
            <span className="text-primary">Savvy</span>
            <span className="font-light">Invest</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === link.path 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/auth?mode=login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/auth?mode=signup">Get Started</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-foreground focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md animate-fade-in">
          <div className="container mx-auto px-4 py-6">
            <ul className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className={`text-base font-medium transition-colors hover:text-primary ${
                      location.pathname === link.path 
                        ? 'text-primary' 
                        : 'text-foreground'
                    }`}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
              <li className="pt-4 border-t border-border">
                <Link 
                  to="/auth?mode=login" 
                  className="text-base font-medium text-foreground hover:text-primary transition-colors"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link 
                  to="/auth?mode=signup"
                  className="text-base font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
