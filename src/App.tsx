import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { BottomNavigation } from './components/common/BottomNavigation';
import { ToastContainer } from './components/common/Toast';

import { LandingPage } from './components/views/LandingPage';
import { LoginPage } from './components/views/LoginPage';
import { OnboardingPage } from './components/views/OnboardingPage';
import { DashboardPage } from './components/views/DashboardPage';
import { ConnectionsPage } from './components/views/ConnectionsPage';
import { MessagesPage } from './components/views/MessagesPage';
import { MyProfileView } from './components/views/MyProfileView';
import { SettingsPage } from './components/views/SettingsPage';

const AppContent: React.FC = () => {
  const { currentRoute, isAuthenticated } = useAuth();

  const renderRoute = () => {
    switch (currentRoute) {
      case '/':
        return <LandingPage />;

      case '/login':
        return <LoginPage initialMode="login" />;

      case '/register':
        return <LoginPage initialMode="register" />;

      case '/onboarding':
        return <OnboardingPage />;

      case '/dashboard':
      case '/discover':
        return isAuthenticated ? <DashboardPage /> : <LoginPage initialMode="login" />;

      case '/connections':
        return isAuthenticated ? <ConnectionsPage /> : <LoginPage initialMode="login" />;

      case '/messages':
        return isAuthenticated ? <MessagesPage /> : <LoginPage initialMode="login" />;

      case '/profile':
        return isAuthenticated ? <MyProfileView /> : <LoginPage initialMode="login" />;

      case '/settings':
        return isAuthenticated ? <SettingsPage /> : <LoginPage initialMode="login" />;

      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-8">
      <Navbar />
      <main className="flex-1">
        {renderRoute()}
      </main>
      <BottomNavigation />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
