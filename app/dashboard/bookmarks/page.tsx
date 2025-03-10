"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BookmarkedPost {
    _id: string;
    title: string;
    content: string;
    author: {
        name: string;
        id: string;
    };
    createdAt: string;
    tags?: string[];
}

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchBookmarks = async () => {
            setLoading(true);
            setError(null);

            try {
                // Get current user from localStorage
                let currentUser;
                try {
                    currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
                } catch (parseError) {
                    console.error("Error parsing user data:", parseError);
                    setError("Could not retrieve user information. Please try logging in again.");
                    setLoading(false);
                    return;
                }

                // Check if user is logged in
                if (!currentUser || !currentUser.uid) {
                    console.error("No user found in localStorage");
                    setError("Please log in to view your bookmarks");
                    setLoading(false);
                    return;
                }

                // Fetch bookmarks
                const response = await axios.get(`/api/bookmarks?uid=${currentUser.uid}`);

                if (response.data.success) {
                    setBookmarks(response.data.data || []);
                } else {
                    console.error("API returned error:", response.data.message);
                    setError(response.data.message || "Failed to load bookmarks");
                }
            } catch (err: any) {
                console.error("Error fetching bookmarks:", err);
                setError(err.response?.data?.message || err.message || "An error occurred while fetching bookmarks");
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, []);

    const removeBookmark = async (postId: string) => {
        try {
            const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");

            if (!currentUser || !currentUser.uid) {
                setError("Please log in to remove bookmarks");
                return;
            }

            await axios.post("/api/remove-bookmark", {
                uid: currentUser.uid,
                postId
            });

            // Update state to remove the bookmark
            setBookmarks(prev => prev.filter(bookmark => bookmark._id !== postId));
        } catch (err: any) {
            console.error("Error removing bookmark:", err);
            alert(err.response?.data?.message || err.message || "Failed to remove bookmark");
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (err) {
            return "Unknown date";
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#787474] mx-auto"></div>
                    <p className="mt-4 text-[#07327a]">Loading your bookmarks...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-700 mb-6">{error}</p>
                    <button
                        className="bg-[#07327a] text-white px-6 py-2 rounded hover:bg-[#787474] transition"
                        onClick={() => router.push("/feed")}
                    >
                        Back to Feed
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Your Bookmarks</h1>

                {bookmarks.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h2 className="text-xl text-[#787474] mb-4">No bookmarks found</h2>
                        <p className="text-[#787474] mb-6">You haven't bookmarked any posts yet.</p>
                        <Link href="/feed">
                            <span className="bg-[#07327a] text-white px-6 py-2 rounded hover:bg-[#787474] transition">
                                Browse Posts
                            </span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookmarks.map((bookmark) => (
                            <div key={bookmark._id} className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold mb-2">{bookmark.title}</h2>
                                        <p className="text-sm text-[#07327a] mb-4">
                                            By {bookmark.author?.name || "Unknown"} • {formatDate(bookmark.createdAt)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeBookmark(bookmark._id)}
                                        className="text-[#787474] hover:text-[#07327a]"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <p className="text-[#787474] mb-4 line-clamp-3">
                                    {bookmark.content}
                                </p>

                                {bookmark.tags && bookmark.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {bookmark.tags.map((tag) => (
                                            <span key={tag} className="bg-gray-100 text-[#787474] px-2 py-1 rounded text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <Link href={`/post/${bookmark._id}`}>
                                    <span className="text-[#07327a] hover:underline">Read more</span>
                                </Link>
                                <button
                                    className="ml-4 bg-[#07327a] text-white px-6 py-2 rounded hover:bg-[#787474] transition"
                                    onClick={() => router.push("/feed")}
                                >
                                    Back to Feed
                                </button>
                            </div>

                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}