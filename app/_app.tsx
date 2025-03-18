import { AppProps } from 'next/app';
import ErrorBoundary from './components/ErrorBoundary';
import Link from 'next/link';

function MyApp({ Component, pageProps }: AppProps) {
    const customFallback = (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <h1 className="text-4xl font-bold text-[#07327a] mb-4">Something Went Wrong</h1>
            <p className="text-lg text-gray-600 mb-6 text-center">
                An unexpected error occurred.
            </p>
            <Link href="/" className="bg-[#07327a] text-white py-2 px-6 rounded-lg hover:bg-[#787474] transition text-center">
                Back to Home
            </Link>
        </div>
    );

    return (
        <ErrorBoundary fallback={customFallback}>
            <Component {...pageProps} />
        </ErrorBoundary>
    );
}

export default MyApp;