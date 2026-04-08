import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Pill, Globe, LogOut, Pill as Logo, BarChart2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/drugs', label: 'Drug Database', icon: Pill },
  { to: '/admin/seed', label: 'Seed from Web', icon: Globe },
  { to: '/admin/search-logs', label: 'Search Logs', icon: BarChart2 }
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-56 bg-primary-900 text-white flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-primary-700">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold">
            <Logo className="w-5 h-5 text-accent-400" />
            <span className="text-accent-400">Admin Panel</span>
          </Link>
          <p className="text-xs text-primary-400 mt-1">SpecialtyRx Navigator</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-600 text-white'
                    : 'text-primary-300 hover:bg-primary-700 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-primary-700">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-primary-300 hover:bg-primary-700 hover:text-white transition-colors mb-1">
            ← Back to App
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
