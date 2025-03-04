"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import CommentSection from "../components/CommentSection";

const FeedPage = () => {
    const [feedPosts, setFeedPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [expandedPost, setExpandedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                localStorage.setItem('currentUser', JSON.stringify({ uid: user.uid }));
                fetchUserProfile(user.uid);
                fetchPosts();
            } else {
                router.push('/auth/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const fetchUserProfile = async (uid) => {
        try {
            const response = await axios.post('/api/user', { uid });
            if (response.data.success) {
                setProfileData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setError("Failed to load profile data. Please try refreshing the page.");
        } finally {
            setLoading(false);
        }
    };

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/posts?timestamp=${new Date().getTime()}`);
            if (response.data.success) {
                setFeedPosts(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            setError("Failed to load posts. Please try refreshing the page.");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            await axios.post(`/api/likes`, {
                postId,
                userId: user.uid
            });
            fetchPosts(); // Refresh posts to get updated likes
        } catch (error) {
            console.error("Error liking post:", error);
            setError("Failed to like post. Please try again.");
        }
    };

    const handleBookmark = async (postId) => {
        try {
            await axios.post(`/api/bookmarks`, {
                postId,
                uid: user.uid
            });
            alert("Post bookmarked!");
        } catch (error) {
            console.error("Error bookmarking post:", error);
            setError("Failed to bookmark post. Please try again.");
        }
    };

    const toggleComments = (postId) => {
        setShowComments(showComments === postId ? null : postId);
    };

    // Generate proper profile picture URL
    const getProfilePicUrl = () => {
        if (profileData?.profilePicFileId) {
            return `/api/profilepicture?uid=${user.uid}`;
        }
        return "/default-avatar.png";
    };

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            fetchPosts();
                        }}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex md:flex-row min-h-screen">
            {/* Sidebar */}
            <aside className="md:w-64 w-64 bg-gray-100 p-6 md:min-h-screen">
                {/* Profile Preview */}
                <div className="mb-8 flex flex-col items-start">
                    {user && !loading ? (
                        <>
                            <img
                                src={getProfilePicUrl()}
                                alt="Profile"
                                className="w-6 h-6 rounded-full mb-2 object-cover ml-4"
                                key={profileData?.profilePicFileId}
                            />
                            <p className="mb-2 text-center ml-4">{profileData?.username || user.email}</p>
                            <Link href="/dashboard/profilesetup">
                                <p className="text-blue-500 underline font-bold">Profile Setup</p>
                            </Link>
                        </>
                    ) : (
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                            <div className="h-4 bg-gray-300 rounded w-20"></div>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4">Explore</h2>
                    <ul>
                        <li className="mb-2">
                            <Link href="/feed">
                                <p className="text-blue-500 hover:underline">All Posts</p>
                            </Link>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="text-blue-500 hover:underline">Trending</a>
                        </li>
                        <li className="mb-2">
                            <a href="#" className="text-blue-500 hover:underline">Categories</a>
                        </li>
                        <li className="mb-2">
                            <Link href="/bookmarks">
                                <p className="text-blue-500 hover:underline">Bookmarks</p>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Writer Only: Create Post Button */}
                {profileData?.userType === "Writer" && (
                    <div className="mb-8">
                        <Link href="/create-post">
                            <p className="block bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition">Create Post</p>
                        </Link>
                    </div>
                )}

                {/* Log Out Button */}
                <button
                    onClick={() => auth.signOut()}
                    className="w-full mt-8 py-2 px-4 text-left border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition"
                >
                    Log Out
                </button>
            </aside>

            {/* Main Feed */}
            <main className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Your Feed</h1>
                    {profileData?.userType === "Writer" && (
                        <Link href="/create-post" className="md:hidden">
                            <p className="bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600 transition">Create Post</p>
                        </Link>
                    )}
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white p-6 rounded-lg shadow animate-pulse">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : feedPosts.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-xl text-gray-500">No posts yet.</p>
                        {profileData?.userType === "Writer" && (
                            <Link href="/create-post">
                                <p className="mt-4 text-blue-500 hover:underline">Create your first post</p>
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {feedPosts.map((post) => (
                            <div key={post._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-semibold">{post.title}</h2>
                                    <span className="text-sm text-gray-500">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-2">
                                    By <span className="font-medium">{post.author}</span>
                                </p>

                                {/* Show preview of content or full content */}
                                {expandedPost === post._id ? (
                                    <div className="mb-4 whitespace-pre-wrap">{post.content}</div>
                                ) : (
                                    <div className="mb-4 whitespace-pre-wrap">
                                        {post.content.length > 200
                                            ? `${post.content.substring(0, 200)}...`
                                            : post.content}
                                    </div>
                                )}

                                {post.content.length > 200 && (
                                    <button
                                        onClick={() => setExpandedPost(expandedPost === post._id ? null : post._id)}
                                        className="text-blue-500 hover:underline mb-4"
                                    >
                                        {expandedPost === post._id ? "Show less" : "Read more"}
                                    </button>
                                )}

                                <div className="flex items-center space-x-4 border-t pt-4">
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        className={`flex items-center space-x-1 ${post.likes?.includes(user?.uid) ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                        </svg>
                                        <span>{post.likes?.length || 0}</span>
                                    </button>

                                    <button
                                        onClick={() => toggleComments(post._id)}
                                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        <span>{post.comments?.length || 0}</span>
                                    </button>

                                    <button
                                        onClick={() => handleBookmark(post._id)}
                                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 ml-auto"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                        <span>Save</span>
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {showComments === post._id && (
                                    <div className="mt-6 border-t pt-4">
                                        <CommentSection
                                            postId={post._id}
                                            userId={user?.uid}
                                            refreshPost={fetchPosts}
                                            comments={post.comments || []}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FeedPage;