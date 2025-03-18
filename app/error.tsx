"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Error caught in global error.tsx:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <h1 className="text-4xl font-bold text-[#07327a] mb-4">Something Went Wrong</h1>
            <p className="text-lg text-gray-600 mb-6 text-center">
                An unexpected error occurred: {error.message || "Unknown error"}
            </p>
            <div className="flex flex-col md:flex-row gap-4">
                <button
                    onClick={reset}
                    className="bg-[#07327a] text-white py-2 px-6 rounded-lg hover:bg-[#787474] transition text-center"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="bg-[#787474] text-white py-2 px-6 rounded-lg hover:bg-[#07327a] transition text-center"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}