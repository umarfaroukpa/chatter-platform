import '../styles/globals.css';
import { AppProps } from 'next/app';
import MetaHead from 'components/MetaHeader';
import Header from '../components/Header';
import ErrorBoundary from 'components/ErrorBoundary';
import Link from 'next/link';

function MyApp({ Component, pageProps }: AppProps) {
    const customFallback = (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <h1 className="text-4xl font-bold text-[#07327a] mb-4">Something Went Wrong</h1>
            <p className="text-lg text-gray-600 mb-6 text-center">
                We encountered an issue. Don’t worry, we’re on it!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="bg-[#07327a] text-white py-2 px-6 rounded-lg hover:bg-[#787474] transition"
                >
                    Refresh Page
                </button>
                <Link href="/" className="bg-gray-200 text-[#07327a] py-2 px-6 rounded-lg hover:bg-gray-300 transition text-center">
                    Back to Home
                </Link>
            </div>
        </div>
    );

    return (
        <ErrorBoundary fallback={customFallback}>
            <MetaHead />
            <Header />
            <Component {...pageProps} />
        </ErrorBoundary>
    );
}

export default MyApp;