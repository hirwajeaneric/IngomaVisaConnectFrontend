import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Globe, ChevronDown } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import { authService } from "@/lib/api/services/auth.service";

interface UserData {
  email: string;
  name: string;
  role: string;
  permissions: string[];
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'fr'>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status on mount and when auth state changes
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        setUser(authService.getCurrentUser());
      } else {
        setUser(null);
      }
    };

    checkAuth();
    // You might want to add an event listener here to check auth status when it changes
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Logged out successfully");
    window.location.href = '/';
  };

  const handleLanguageChange = (language: 'en' | 'fr') => {
    setCurrentLanguage(language);
    toast.success(
      language === 'en' 
        ? 'The application language has been set to English.' 
        : 'La langue de l\'application a été définie sur le français.'
    );
  };

  const languages = {
    en: {
      name: 'English',
      flag: '🇬🇧'
    },
    fr: {
      name: 'Français',
      flag: '🇫🇷'
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">IV</span>
          </div>
          <span className="font-bold text-xl text-primary hidden sm:inline">INGOMA VISA CONNECT</span>
          <span className="font-bold text-xl text-primary sm:hidden">IVC</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-primary transition">Home</Link>
          <Link to="/visa-types" className="text-gray-700 hover:text-primary transition">Visa Types</Link>
          <Link to="/requirements" className="text-gray-700 hover:text-primary transition">Requirements</Link>
          <Link to="/faqs" className="text-gray-700 hover:text-primary transition">FAQs</Link>
          <Link to="/contact" className="text-gray-700 hover:text-primary transition">Contact</Link>
          
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 px-2">
                <Globe size={16} />
                <span>{languages[currentLanguage].flag}</span>
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleLanguageChange('en')}
                className={currentLanguage === 'en' ? 'bg-accent/50' : ''}
              >
                <span className="mr-2">{languages.en.flag}</span> {languages.en.name}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange('fr')}
                className={currentLanguage === 'fr' ? 'bg-accent/50' : ''}
              >
                <span className="mr-2">{languages.fr.flag}</span> {languages.fr.name}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <User size={16} />
                    <span>{user?.name || 'Account'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/visa-types" className="cursor-pointer">Apply for Visa</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="bg-primary hover:bg-primary/90">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Mobile Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2 px-2">
                <Globe size={16} />
                <span>{languages[currentLanguage].flag}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleLanguageChange('en')}
                className={currentLanguage === 'en' ? 'bg-accent/50' : ''}
              >
                <span className="mr-2">{languages.en.flag}</span> {languages.en.name}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLanguageChange('fr')}
                className={currentLanguage === 'fr' ? 'bg-accent/50' : ''}
              >
                <span className="mr-2">{languages.fr.flag}</span> {languages.fr.name}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 right-0 z-50 animate-fadeIn">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link to="/" className="text-gray-700 hover:text-primary py-2 transition" onClick={toggleMenu}>Home</Link>
            <Link to="/visa-types" className="text-gray-700 hover:text-primary py-2 transition" onClick={toggleMenu}>Visa Types</Link>
            <Link to="/requirements" className="text-gray-700 hover:text-primary py-2 transition" onClick={toggleMenu}>Requirements</Link>
            <Link to="/faqs" className="text-gray-700 hover:text-primary py-2 transition" onClick={toggleMenu}>FAQs</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary py-2 transition" onClick={toggleMenu}>Contact</Link>
            
            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-500 hover:text-red-600"
                    onClick={() => {
                      handleLogout();
                      toggleMenu();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={toggleMenu}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={toggleMenu}>
                    <Button className="w-full bg-primary hover:bg-primary/90">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
