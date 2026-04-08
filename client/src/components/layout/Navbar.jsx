import { Link, useNavigate } from 'react-router-dom';
import { Pill, History, LogOut, User, Menu, X, Shield, Bell, Building2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  // Close bell dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
                {user.role === 'pharma' && (
                  <Link to="/pharma" className="hover:text-accent-400 transition-colors text-sm font-medium flex items-center gap-1">
                    <Building2 className="w-4 h-4" /> My Portal
                  </Link>
                )}

                {/* Bell notification */}
                <div ref={bellRef} className="relative">
                  <button
                    onClick={() => setBellOpen(v => !v)}
                    className="relative p-1 hover:text-accent-400 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {bellOpen && (
                    <div className="absolute right-0 top-8 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-96 overflow-y-auto">
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                        <span className="text-xs font-semibold text-slate-600">Notifications</span>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-accent-500 hover:underline">Mark all read</button>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-slate-400 text-center">No notifications</p>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n._id}
                            onClick={() => markRead(n._id)}
                            className={`px-4 py-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${!n.read ? 'bg-blue-50' : ''}`}
                          >
                            <p className="text-sm font-medium text-slate-800">{n.drugName}</p>
                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                            <p className="text-xs text-slate-300 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

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
              {user.role === 'pharma' && (
                <Link to="/pharma" className="block py-2 text-sm text-accent-400 flex items-center gap-1" onClick={() => setMenuOpen(false)}>
                  <Building2 className="w-4 h-4" /> My Portal
                </Link>
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
