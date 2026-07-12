import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/authStore';
import { lazy, Suspense, type ReactNode } from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

// Lazy-loaded pages
const Landing = lazy(() => import('@/pages/Landing/Landing'));
const Login = lazy(() => import('@/pages/Auth/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'));
const Vehicles = lazy(() => import('@/pages/Vehicles/Vehicles'));
const Drivers = lazy(() => import('@/pages/Drivers/Drivers'));
const Trips = lazy(() => import('@/pages/Trips/Trips'));
const Maintenance = lazy(() => import('@/pages/Maintenance/Maintenance'));
const Finance = lazy(() => import('@/pages/Finance/Finance'));
const Reports = lazy(() => import('@/pages/Reports/Reports'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

// Page loading fallback
function PageLoader() {
  return (
    <div className="p-6 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
      <div className="grid grid-cols-4 gap-4 mt-6">
        <Skeleton variant="rectangular" className="h-32" />
        <Skeleton variant="rectangular" className="h-32" />
        <Skeleton variant="rectangular" className="h-32" />
        <Skeleton variant="rectangular" className="h-32" />
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Public-only route wrapper (redirect if already logged in)
function PublicRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Protected routes — wrapped in AppLayout */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/trips" element={<Trips />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/reports" element={<Reports />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
