"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <h1 className="text-4xl font-bold text-[#07327a] mb-4">Page Not Found</h1>
            <p className="text-lg text-gray-600 mb-6 text-center">
                The page you are looking for does not exist.
            </p>
            <div className="space-x-4 py-4">
                <Link
                    href="/"
                    className="bg-[#07327a] text-white py-2 px-6 rounded-lg hover:bg-[#787474] transition text-center"
                >
                    Back To Home
                </Link>

                <Link
                    href="/onboarding/feed"
                    className="bg-[#07327a] text-white py-2 px-6 rounded-lg hover:bg-[#787474] transition text-center"
                >
                    Back To Feed
                </Link>
            </div>

        </div>
    );
}