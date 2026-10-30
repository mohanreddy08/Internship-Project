import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Ticket,
  ShieldAlert,
  LogOut,
  User,
  Sparkles,
  Menu,
  X,
  Compass,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <Link to="/events" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-indigo-100" />
              </div>
              <div>
                <span className="font-heading text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-700 bg-clip-text text-transparent">
                  CampusSync
                </span>
                <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Fests & Clubs
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-2">
            <Link
              to="/events"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/events')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Events</span>
            </Link>

            {user && user.role === 'student' && (
              <Link
                to="/my-passes"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/my-passes')
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>My Passes</span>
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link
                to="/admin"
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/admin')
                    ? 'bg-violet-100 text-violet-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-violet-600" />
                <span>Admin Portal</span>
              </Link>
            )}
          </div>

          {/* User Profile & Auth Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-slate-800 leading-tight">
                    {user.name}
                  </span>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-xs text-slate-500 font-mono">
                      {user.rollNumber}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {user.role === 'admin' ? 'Club Lead' : 'Student'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <Compass className="w-5 h-5" />
            <span>Explore Events</span>
          </Link>

          {user && user.role === 'student' && (
            <Link
              to="/my-passes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Ticket className="w-5 h-5" />
              <span>My Passes</span>
            </Link>
          )}

          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-base font-semibold text-violet-800 bg-violet-50"
            >
              <ShieldAlert className="w-5 h-5" />
              <span>Admin Portal</span>
            </Link>
          )}

          {user ? (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span className="text-xs text-slate-500 font-mono">{user.rollNumber}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-indigo-100 text-indigo-800">
                    {user.role === 'admin' ? 'Club Lead' : 'Student'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg font-semibold text-slate-700 border border-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg font-semibold text-white bg-indigo-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
