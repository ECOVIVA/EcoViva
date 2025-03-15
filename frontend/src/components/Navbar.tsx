import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, User, LogOut, LogIn, ChevronDown, Globe, Award, Users, Menu, X } from 'lucide-react';
import { useAuth } from './AuthContext'; // Certifique-se de ter o contexto de autenticação implementado

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth(); // Usando o contexto de autenticação
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
    logout(); // Chama a função de logout do contexto
    navigate('/'); // Redireciona para a página inicial após o logout
  };

  const navbarClass = `fixed w-full z-50 transition-all duration-500 ${
    isScrolled ? 'bg-green-900/100 backdrop-blur-lg shadow-[0_0_20px_rgba(0,0,0,0.3)] py-5' : 'bg-white/90 backdrop-blur-sm py-1'
  }`;

  const menuItems = [
    {
      label: 'Sobre',
      submenu: [
        { label: 'Nossa História', icon: Globe, href: '/HistorySection' },
        { label: 'Impacto Ambiental', icon: Leaf, href: '/ImpactPage' },
        { label: 'Certificações', icon: Award, href: '/certificatePage' },
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
        { label: 'Educação Ambiental', icon: Globe, href: '/ECOlições' },
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
    }, 300);
    setHoverTimeout(timeout);
  };

  return (
    <>
      <nav className={navbarClass}>
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-1 group">
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
                        isScrolled ? 'text-gray-300 hover:text-green-400' : 'text-gray-800 hover:text-green-600'
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      className={`nav-item flex items-center space-x-1 transition-colors py-2 ${
                        isScrolled ? 'text-gray-300 hover:text-green-400' : 'text-gray-800 hover:text-green-600'
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
                        {item.submenu.map((subItem: { label: boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | React.Key | null | undefined; href: unknown; icon: any; }) => (
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

              <div className="hidden lg:flex items-center space-x-6">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/ProfilePage"
                      className={`flex items-center space-x-3 transition-colors group ${
                        isScrolled ? 'text-gray-300 hover:text-green-400' : 'text-gray-800 hover:text-green-600'
                      }`}
                    >
                      {user?.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={user.email}
                          className={`w-10 h-10 rounded-full border-2 transition-colors ${
                            isScrolled ? 'border-green-400/50 group-hover:border-green-400' : 'border-green-600/50 group-hover:border-green-600'
                          }`}
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${
                          isScrolled ? 'border-green-400/50 group-hover:border-green-400' : 'border-green-600/50 group-hover:border-green-600'
                        }`}>
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 transition-colors hover:text-red-400"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className={`text-gray-800 hover:text-green-600 transition-colors ${
                      isScrolled ? 'text-gray-300 hover:text-green-400' : 'text-gray-800 hover:text-green-600'
                    }`}
                  >
                    <LogIn className="h-5 w-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;