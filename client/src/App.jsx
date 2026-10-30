import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ExploreEvents from './pages/ExploreEvents';
import MyPasses from './pages/MyPasses';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<ExploreEvents />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/my-passes"
            element={
              <ProtectedRoute>
                <MyPasses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/events" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
