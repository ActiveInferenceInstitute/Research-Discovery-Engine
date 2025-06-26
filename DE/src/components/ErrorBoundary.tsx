/**
 * Error Boundary Component - Catches and handles React errors gracefully
 * 
 * This component wraps other components to provide error handling and
 * user-friendly error displays when unexpected errors occur.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react';

/**
 * Props for the ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Child components to wrap with error handling */
  children: ReactNode;
  /** Optional fallback UI to display when error occurs */
  fallback?: ReactNode;
  /** Optional callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Component name for better error reporting */
  componentName?: string;
  /** Whether to show detailed error information (dev mode) */
  showDetails?: boolean;
}

/**
 * State for the ErrorBoundary component
 */
interface ErrorBoundaryState {
  /** Whether an error has occurred */
  hasError: boolean;
  /** The error that occurred */
  error: Error | null;
  /** Additional error information */
  errorInfo: ErrorInfo | null;
  /** Error ID for tracking */
  errorId: string | null;
}

/**
 * ErrorBoundary class component that catches JavaScript errors in child components
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  /**
   * Static method called when an error occurs
   * @param error - The error that was thrown
   * @returns New state to set
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  /**
   * Called when an error is caught
   * @param error - The error that occurred
   * @param errorInfo - Additional error information
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error details
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error Info:', errorInfo);
    
    // Update state with error info
    this.setState({
      errorInfo
    });
    
    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // In production, you might want to send error to logging service
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  /**
   * Log error to external service (placeholder for production)
   * @param error - The error that occurred
   * @param errorInfo - Additional error information
   */
  private logErrorToService(error: Error, errorInfo: ErrorInfo): void {
    // Placeholder for error logging service integration
    // e.g., Sentry, LogRocket, or custom logging endpoint
    
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      componentName: this.props.componentName,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    console.warn('Error would be logged to service:', errorReport);
  }

  /**
   * Reset error state to try rendering again
   */
  private handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  /**
   * Reload the entire page
   */
  private handleReload = (): void => {
    window.location.reload();
  };

  /**
   * Navigate to home/main view
   */
  private handleGoHome = (): void => {
    // In a real app with routing, this would navigate to home
    // For now, we'll just reload
    window.location.href = window.location.origin;
  };

  /**
   * Render the error UI or children
   */
  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return this.renderErrorUI();
    }
    
    return this.props.children;
  }

  /**
   * Render the default error UI
   */
  private renderErrorUI(): ReactNode {
    const { error, errorInfo, errorId } = this.state;
    const { componentName, showDetails = process.env.NODE_ENV === 'development' } = this.props;
    
    return (
      <div className="min-h-64 flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="text-center max-w-2xl">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          
          {/* Error Title */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Something went wrong
          </h2>
          
          {/* Error Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {componentName 
              ? `An error occurred in the ${componentName} component.`
              : 'An unexpected error occurred while rendering this component.'
            }
          </p>
          
          {/* Action Buttons */}
          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            
            <button
              onClick={this.handleGoHome}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Go Home
            </button>
            
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Page
            </button>
          </div>
          
          {/* Error Details (Development Mode) */}
          {showDetails && error && (
            <details className="text-left bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mt-4">
              <summary className="cursor-pointer font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Error Details
              </summary>
              
              <div className="space-y-3 text-sm">
                {/* Error ID */}
                {errorId && (
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Error ID:</strong>
                    <code className="ml-2 px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                      {errorId}
                    </code>
                  </div>
                )}
                
                {/* Error Message */}
                <div>
                  <strong className="text-gray-700 dark:text-gray-300">Message:</strong>
                  <pre className="mt-1 text-red-600 dark:text-red-400 whitespace-pre-wrap break-words">
                    {error.message}
                  </pre>
                </div>
                
                {/* Stack Trace */}
                {error.stack && (
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Stack Trace:</strong>
                    <pre className="mt-1 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                      {error.stack}
                    </pre>
                  </div>
                )}
                
                {/* Component Stack */}
                {errorInfo?.componentStack && (
                  <div>
                    <strong className="text-gray-700 dark:text-gray-300">Component Stack:</strong>
                    <pre className="mt-1 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
                      {errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
          
          {/* User Instructions */}
          <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            If this problem persists, please try refreshing the page or contact support.
          </div>
        </div>
      </div>
    );
  }
}

/**
 * Higher-order component that wraps a component with error boundary
 * @param WrappedComponent - Component to wrap
 * @param options - Error boundary options
 * @returns Component wrapped with error boundary
 */
export function withErrorBoundary<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  options: Partial<ErrorBoundaryProps> = {}
): React.ComponentType<T> {
  
  const WithErrorBoundaryComponent = (props: T) => (
    <ErrorBoundary {...options}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
  
  WithErrorBoundaryComponent.displayName = 
    `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithErrorBoundaryComponent;
}

/**
 * Lightweight error fallback component for simple error displays
 */
export const SimpleErrorFallback: React.FC<{ error?: Error; onRetry?: () => void }> = ({ 
  error, 
  onRetry 
}) => (
  <div className="flex flex-col items-center justify-center p-6 text-center">
    <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
      Oops! Something went wrong
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">
      {error?.message || 'An unexpected error occurred'}
    </p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    )}
  </div>
);

export default ErrorBoundary; 