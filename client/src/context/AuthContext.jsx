import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('campussync_token');
      const storedUser = localStorage.getItem('campussync_user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify with backend
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('campussync_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Session verification failed, logging out', err);
          localStorage.removeItem('campussync_token');
          localStorage.removeItem('campussync_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('campussync_token', token);
    localStorage.setItem('campussync_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    const { token, user: newUser } = res.data;
    localStorage.setItem('campussync_token', token);
    localStorage.setItem('campussync_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('campussync_token');
    localStorage.removeItem('campussync_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
