import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  User,
  Mail,
  Lock,
  BadgeAlert,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  Building2,
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    department: 'CSE',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const newUser = await register(formData);
      if (newUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/events');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-lg w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
            Create CampusSync Account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the campus community to participate in hackathons, fests, and workshops
          </p>
        </div>

        {error && (
          <div className="flex items-start space-x-2.5 bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="h-5 h-5" />
              </div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aarav Sharma"
                className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Roll Number
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <BadgeAlert className="h-5 h-5" />
                </div>
                <input
                  type="text"
                  name="rollNumber"
                  required
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="e.g. 24CSE101"
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="h-5 h-5" />
                </div>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
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
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              College Email
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. student@campussync.edu"
                className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 h-5" />
              </div>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Account Role (Select for Testing)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.role === 'student'
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === 'student'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <GraduationCap className="w-4 h-4 mr-2 text-indigo-600" />
                <span className="text-sm">Student</span>
              </label>

              <label
                className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.role === 'admin'
                    ? 'border-violet-600 bg-violet-50/50 text-violet-900 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <Sparkles className="w-4 h-4 mr-2 text-violet-600" />
                <span className="text-sm">Club Lead (Admin)</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-md shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
