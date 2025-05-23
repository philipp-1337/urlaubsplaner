import React, { Suspense, lazy } from 'react'; // Suspense und lazy importieren
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CalendarProvider } from './context/CalendarContext';

// Import components
import Header from './components/common/Header';
import Footer from './components/common/Footer'; // Import Footer

// Lazy load route components
const LoginForm = lazy(() => import('./components/auth/LoginForm'));
const ActionHandlerPage = lazy(() => import('./components/auth/ActionHandlerPage'));
const PrivacyPolicyPage = lazy(() => import('./components/legal/PrivacyPolicyPage'));
const ImprintPage = lazy(() => import('./components/legal/ImprintPage'));
const MonthlyView = lazy(() => import('./components/dashboard/MonthlyView'));
const CalendarView = lazy(() => import('./components/calendar/CalendarView'));
const YearlyOverview = lazy(() => import('./components/dashboard/YearlyOverview'));
const MonthlyDetail = lazy(() => import('./components/dashboard/MonthlyDetail'));
const SettingsPage = lazy(() => import('./components/settings/SettingsPage'));

// Fallback-Komponente für Suspense
const RouteLoadingFallback = () => (
  <div className="flex-grow flex items-center justify-center bg-gray-100 text-xl">
    Lade Ansicht...
  </div>
);

function AppContent() { // Renamed from AppRoutes and restructured
  const { isLoggedIn, loadingAuth } = useAuth();

  if (loadingAuth) {
    // Adjusted to be flex-grow as parent div handles min-h-screen
    return <div className="flex-grow flex items-center justify-center bg-gray-100 text-xl">Authentifizierung wird geladen...</div>; // Dieser Ladeindikator bleibt für die Auth-Prüfung
  }

  return (
    <>
      {isLoggedIn && <Header />} {/* Header is rendered conditionally here */}
      <main className="flex flex-col flex-grow bg-gray-100"> {/* Make main a flex container that arranges children vertically and grows */}
        <Routes>
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/" replace />
              ) : (
                <Suspense fallback={<RouteLoadingFallback />}>
                  <LoginForm />
                </Suspense>
              )
            } />
          <Route path="/auth/action" element={<Suspense fallback={<RouteLoadingFallback />}><ActionHandlerPage /></Suspense>} />
          <Route path="/datenschutz" element={<Suspense fallback={<RouteLoadingFallback />}><PrivacyPolicyPage /></Suspense>} />
          <Route path="/impressum" element={<Suspense fallback={<RouteLoadingFallback />}><ImprintPage /></Suspense>} />

          {/* Protected routes logic */}
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Suspense fallback={<RouteLoadingFallback />}><MonthlyView /></Suspense>} />
              <Route path="/calendar/:personId" element={<Suspense fallback={<RouteLoadingFallback />}><CalendarView /></Suspense>} />
              <Route path="/yearly-overview" element={<Suspense fallback={<RouteLoadingFallback />}><YearlyOverview /></Suspense>} />
              <Route path="/monthly-detail/:personId" element={<Suspense fallback={<RouteLoadingFallback />}><MonthlyDetail /></Suspense>} />
              <Route path="/settings" element={<Suspense fallback={<RouteLoadingFallback />}><SettingsPage /></Suspense>} />
              <Route path="*" element={<Navigate to="/" replace />} /> {/* Catch-all for logged-in users */}
            </>
          ) : (
            // If not logged in, any path not matching /login, /auth/action, /datenschutz, /impressum
            // will lead to a redirect to /login. We need a catch-all for this.
            // For non-logged-in users, we still want to lazy load the login form if they hit a protected route.
            // The Navigate component itself doesn't need Suspense, but the target (LoginForm) does.
            // If we redirect to /login, the /login route's Suspense will handle it.
            <Route
              path="*"
              element={
                <Navigate to="/login" replace />
              }
            />
          )}
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CalendarProvider>
          <div className="flex flex-col min-h-screen"> {/* Global wrapper for flex layout */}
            <AppContent /> {/* Component containing Header (conditional) and Routes */}
            <Footer />     {/* Global Footer */}
          </div>
        </CalendarProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;