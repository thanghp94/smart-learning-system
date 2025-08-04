import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logError } from '../lib/logger';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    logError('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
      errorId: this.state.errorId
    });

    // Update state with error info
    this.setState({
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportErrorToService(error, errorInfo);
    }
  }

  private reportErrorToService(error: Error, errorInfo: ErrorInfo) {
    // TODO: Integrate with error reporting service like Sentry
    // Example:
    // Sentry.captureException(error, {
    //   contexts: {
    //     react: {
    //       componentStack: errorInfo.componentStack
    //     }
    //   }
    // });
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-gray-600">
                We're sorry, but something unexpected happened. Please try again.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {this.props.showDetails && this.state.error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-800">
                    <p className="font-medium mb-2">Error Details:</p>
                    <p className="font-mono text-xs break-all">
                      {this.state.error.message}
                    </p>
                    {this.state.errorId && (
                      <p className="mt-2 text-xs text-red-600">
                        Error ID: {this.state.errorId}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  className="w-full"
                  variant="outline"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go to Home
                </Button>
                
                <Button 
                  onClick={this.handleReload}
                  className="w-full"
                  variant="ghost"
                  size="sm"
                >
                  Reload Page
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    Show technical details
                  </summary>
                  <div className="mt-2 rounded-md bg-gray-100 p-3">
                    <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-auto max-h-40">
                      {this.state.error?.stack}
                    </pre>
                    <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error handling in functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error: Error) => {
    logError('Manual error handling', error);
    setError(error);
  }, []);

  // Throw error to be caught by error boundary
  if (error) {
    throw error;
  }

  return { handleError, resetError };
}

// Async error boundary for handling promise rejections
export function AsyncErrorBoundary({ children, ...props }: Props) {
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logError('Unhandled promise rejection', new Error(event.reason), {
        reason: event.reason,
        promise: event.promise
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <ErrorBoundary {...props}>{children}</ErrorBoundary>;
}

// Specialized error boundaries for different parts of the app
export const PageErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary
    showDetails={process.env.NODE_ENV === 'development'}
    onError={(error, errorInfo) => {
      logError('Page-level error', error, { 
        componentStack: errorInfo.componentStack,
        location: window.location.pathname
      });
    }}
  >
    {children}
  </ErrorBoundary>
);

export const FormErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary
    fallback={
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Form Error
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>There was an error with this form. Please refresh the page and try again.</p>
            </div>
          </div>
        </div>
      </div>
    }
    onError={(error, errorInfo) => {
      logError('Form-level error', error, { 
        componentStack: errorInfo.componentStack 
      });
    }}
  >
    {children}
  </ErrorBoundary>
);

export const TableErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary
    fallback={
      <div className="rounded-md border border-red-200 bg-red-50 p-8 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-red-400 mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Unable to load data
        </h3>
        <p className="text-sm text-red-600">
          There was an error loading the table data. Please refresh the page.
        </p>
      </div>
    }
    onError={(error, errorInfo) => {
      logError('Table-level error', error, { 
        componentStack: errorInfo.componentStack 
      });
    }}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;
