import { Link, useNavigate } from 'react-router-dom';
import { Pill, History, LogOut, User, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Pill className="w-6 h-6 text-accent-400" />
            <span className="hidden sm:inline">SpecialtyRx Navigator</span>
            <span className="sm:hidden">SRx</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/search" className="hover:text-accent-400 transition-colors text-sm font-medium">
                  Search
                </Link>
                <Link to="/history" className="hover:text-accent-400 transition-colors text-sm font-medium flex items-center gap-1">
                  <History className="w-4 h-4" /> History
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-accent-400 transition-colors text-sm font-medium flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Admin
                  </Link>
                )}
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-primary-500">
                  <User className="w-4 h-4 text-accent-400" />
                  <span className="text-sm">{user.firstName} {user.lastName}</span>
                  <button onClick={handleLogout} className="ml-2 text-sm hover:text-red-300 flex items-center gap-1 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-accent-400 transition-colors text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary-700 px-4 py-3 space-y-2">
          {user ? (
            <>
              <Link to="/search" className="block py-2 text-sm" onClick={() => setMenuOpen(false)}>Search</Link>
              <Link to="/history" className="block py-2 text-sm" onClick={() => setMenuOpen(false)}>History</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block py-2 text-sm text-accent-400" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="block py-2 text-sm text-red-300 w-full text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block py-2 text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block py-2 text-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
