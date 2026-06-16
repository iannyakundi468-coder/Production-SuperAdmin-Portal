import React, { useState, useEffect } from 'react';
import { AdminProvider } from './context/AdminContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ClassSetup from './pages/ClassSetup';
import FinancialOverview from './pages/FinancialOverview';
import SystemSettings from './pages/SystemSettings';
import Timetable from './pages/Timetable';

const PAGES = {
  '/': Dashboard,
  '/users': UserManagement,
  '/classes': ClassSetup,
  '/finance': FinancialOverview,
  '/settings': SystemSettings,
  '/timetable': Timetable,
};

function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const [path, setPath] = useState('/');

  // Listen for navigation events from Layout
  useEffect(() => {
    const handleNav = () => {
      const p = window.location.pathname;
      setPath(PAGES[p] ? p : '/');
    };
    window.addEventListener('popstate', handleNav);
    return () => window.removeEventListener('popstate', handleNav);
  }, []);

  if (!authed) {
    return <LoginPage onLogin={() => setAuthed(true)} />;
  }

  const PageComponent = PAGES[path] || Dashboard;

  return (
    <Layout currentPath={path} onNavigate={setPath}>
      <PageComponent />
    </Layout>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <AdminApp />
    </AdminProvider>
  );
}
