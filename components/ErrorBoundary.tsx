// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode; // Optional custom fallback UI
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        // Update state so the next render shows the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error to an error reporting service (e.g., Sentry) or console
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    handleReset = () => {
        // Reset the error state to retry rendering the children
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            // Use custom fallback if provided, otherwise use default
            return this.props.fallback || (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Something Went Wrong</h1>
                    <p className="text-lg text-gray-700 mb-6">
                        An unexpected error occurred: {this.state.error?.message || 'Unknown error'}
                    </p>
                    <button
                        onClick={this.handleReset}
                        className="bg-[#07327a] text-white py-2 px-6 rounded-lg hover:bg-[#787474] transition"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;