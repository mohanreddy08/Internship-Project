import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Ticket,
  Printer,
  Calendar,
  MapPin,
  Sparkles,
  Building,
  CheckCircle2,
  Clock,
  Compass,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

const MyPasses = () => {
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [printingPassId, setPrintingPassId] = useState(null);

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/registrations/my-passes');
        setPasses(res.data);
      } catch (err) {
        console.error('Error fetching passes:', err);
        setError('Failed to load your event passes.');
      } finally {
        setLoading(false);
      }
    };

    fetchPasses();
  }, []);

  const handlePrint = (passId) => {
    setPrintingPassId(passId);
    setTimeout(() => {
      window.print();
      setPrintingPassId(null);
    }, 150);
  };

  // Generate deterministic visual QR pattern based on passId string
  const renderQRCode = (passId) => {
    return (
      <div className="w-24 h-24 bg-white p-2 rounded-xl border-2 border-slate-900 shadow-inner flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="w-6 h-6 border-2 border-slate-900 bg-slate-900 flex items-center justify-center p-0.5">
            <div className="w-3 h-3 bg-white" />
          </div>
          <div className="w-2 h-2 bg-slate-900 rounded-sm" />
          <div className="w-6 h-6 border-2 border-slate-900 bg-slate-900 flex items-center justify-center p-0.5">
            <div className="w-3 h-3 bg-white" />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-0.5 py-1">
          <div className="w-1.5 h-1.5 bg-slate-900" />
          <div className="w-1.5 h-1.5 bg-transparent" />
          <div className="w-1.5 h-1.5 bg-slate-900" />
          <div className="w-1.5 h-1.5 bg-slate-900" />
          <div className="w-1.5 h-1.5 bg-transparent" />
        </div>
        <div className="flex justify-between items-end">
          <div className="w-6 h-6 border-2 border-slate-900 bg-slate-900 flex items-center justify-center p-0.5">
            <div className="w-3 h-3 bg-white" />
          </div>
          <div className="w-3 h-1.5 bg-slate-900" />
          <div className="w-3 h-3 bg-slate-900" />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Student Portal
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Digital Event Passes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Official QR entry passes for college fests, workshops, and hackathons
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More Events</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {passes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
          <Ticket className="w-16 h-16 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Event Passes Found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            You haven't registered for any events yet. Check out the explore tab to join upcoming fests and workshops!
          </p>
          <Link
            to="/events"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 transition-all"
          >
            Browse Active Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {passes.map((pass) => {
            const event = pass.eventId || {};
            const isConfirmed = pass.status === 'confirmed';
            const isPrinting = printingPassId === pass._id;

            return (
              <div
                key={pass._id}
                className={`transition-all ${
                  isPrinting ? 'print-pass-container' : ''
                }`}
              >
                {/* Physical Ticket Pass Visual Layout */}
                <div className="relative bg-white rounded-3xl border-2 border-slate-200 shadow-lg shadow-slate-100 overflow-hidden flex flex-col justify-between">
                  {/* Top Header Strip */}
                  <div
                    className={`px-6 py-4 flex items-center justify-between text-white ${
                      isConfirmed
                        ? 'bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-white/80" />
                      <span className="font-heading font-bold text-sm tracking-wide uppercase">
                        CampusSync Official Pass
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          <span>CONFIRMED</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-white" />
                          <span>WAITLISTED</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Ticket Body */}
                  <div className="p-6 space-y-6">
                    {/* Event & Club Info */}
                    <div>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
                        {event.clubName || 'College Club'}
                      </span>
                      <h2 className="font-heading text-xl font-extrabold text-slate-900 mt-2">
                        {event.title || 'Event Title'}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {event.description}
                      </p>
                    </div>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-dashed border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
                          Date & Schedule
                        </span>
                        <div className="flex items-center space-x-1.5 font-bold text-slate-800 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span>
                            {event.date
                              ? new Date(event.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'TBA'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
                          Venue Location
                        </span>
                        <div className="flex items-center space-x-1.5 font-bold text-slate-800 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span className="truncate">{event.venue || 'Campus Main Hall'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Student Info & QR Code Section */}
                    <div className="flex items-center justify-between gap-4 pt-1">
                      <div className="space-y-2">
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
                            Attendee Name
                          </span>
                          <p className="font-bold text-slate-900 text-sm">
                            {user?.name}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
                            Roll No / Department
                          </span>
                          <p className="font-mono font-bold text-slate-700 text-xs">
                            {user?.rollNumber} • {user?.department}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block">
                            Security Pass ID
                          </span>
                          <span className="inline-block font-mono font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-xs tracking-wider">
                            {pass.passId}
                          </span>
                        </div>
                      </div>

                      {/* Visual QR Code Stamp */}
                      <div className="flex flex-col items-center">
                        {renderQRCode(pass.passId)}
                        <span className="text-[9px] font-mono font-bold text-slate-400 mt-1 tracking-tight">
                          SCAN AT GATE
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Perforated Stub Notch Visual Effects */}
                  <div className="relative border-t-2 border-dashed border-slate-200 bg-slate-50 px-6 py-3.5 flex items-center justify-between">
                    {/* Left & Right Notches */}
                    <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-slate-50 border-r-2 border-slate-200" />
                    <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-slate-50 border-l-2 border-slate-200" />

                    <div className="flex items-center space-x-2 text-slate-500 text-xs font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Tamper-proof verifiable campus pass</span>
                    </div>

                    <button
                      onClick={() => handlePrint(pass._id)}
                      className="no-print inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-sm"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyPasses;
