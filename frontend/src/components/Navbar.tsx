import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Leaf, User, LogOut, LogIn,
  ChevronDown, Globe, Award, Users, Menu, X
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<number | null>(null);
  const [isDropdownExiting, setIsDropdownExiting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
    isScrolled
      ? 'bg-green-900/95 backdrop-blur-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] py-2'
      : 'bg-white/80 backdrop-blur-sm shadow-sm py-4'
  }`;

  const menuItems = [
    {
      label: 'Sobre',
      submenu: [
        { label: 'Nossa História', icon: Globe, href: '/HistorySection' },
        { label: 'Impacto Ambiental', icon: Leaf, href: '/ImpactPage' },
        { label: 'Certificações', icon: Award, href: '/certificates' },
        { label: 'Equipe', icon: Users, href: '/team' },
      ]
    },
    {
      label: 'Comunidade',
      href: '/forum'
    },
    {
      label: 'Programas',
      submenu: [
        { label: 'Reciclagem Diária', icon: Leaf, href: '/checkin' },
        { label: 'Educação Ambiental', icon: Globe, href: '#education' },
        { label: 'Parcerias', icon: Users, href: '#partners' },
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
    }, 300);
    setHoverTimeout(timeout);
  };

  return (
    <>
      <nav className={navbarClass}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link
              to="/"
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className={`absolute inset-0 rounded-full blur-[5px] group-hover:blur-[5px] transition-all duration-300 ${
                  isScrolled ? 'bg-green-300/50' : 'bg-green-400/50'
                }`}></div>
                <Leaf className={`h-8 w-8 relative z-10 transform group-hover:rotate-12 transition-all duration-300 ${
                  isScrolled ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-5xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-white' : 'text-black-400'
                }`}>
                  <span text-green-600>Eco</span>Viva
                </span>
                <span className={`text-xs transition-colors duration-300 ${
                  isScrolled ? 'text-green-400/80' : 'text-green-600/80'
                }`}>Sustentabilidade em Ação</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-10 items-center">
              {menuItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.href ? (
                    <Link
                      to={item.href}
                      className={`nav-item flex items-center space-x-1 transition-colors py-2 ${
                        isScrolled
                          ? 'text-gray-300 hover:text-green-400'
                          : 'text-gray-800 hover:text-green-600'
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      className={`nav-item flex items-center space-x-1 transition-colors py-2 ${
                        isScrolled
                          ? 'text-gray-300 hover:text-green-400'
                          : 'text-gray-800 hover:text-green-600'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  )}

                  {item.submenu && showDropdown === item.label && (
                    <div
                      ref={dropdownRef}
                      className={`absolute top-full left-0 mt-1 w-56 rounded-3xl overflow-hidden border ${
                        isScrolled
                          ? 'bg-green-800/90 backdrop-blur-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] border-green-300/90'
                          : 'bg-white/90 backdrop-blur-lg shadow-lg border-gray-200'
                      } ${isDropdownExiting ? 'dropdown-exit' : 'dropdown-enter'}`}
                    >
                      <div className="py-2">
                        {item.submenu.map((subItem, _idx) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className={`flex items-center space-x-3 px-5 py-5 transition-colors ${
                              isScrolled
                                ? 'hover:bg-gray-700/50 text-gray-300'
                                : 'hover:bg-gray-100 text-gray-800'
                            }`}
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
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-6">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden transition-colors ${
                  isScrolled ? 'text-gray-300 hover:text-green-400' : 'text-gray-800 hover:text-green-600'
                }`}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              {/* Desktop User Actions */}
              <div className="hidden lg:flex items-center space-x-6">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className={`flex items-center space-x-3 transition-colors group ${
                        isScrolled ? 'text-gray-300 hover:text-green-400' : 'text-gray-800 hover:text-green-600'
                      }`}
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className={`w-10 h-10 rounded-full border-2 transition-colors ${
                            isScrolled
                              ? 'border-green-400/50 group-hover:border-green-400'
                              : 'border-green-600/50 group-hover:border-green-600'
                          }`}
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${
                          isScrolled
                            ? 'bg-gray-800 border-green-400/50 group-hover:border-green-400'
                            : 'bg-gray-100 border-green-600/50 group-hover:border-green-600'
                        }`}>
                          <User className={`h-6 w-6 ${
                            isScrolled ? 'text-green-400' : 'text-green-600'
                          }`} />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className={`text-xs ${
                          isScrolled ? 'text-green-400/80' : 'text-green-600/80'
                        }`}>Membro Ativo</p>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`px-4 py-2 rounded-full transition-colors flex items-center space-x-2 border ${
                        isScrolled
                          ? 'bg-gray-800 text-gray-300 hover:text-green-400 border-gray-700'
                          : 'bg-gray-100 text-gray-800 hover:text-green-600 border-gray-200'
                      }`}
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sair</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className={`px-6 py-3 rounded-full transition-colors flex items-center space-x-2 border ${
                      isScrolled
                        ? 'bg-green-400/10 text-green-400 hover:bg-green-400/20 border-green-400/20'
                        : 'bg-green-600/10 text-green-600 hover:bg-green-600/20 border-green-600/20'
                    }`}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Entrar</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 bg-white-900/95 backdrop-blur-sm z-40 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-[280px] bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="px-4 py-6">
            <div className="flex flex-col space-y-6">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      to={item.href}
                      className="block text-lg text-gray-300 hover:text-green-400 py-2 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <div className="text-lg text-gray-300 py-2 mb-2">{item.label}</div>
                      <div className="pl-4 flex flex-col space-y-2">
                        {item.submenu?.map((subItem) => (
                          <Link
                            key={subItem.label}
                            to={subItem.href}
                            className="flex items-center space-x-3 text-gray-400 hover:text-green-400 py-2 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <subItem.icon className="h-5 w-5" />
                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Mobile User Actions */}
              <div className="pt-6 border-t border-gray-800">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 text-gray-300 hover:text-green-400 py-2 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border-2 border-green-400/50"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-green-400/50">
                          <User className="h-6 w-6 text-green-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-green-400/80">Membro Ativo</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="mt-4 w-full px-4 py-3 rounded-full bg-gray-800 text-gray-300 hover:text-green-400 transition-colors flex items-center justify-center space-x-2 border border-gray-700"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sair</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="w-full px-6 py-3 rounded-full bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors flex items-center justify-center space-x-2 border border-green-400/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Entrar</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;