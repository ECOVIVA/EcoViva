import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, User, LogOut, LogIn, ChevronDown, Globe, Award, Users, Menu, X } from 'lucide-react';
import { useAuth } from './Auth/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const [isDropdownExiting, setIsDropdownExiting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navbarClass = `fixed w-full z-50 transition-all duration-500 ${
    isScrolled ? 'bg-green-800/95 shadow-md backdrop-blur-lg py-2' : 'bg-white/80 py-2'
  }`;

  const menuItems = [
    {
      label: 'Nossa historia',
      submenu: [
        { label: 'Nossa Historia', icon: Globe, href: '/HistorySection' },
        { label: 'Impacto', icon: Leaf, href: '/impactPage' },
        { label: 'Certificações', icon: Award, href: '/certificatePage' },
      ]
    },
    {
      label: 'Comunidade',
      href: '/Forum'
    },
    {
      label: 'Programas',
      submenu: [
        { label: 'Reciclagem do dia', icon: Leaf, href: '/CheckInPage' },
        { label: 'ECOstudy', icon: Globe, href: '/ECOstudy' },
        { label: 'Parcerias', icon: Users, href: '/ParceriasPage' },
      ]
    }
  ];

  const handleMouseEnter = (label: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsDropdownExiting(false);
    setShowDropdown(label);
  };

  const handleMouseLeave = () => {
    setIsDropdownExiting(true);
    const timeout = window.setTimeout(() => {
      setShowDropdown('');
      setIsDropdownExiting(false);
    }, 500);
    setHoverTimeout(timeout);
  };

  return (
    <>
      <nav className={navbarClass}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              aria-label="Home"
            >
              <div className="relative">
                <div className={`absolute inset-0 rounded-full blur-[5px] ${isScrolled ? 'bg-green-400/50' : 'bg-green-500/20'} group-hover:bg-green-500/30 transition-all duration-300`}></div>
                <Leaf className={`h-8 w-8 relative z-10 ${isScrolled ? 'text-green-300' : 'text-green-600'} transform group-hover:rotate-12 transition-all duration-300`} />
              </div>
              <div className="flex flex-col">
                <span className="text-5xl font-bold transition-colors duration-300">
                  <span className={isScrolled ? "text-green-300" : "text-green-600"}>Eco</span>
                  <span className={isScrolled ? "text-green-100" : "text-gray-800"}>Viva</span>
                </span>
                <span className={`text-xs ${isScrolled ? 'text-green-300/80' : 'text-gray-500'}`}>Sustentabilidade Em Ação</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.href ? (
                    <Link
                      to={item.href}
                      className={`link-with-underline flex items-center space-x-1 ${
                        isScrolled ? 'text-green-100 hover:text-green-300' : 'text-gray-800 hover:text-green-600'
                      } transition-colors duration-300 px-1 py-2`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      className={`link-with-underline flex items-center space-x-1 ${
                        isScrolled ? 'text-green-100 hover:text-green-300' : 'text-gray-800 hover:text-green-600'
                      } transition-colors duration-300 px-1 py-2`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                    </button>
                  )}

                  {item.submenu && showDropdown === item.label && (
                    <div
                      ref={dropdownRef}
                      className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 w-56 rounded-xl overflow-hidden ${
                        isScrolled ? 'bg-green-900/90' : 'bg-white backdrop-blur-lg'
                      } ${
                        isDropdownExiting ? 'dropdown-exit' : 'dropdown-enter'
                      }`}
                    >
                      <div className="py-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className={`flex items-center space-x-3 px-4 py-3 ${
                              isScrolled 
                                ? 'hover:bg-green-800/60 text-green-100' 
                                : 'hover:bg-black/5 text-gray-700'
                            } transition-colors duration-200`}
                          >
                            <subItem.icon className={`h-5 w-5 ${isScrolled ? 'text-green-300' : 'text-green-600'}`} />
                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden rounded-full p-2 ${
                  isScrolled ? 'text-green-100 hover:bg-green-700/50' : 'text-gray-800 hover:bg-gray-100'
                } transition-colors duration-200`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              <div className="hidden lg:flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/ProfilePage"
                      className="flex items-center space-x-2 group"
                    >
                      {user?.photo ? (
                        <img
                          src={`http://localhost:8000/${user.photo}`}
                          alt={user.name}
                          className={`w-10 h-10 rounded-full border-2 ${
                            isScrolled ? 'border-green-600/50 group-hover:border-green-500' : 'border-green-600/30 group-hover:border-green-600'
                          } transition-colors duration-300`}
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            isScrolled ? 'border-green-600/50 group-hover:border-green-500 text-green-100' : 'border-green-600/30 group-hover:border-green-600 text-gray-700'
                          } transition-colors duration-300`}>
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`rounded-full p-2 ${
                        isScrolled ? 'text-green-100 hover:bg-green-700/50' : 'text-gray-700 hover:bg-gray-100'
                      } transition-colors duration-200`}
                      aria-label="Log out"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className={`rounded-full p-2 ${
                      isScrolled ? 'text-green-100 hover:bg-green-700/50' : 'text-gray-700 hover:bg-gray-100'
                    } transition-colors duration-200`}
                    aria-label="Log in"
                  >
                    <LogIn className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-[280px] ${isScrolled ? 'bg-green-900' : 'bg-white'} z-50 shadow-xl lg:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className={`rounded-full p-2 ${
              isScrolled ? 'text-green-100 hover:bg-green-800' : 'text-gray-800 hover:bg-gray-100'
            } transition-colors duration-200`}
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-2 space-y-4">
          {menuItems.map((item) => (
            <div key={item.label} className="py-1">
              {item.href ? (
                <Link
                  to={item.href}
                  className={`block py-3 ${
                    isScrolled ? 'text-green-100 hover:text-green-300' : 'text-gray-800 hover:text-green-600'
                  } transition-colors text-lg font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-medium ${
                      isScrolled ? 'text-green-100' : 'text-gray-800'
                    }`}>{item.label}</span>
                  </div>
                  <div className={`pl-4 border-l-2 ${
                    isScrolled ? 'border-green-700' : 'border-gray-200'
                  } space-y-3 mt-2`}>
                    {item.submenu?.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        className={`flex items-center py-2 space-x-3 ${
                          isScrolled ? 'text-green-200 hover:text-green-100' : 'text-gray-700 hover:text-green-600'
                        } transition-colors`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <subItem.icon className={`h-5 w-5 ${
                          isScrolled ? 'text-green-400' : 'text-green-600'
                        }`} />
                        <span>{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Mobile Auth Actions */}
          <div className={`pt-4 mt-4 border-t ${
            isScrolled ? 'border-green-700' : 'border-gray-200'
          }`}>
            {isAuthenticated ? (
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className={`flex items-center space-x-3 py-2 ${
                    isScrolled ? 'text-green-200 hover:text-green-100' : 'text-gray-800 hover:text-green-600'
                  } transition-colors`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full py-2 ${
                    isScrolled ? 'text-green-200 hover:text-red-300' : 'text-gray-800 hover:text-red-500'
                  } transition-colors`}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Log out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className={`flex items-center space-x-3 py-2 ${
                  isScrolled ? 'text-green-200 hover:text-green-100' : 'text-gray-800 hover:text-green-600'
                } transition-colors`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn className="h-5 w-5" />
                <span>Log in</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;