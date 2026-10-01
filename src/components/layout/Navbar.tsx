import { useEffect, useState } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard, Shield, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onNavigate: (path: string) => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/#about' },
    { label: 'Classes', path: '/#classes' },
    { label: 'Schedule', path: '/#schedule' },
    { label: 'Pricing', path: '/#pricing' },
    { label: 'Contact', path: '/#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-md shadow-sage-900/5 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2 group"
          >
            <span
              className={`text-2xl font-serif font-semibold transition-colors ${
                scrolled ? 'text-sage-700' : 'text-cream'
              }`}
            >
              Willow Creek
            </span>
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.path)}
                className={`text-sm font-medium tracking-wide transition-colors relative group ${
                  scrolled ? 'text-ink/70 hover:text-sage-700' : 'text-cream/80 hover:text-cream'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sage-500 transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    scrolled
                      ? 'bg-sage-50 text-ink hover:bg-sage-100'
                      : 'bg-cream/10 text-cream hover:bg-cream/20'
                  }`}
                >
                  <User size={18} />
                  <span className="text-sm font-medium">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                </button>
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-cream rounded-xl shadow-xl border border-sage-100 py-2 z-20 animate-scale-in">
                      <div className="px-4 py-2 border-b border-sage-100">
                        <p className="text-sm font-medium text-ink truncate">
                          {profile?.full_name || 'Member'}
                        </p>
                        <p className="text-xs text-ink/50 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => handleNav('/dashboard')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink/70 hover:bg-sage-50 hover:text-sage-700 transition-colors"
                      >
                        <LayoutDashboard size={16} />
                        My Dashboard
                      </button>
                      <button
                        onClick={() => handleNav('/dashboard#bookings')}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink/70 hover:bg-sage-50 hover:text-sage-700 transition-colors"
                      >
                        <Calendar size={16} />
                        My Bookings
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleNav('/admin')}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-clay-700 hover:bg-clay-50 transition-colors"
                        >
                          <Shield size={16} />
                          Admin Panel
                        </button>
                      )}
                      <div className="border-t border-sage-100 mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink/70 hover:bg-clay-50 hover:text-clay-700 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => handleNav('/login')}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    scrolled ? 'text-ink/70 hover:text-sage-700' : 'text-cream/80 hover:text-cream'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNav('/signup')}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                    scrolled
                      ? 'bg-sage-600 text-cream hover:bg-sage-700 hover:shadow-lg'
                      : 'bg-cream text-ink hover:bg-white hover:shadow-lg'
                  }`}
                >
                  Join Now
                </button>
              </>
            )}
          </div>

          <button
            className={`lg:hidden ${scrolled ? 'text-ink' : 'text-cream'}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-cream lg:hidden animate-fade-in pt-24 px-6 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNav(link.path)}
                className="text-left py-4 text-xl text-ink/80 hover:text-sage-700 border-b border-sage-100 font-serif"
              >
                {link.label}
              </button>
            ))}
            <div className="mt-6 flex flex-col gap-3">
              {user ? (
                    <>
                      <button
                        onClick={() => handleNav('/dashboard')}
                        className="btn-outline w-full"
                      >
                        <LayoutDashboard size={18} />
                        My Dashboard
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleNav('/admin')}
                          className="btn-outline w-full !border-clay-600 !text-clay-700 hover:!bg-clay-600 hover:!text-cream"
                        >
                          <Shield size={18} />
                          Admin Panel
                        </button>
                      )}
                      <button onClick={handleSignOut} className="btn-outline w-full">
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleNav('/login')} className="btn-outline w-full">
                        Sign In
                      </button>
                      <button onClick={() => handleNav('/signup')} className="btn-primary w-full">
                        Join Now
                      </button>
                    </>
                  )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
