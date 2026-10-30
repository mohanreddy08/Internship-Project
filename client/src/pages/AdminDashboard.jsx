import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Users,
  Trash2,
  Download,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  X,
  FileSpreadsheet,
  AlertCircle,
  Building2,
  Sparkles,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create Event Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    clubName: '',
    department: 'CSE',
    category: 'Workshop',
    date: '',
    venue: '',
    maxCapacity: 50,
    description: '',
  });

  // Registrants Roster Modal State
  const [activeRosterEvent, setActiveRosterEvent] = useState(null);
  const [rosterData, setRosterData] = useState([]);
  const [loadingRoster, setLoadingRoster] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching admin events:', err);
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await api.post('/events', formData);
      setEvents((prev) => [res.data, ...prev]);
      setShowCreateModal(false);
      setFormData({
        title: '',
        clubName: '',
        department: 'CSE',
        category: 'Workshop',
        date: '',
        venue: '',
        maxCapacity: 50,
        description: '',
      });
      setSuccessMsg('🎉 New event created successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? All associated student registrations and passes will be removed.`)) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      if (activeRosterEvent && activeRosterEvent._id === eventId) {
        setActiveRosterEvent(null);
      }
      setSuccessMsg(`Event "${title}" was deleted.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event.');
    }
  };

  const handleOpenRoster = async (event) => {
    setActiveRosterEvent(event);
    setLoadingRoster(true);
    try {
      const res = await api.get(`/registrations/event/${event._id}`);
      setRosterData(res.data.registrations || []);
    } catch (err) {
      console.error('Error fetching event roster:', err);
      setRosterData([]);
    } finally {
      setLoadingRoster(false);
    }
  };

  const handleExportCSV = () => {
    if (!activeRosterEvent || rosterData.length === 0) return;

    const headers = ['Pass ID,Roll Number,Student Name,Department,Email,Status,Registration Date\n'];
    const rows = rosterData.map((reg) => {
      const student = reg.userId || {};
      const regDate = reg.registeredAt ? new Date(reg.registeredAt).toISOString() : '';
      return `"${reg.passId}","${student.rollNumber || ''}","${student.name || ''}","${student.department || ''}","${student.email || ''}","${reg.status}","${regDate}"\n`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + headers.concat(rows).join('');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${activeRosterEvent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_roster.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md">
              Club Lead Portal
            </span>
            <span className="text-xs text-slate-500 font-mono">Logged in as {user?.email}</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Campus Event Administration
          </h1>
          <p className="text-sm text-slate-500">
            Publish upcoming club events, monitor student capacity, view rosters, and download attendance sheets.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200 transition-all active:scale-95 flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Publish New Event</span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Events Table / Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            Managed Campus Events ({events.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No events published yet. Click "Publish New Event" to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Event Title & Club</th>
                  <th className="px-6 py-3.5">Category & Dept</th>
                  <th className="px-6 py-3.5">Date & Venue</th>
                  <th className="px-6 py-3.5">Capacity & Registrations</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((event) => {
                  const percentage = Math.min(
                    100,
                    Math.round((event.registeredCount / event.maxCapacity) * 100)
                  );
                  return (
                    <tr key={event._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{event.title}</p>
                        <p className="text-xs text-indigo-600 font-semibold">{event.clubName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {event.category}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">{event.department}</p>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <div className="flex items-center space-x-1.5 font-medium text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span className="truncate max-w-[150px]">{event.venue}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between text-xs mb-1 font-bold">
                          <span>
                            {event.registeredCount} / {event.maxCapacity}
                          </span>
                          <span
                            className={
                              percentage >= 100 ? 'text-amber-600' : 'text-emerald-600'
                            }
                          >
                            {percentage}%
                          </span>
                        </div>
                        <div className="w-32 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${
                              percentage >= 100 ? 'bg-amber-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenRoster(event)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                          title="View Registrants"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Roster</span>
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id, event.title)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-slate-900">
                  Publish New College Event
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the event specs to broadcast to students across departments
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. CodeFusion 24-Hr Hackathon"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Organizing Club Name
                  </label>
                  <input
                    type="text"
                    name="clubName"
                    required
                    placeholder="e.g. ACM Student Chapter"
                    value={formData.clubName}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="IT">IT</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Fest">Fest</option>
                    <option value="Seminar">Seminar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    name="maxCapacity"
                    required
                    min={1}
                    value={formData.maxCapacity}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Venue / Location
                </label>
                <input
                  type="text"
                  name="venue"
                  required
                  placeholder="e.g. Main Auditorium & Innovation Labs"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Event Description
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Provide detailed description of the schedule, eligibility, and agenda..."
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW REGISTRANTS ROSTER MODAL / DRAWER */}
      {activeRosterEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Attendance & Verification Roster
                </span>
                <h3 className="font-heading text-xl font-bold text-slate-900 mt-1">
                  {activeRosterEvent.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Total Registrants: {rosterData.length} / {activeRosterEvent.maxCapacity} seats
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExportCSV}
                  disabled={rosterData.length === 0}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-colors disabled:opacity-50"
                  title="Download CSV"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export Roster to CSV</span>
                </button>
                <button
                  onClick={() => setActiveRosterEvent(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loadingRoster ? (
              <div className="p-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : rosterData.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                No students have registered for this event yet.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Roll Number</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Dept</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Pass ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rosterData.map((reg) => {
                      const student = reg.userId || {};
                      const isConfirmed = reg.status === 'confirmed';
                      return (
                        <tr key={reg._id} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3 font-mono font-bold text-slate-800">
                            {student.rollNumber || 'N/A'}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            {student.name || 'Anonymous'}
                          </td>
                          <td className="px-4 py-3">{student.department || '—'}</td>
                          <td className="px-4 py-3 text-slate-500">{student.email || '—'}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                isConfirmed
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              {reg.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-indigo-600 font-bold">
                            {reg.passId}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
