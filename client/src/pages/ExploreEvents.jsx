import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

const CATEGORIES = ['All', 'Workshop', 'Hackathon', 'Fest', 'Seminar'];
const DEPARTMENTS = ['All', 'CSE', 'ECE', 'EEE', 'IT', 'MECH', 'CIVIL'];

const ExploreEvents = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Action status
  const [registeringId, setRegisteringId] = useState(null);
  const [actionAlert, setActionAlert] = useState(null);

  // Fetch events & user's existing registrations
  const fetchData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedDept !== 'All') params.department = selectedDept;
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (search.trim()) params.search = search.trim();

      const [eventsRes, passesRes] = await Promise.all([
        api.get('/events', { params }),
        user ? api.get('/registrations/my-passes') : Promise.resolve({ data: [] }),
      ]);

      setEvents(eventsRes.data);
      if (user) {
        setUserRegistrations(passesRes.data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDept, selectedCategory, user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleRegister = async (event) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setRegisteringId(event._id);
      const res = await api.post(`/registrations/${event._id}`);
      
      const newReg = res.data.registration;
      setUserRegistrations((prev) => [...prev, newReg]);

      // Update event registeredCount locally if confirmed
      if (newReg.status === 'confirmed') {
        setEvents((prev) =>
          prev.map((e) =>
            e._id === event._id ? { ...e, registeredCount: e.registeredCount + 1 } : e
          )
        );
      }

      setActionAlert({
        type: newReg.status === 'confirmed' ? 'success' : 'warning',
        message:
          newReg.status === 'confirmed'
            ? `🎉 Registered successfully for ${event.title}! Pass ID: ${newReg.passId}`
            : `⚠️ Event was full! You are placed on the waitlist with Pass ID: ${newReg.passId}`,
      });

      // Auto clear banner after 6 seconds
      setTimeout(() => setActionAlert(null), 6000);
    } catch (err) {
      setActionAlert({
        type: 'error',
        message: err.response?.data?.message || 'Registration failed.',
      });
      setTimeout(() => setActionAlert(null), 5000);
    } finally {
      setRegisteringId(null);
    }
  };

  // Metrics calculation
  const totalEvents = events.length;
  const totalOpenSeats = events.reduce(
    (acc, e) => acc + Math.max(0, e.maxCapacity - e.registeredCount),
    0
  );
  const myRegisteredCount = userRegistrations.length;

  // Helper to check if current user already registered for event
  const getRegistration = (eventId) => {
    return userRegistrations.find(
      (reg) => (reg.eventId?._id || reg.eventId) === eventId
    );
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Hackathon':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Workshop':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Fest':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Seminar':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dynamic Summary Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-6 sm:p-10 shadow-xl shadow-indigo-950/20">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              <span>CampusSync Event Hub</span>
            </span>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold tracking-tight">
              Discover & Experience College Fests
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base max-w-xl">
              Real-time registration with automated capacity tracking, waitlists, and instant digital gate passes.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{totalEvents}</p>
              <p className="text-[11px] sm:text-xs font-medium text-indigo-200 uppercase tracking-wider">
                Live Events
              </p>
            </div>
            <div className="border-x border-white/10">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{totalOpenSeats}</p>
              <p className="text-[11px] sm:text-xs font-medium text-indigo-200 uppercase tracking-wider">
                Seats Open
              </p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                {user ? myRegisteredCount : '—'}
              </p>
              <p className="text-[11px] sm:text-xs font-medium text-indigo-200 uppercase tracking-wider">
                My Passes
              </p>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Global Alert Notification */}
      {actionAlert && (
        <div
          className={`flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-all ${
            actionAlert.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : actionAlert.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center space-x-3 text-sm font-semibold">
            {actionAlert.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {actionAlert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
            {actionAlert.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
            <span>{actionAlert.message}</span>
          </div>
          {actionAlert.type !== 'error' && (
            <button
              onClick={() => navigate('/my-passes')}
              className="text-xs font-bold underline hover:opacity-80 ml-4 flex-shrink-0"
            >
              View in My Passes →
            </button>
          )}
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Keyword Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event title, club name, or venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
            >
              Search
            </button>
          </form>

          {/* Department Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
              Dept:
            </span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : `${dept} Dept`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Events Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Try adjusting your search keywords or resetting the department/category filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedDept('All');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-100"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const registration = getRegistration(event._id);
            const isRegistered = !!registration;
            const isFull = event.registeredCount >= event.maxCapacity;
            const percentage = Math.min(100, Math.round((event.registeredCount / event.maxCapacity) * 100));

            return (
              <div
                key={event._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  {/* Card Header: Club & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg truncate max-w-[180px]">
                      {event.clubName}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getCategoryColor(
                        event.category
                      )}`}
                    >
                      {event.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Venue & Date Details */}
                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600 font-medium">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      <span>
                        {new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <span>{event.department} Department</span>
                    </div>
                  </div>

                  {/* Capacity Progress Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold text-slate-700 flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Capacity</span>
                      </span>
                      <span className="font-bold text-slate-800">
                        {event.registeredCount} / {event.maxCapacity}{' '}
                        <span className="text-slate-400 font-normal">({percentage}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          percentage >= 100
                            ? 'bg-amber-500'
                            : percentage > 75
                            ? 'bg-indigo-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Button Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  {isRegistered ? (
                    <button
                      onClick={() => navigate('/my-passes')}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-300 hover:bg-emerald-200 transition-colors shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>
                        {registration.status === 'confirmed'
                          ? 'Registered (View Pass)'
                          : 'Waitlisted (View Pass)'}
                      </span>
                    </button>
                  ) : isFull ? (
                    <button
                      disabled={registeringId === event._id}
                      onClick={() => handleRegister(event)}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all shadow-sm shadow-amber-200 active:scale-95 disabled:opacity-60"
                    >
                      {registeringId === event._id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Full - Join Waitlist</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      disabled={registeringId === event._id}
                      onClick={() => handleRegister(event)}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 active:scale-95 disabled:opacity-60"
                    >
                      {registeringId === event._id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Register Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExploreEvents;
