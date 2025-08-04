import React, { Suspense, ComponentType } from 'react';
import { ErrorBoundary } from '../ErrorBoundary';
import { Loader2 } from 'lucide-react';

interface LazyWrapperProps {
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
}

// Loading component
const DefaultLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="flex items-center space-x-2">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span className="text-sm text-gray-600">Loading...</span>
    </div>
  </div>
);

// Error fallback component
const DefaultErrorFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="text-center">
      <div className="text-red-500 mb-2">⚠️</div>
      <p className="text-sm text-gray-600">Failed to load component</p>
    </div>
  </div>
);

// Higher-order component for lazy loading with error boundary
export function withLazyLoading<P extends object>(
  LazyComponent: React.LazyExoticComponent<ComponentType<P>>,
  options: LazyWrapperProps = {}
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={options.errorFallback || <DefaultErrorFallback />}>
      <Suspense fallback={options.fallback || <DefaultLoadingFallback />}>
        <LazyComponent {...(props as any)} />
      </Suspense>
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withLazyLoading(Component)`;
  
  return WrappedComponent;
}

// Lazy wrapper component
export const LazyWrapper: React.FC<LazyWrapperProps & { children: React.ReactNode }> = ({
  children,
  fallback,
  errorFallback
}) => (
  <ErrorBoundary fallback={errorFallback || <DefaultErrorFallback />}>
    <Suspense fallback={fallback || <DefaultLoadingFallback />}>
      {children}
    </Suspense>
  </ErrorBoundary>
);

export default LazyWrapper;
