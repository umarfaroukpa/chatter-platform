"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../../../lib/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import Image from "next/image";
import CommentSection from "../../components/CommentSection";
import ErrorBoundary from "../../components/ErrorBoundary";


const FeedPage = () => {
    const [feedPosts, setFeedPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [user, setUser] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [expandedPost, setExpandedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(null);
    const [techNews, setTechNews] = useState([]);
    const [newsLoading, setNewsLoading] = useState(true);
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isConfirmingLogout, setIsConfirmingLogout] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLogoutMessage(null);
            if (user) {
                setUser(user);
                localStorage.setItem('currentUser', JSON.stringify({ uid: user.uid }));
                fetchUserProfile(user.uid);
                fetchPosts();
                fetchTechNews();
            } else {
                router.push('/auth/login');
            }
        });
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredPosts(feedPosts);
        } else {
            const filtered = feedPosts.filter(
                post =>
                    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    post.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPosts(filtered);
        }
    }, [searchTerm, feedPosts]);

    const fetchUserProfile = async (uid) => {
        try {
            const response = await axios.post('/api/user', { uid });
            if (response.data.success) {
                setProfileData(response.data.data);
                console.log('Profile data:', response.data.data);
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
            const response = await axios.get(`/api/post?timestamp=${new Date().getTime()}`);
            if (response.data.success) {
                console.log('Raw API response:', response.data.data);
                const posts = response.data.data;
                // Validate each post has a postId
                posts.forEach((post, index) => {
                    if (!post.postId) {
                        console.error(`Post at index ${index} is missing postId:`, post);
                    }
                });
                setFeedPosts(posts);
                setFilteredPosts(posts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            setError("Failed to load posts. Please try refreshing the page.");
        } finally {
            setLoading(false);
        }
    };

    const fetchTechNews = async () => {
        try {
            setNewsLoading(true);
            const response = await axios.get('/api/update');
            if (response.data.success) {
                setTechNews(response.data.articles);
            }
        } catch (error) {
            console.error("Error fetching tech news:", error);
            console.log("Using fallback tech news data");
            setTechNews([
                { id: 1, title: "New AI Model Released by Anthropic", url: "#", source: "Tech Crunch" },
                { id: 2, title: "The Future of Web Development: What's Next?", url: "#", source: "Wired" },
                { id: 3, title: "Cybersecurity Trends for Developers", url: "#", source: "TechRadar" },
                { id: 4, title: "React 20 Features: What's New", url: "#", source: "Medium" },
                { id: 5, title: "The Rise of No-Code Development Platforms", url: "#", source: "Forbes Tech" }
            ]);
        } finally {
            setNewsLoading(false);
        }
    };

    const handleLike = async (postId) => {
        if (!postId) {
            console.error("No postId provided");
            setError("Invalid post. Please try again.");
            return;
        }
        if (!user || !user.uid) {
            setError("You must be logged in to like a post.");
            return;
        }
        console.log('handleLike called with:', { postId, userId: user.uid });
        try {
            await axios.post(`/api/likes`, { postId, userId: user.uid });
            fetchPosts();
        } catch (error) {
            console.error("Error liking post:", error);
            setError("Failed to like post. Please try again.");
        }
    };

    const handleBookmark = async (postId) => {
        try {
            const response = await axios.post(`/api/bookmarks`, { postId, uid: user.uid });
            if (response.data.success) {
                alert(response.data.message || "Post bookmarked!");
            } else {
                setError(response.data.error || "Failed to bookmark post.");
            }
        } catch (error) {
            console.error("Error bookmarking post:", error);
            setError("Failed to bookmark post. Please try again.");
        }
    };

    const toggleComments = (postId) => {
        setShowComments(showComments === postId ? null : postId);
    };

    const getProfilePicUrl = () => {
        if (profileData?.profilePicFileId) {
            return `/api/profilepicture?uid=${user.uid}`;
        }
        return "/default-avatar.png";
    };

    const confirmLogout = async () => {
        try {
            await signOut(auth);
            setLogoutMessage("Logged out successfully!");
            setTimeout(() => {
                router.push('/');
                setLogoutMessage(null);
            }, 1500);
        } catch (error) {
            console.error("Error logging out:", error);
            setError("Failed to log out. Please try again.");
        } finally {
            setIsConfirmingLogout(false);
        }
    };

    const cancelLogout = () => {
        setIsConfirmingLogout(false);
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
                        className="text-[#787474] py-2 px-4 rounded border border-[#787474] hover:bg-[#07327a] hover:text-white transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const customFallback = (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
            <h1 className="text-4xl font-bold text-[#07327a] mb-4">Something Went Wrong</h1>
            <p className="text-lg text-gray-600 mb-6 text-center">An unexpected error occurred.</p>
            <Link
                href="/"
                className="bg-[#07327a] text-white py-2 px-6 rounded-lg hover:bg-[#787474] transition text-center"
            >
                Back to Home
            </Link>
        </div>
    );

    if (loading) return <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-[#07327a] animate-pulse">Loading...</div>
    </div>
    if (error) throw new Error(error);


    return (
        <ErrorBoundary fallback={customFallback}>
            <div className="flex md:flex-row min-h-screen">
                {isConfirmingLogout && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-11/12 max-w-md">
                            <h2 className="text-lg md:text-xl font-bold mb-4 text-center">Confirm Logout</h2>
                            <p className="mb-6 text-center">Are you sure you want to log out?</p>
                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                                <button
                                    onClick={confirmLogout}
                                    className="text-[#787474] border border-[#787474] py-2 px-4 rounded hover:bg-[#07327a] hover:text-white transition"
                                >
                                    Yes, Logout
                                </button>
                                <button
                                    onClick={cancelLogout}
                                    className="text-[#787474] border border-[#787474] py-2 px-4 rounded hover:bg-[#07327a] hover:text-white transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {logoutMessage && (
                    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
                        {logoutMessage}
                    </div>
                )}

                <aside className="md:w-64 bg-gray-100 p-6 md:min-h-screen hidden md:block">
                    <div className="mb-8 flex flex-col items-start">
                        {user && !loading ? (
                            <>
                                <Image
                                    src={getProfilePicUrl()}
                                    alt="Profile"
                                    width={24}
                                    height={24}
                                    className="rounded-full mb-2 object-cover"
                                    key={profileData?.profilePicFileId}
                                />
                                <p className="mb-2 font-medium">{profileData?.username || user.email}</p>
                                <Link href="/dashboard/profilesetup">
                                    <p className="text-[#787474] underline font-bold">Profile Setup</p>
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

                    <div className="mb-8">
                        <h2 className="text-xl text-[#787474] font-bold mb-4">Explore</h2>
                        <ul>
                            <li className="mb-2">
                                <Link href="/onboarding/feed">
                                    <p className="text-[#787474] hover:underline">All Posts</p>
                                </Link>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-[#787474] hover:underline">Trending</a>
                            </li>
                            <li className="mb-2">
                                <a href="#" className="text-[#787474] hover:underline">Categories</a>
                            </li>
                            <li className="mb-2">
                                <Link href="dashboard/bookmarks">
                                    <p className="text-[#787474] hover:underline">Bookmarks</p>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {profileData?.userType === "Writer" && (
                        <div className="mb-8">
                            <Link href="/dashboard/createpost">
                                <p className="block text-[#787474] border border-[#787474] py-2 px-4 rounded text-center hover:bg-[#07327a] hover:text-white transition">Create Post</p>
                            </Link>
                            <div className="mt-4">
                                <Link href="/" className="block text-[#787474] border border-[#787474] py-2 px-4 rounded text-center hover:bg-[#07327a] hover:text-white transition">
                                    Go to Homepage
                                </Link>
                            </div>
                        </div>

                    )}

                    {profileData?.userType === "Reader" && (
                        <div className="mb-8">
                            <Link href="/" className="block text-[#787474] border border-[#787474] py-2 px-4 rounded text-center hover:bg-[#07327a] hover:text-white transition">
                                Go to Homepage
                            </Link>
                        </div>
                    )}



                </aside>

                <div className="block fixed left-4 z-30 md:hidden">
                    <button
                        onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
                        className="bg-[#07327a] text-white p-2 rounded-full shadow"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {isMobileDrawerOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden">
                        <div className="absolute top-0 left-0 w-64 h-full bg-gray-100 p-6">
                            <div className="mb-8 flex flex-col items-start">
                                {user && !loading ? (
                                    <>
                                        <Image
                                            src={getProfilePicUrl()}
                                            alt="Profile"
                                            width={16}
                                            height={16}
                                            className="rounded-full mb-2 object-cover"
                                            key={profileData?.profilePicFileId}
                                        />
                                        <p className="mb-2 font-medium">{profileData?.username || user.email}</p>
                                        <Link href="/dashboard/profilesetup">
                                            <p className="text-[#787474] underline font-bold">Profile Setup</p>
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

                            <div className="mb-8">
                                <h2 className="text-xl text-[#787474] font-bold mb-4">Explore</h2>
                                <ul>
                                    <li className="mb-2">
                                        <Link href="/onboarding/feed">
                                            <p className="text-[#787474] hover:underline">All Posts</p>
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="text-[#787474] hover:underline">Trending</a>
                                    </li>
                                    <li className="mb-2">
                                        <a href="#" className="text-[#787474] hover:underline">Categories</a>
                                    </li>
                                    <li className="mb-2">
                                        <Link href="/dashboard/bookmarks">
                                            <p className="text-[#787474] hover:underline">Bookmarks</p>
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {profileData?.userType === "Writer" && (
                                <div className="mb-8">
                                    <Link href="/dashboard/createpost">
                                        <p className="block text-[#787474] border border-[#787474] py-2 px-4 rounded text-center hover:bg-[#07327a] hover:text-white transition">Create Post</p>
                                    </Link>
                                </div>
                            )}

                        </div>
                    </div>
                )}

                <main className="flex-1 p-6 md:px-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            {profileData?.userType === "Writer" && (
                                <Link href="/dashboard/createpost" className="md:hidden block text-[#787474] border border-[#787474] py-2 px-4 rounded hover:bg-[#07327a] hover:text-white transition">
                                    Create Post
                                </Link>
                            )}
                        </div>

                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search posts by title, content, or author..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 pl-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#07327a]"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-3 top-3 text-[#787474] hover:text-[#07327a]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
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
                        ) : filteredPosts.length === 0 ? (
                            <div className="text-center py-10">
                                {searchTerm ? (
                                    <p className="text-xl text-[#787474]">No posts found matching &quot;{searchTerm}&quot;</p>
                                ) : (
                                    <>
                                        <p className="text-xl text-[#787474]">No posts yet.</p>
                                        {profileData?.userType === "Writer" && (
                                            <Link href="/dashboard/createpost">
                                                <p className="mt-4 text-[#787474] hover:underline">Create your first post</p>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {filteredPosts
                                    .filter(post => post && post.postId)
                                    .map((post, index) => (
                                        <div key={post.postId || index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                                            <div className="flex justify-between items-start mb-4 flex-col md:flex-row">
                                                <h2 className="text-2xl font-semibold">{post.title}</h2>
                                                <span className="text-sm text-[#787474] mt-2 md:mt-0">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-[#787474] mb-2">
                                                By <span className="font-medium">{post.author}</span>
                                            </p>

                                            {expandedPost === post.postId ? (
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
                                                    onClick={() => setExpandedPost(expandedPost === post.postId ? null : post.postId)}
                                                    className="text-[#787474] hover:underline mb-4"
                                                >
                                                    {expandedPost === post.postId ? "Show less" : "Read more"}
                                                </button>
                                            )}

                                            <div className="flex items-center space-x-4 border-t pt-4 flex-wrap gap-4 md:gap-0">
                                                <button
                                                    onClick={() => handleLike(post.postId)}
                                                    className={`inline-flex items-center p-1 rounded-full ${post.likes?.includes(user?.uid) ? 'text-[#787474]' : 'text-[#07327a]'
                                                        } hover:text-[#787474] focus:outline-none`}
                                                    title="Like"
                                                    disabled={!post.postId}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                                                        />
                                                    </svg>
                                                    <span className="ml-1">{post.likes?.length || 0}</span>
                                                </button>

                                                <button
                                                    onClick={() => toggleComments(post.postId)}
                                                    className="inline-flex items-center p-1 rounded-full text-[#787474] hover:text-[#07327a] focus:outline-none"
                                                    title="Comment"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                                        />
                                                    </svg>
                                                    <span className="ml-1">{post.comments?.length || 0}</span>
                                                </button>

                                                <button
                                                    onClick={() => handleBookmark(post.postId)}
                                                    className="inline-flex items-center p-1 rounded-full text-[#787474] hover:text-[#07327a] focus:outline-none ml-auto"
                                                    title="Bookmark"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-6 w-6"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>

                                            {showComments === post.postId && (
                                                <div className="mt-6 border-t pt-4">
                                                    <CommentSection
                                                        postId={post.postId}
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
                    </div>
                </main>

                <aside className="w-80 bg-gray-50 p-6 border-l border-gray-200 md:block hidden md:visible">
                    <h2 className="text-xl font-bold mb-6 text-[#07327a]">Updates</h2>

                    {newsLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {techNews.map((news) => (
                                <div key={news.id} className="border-b border-gray-200 pb-4">
                                    <a
                                        href={news.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#07327a] hover:underline font-medium block mb-1"
                                    >
                                        {news.title}
                                    </a>
                                    <span className="text-xs text-gray-500">{news.source}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h3 className="font-medium text-[#787474] mb-2">Stay Updated</h3>
                        <p className="text-sm text-[#07327a] mb-3">Never miss the latest in tech and development. Subscribe to our weekly newsletter.</p>
                        <div className="flex flex-col md:flex-row">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-3 py-2 text-sm border rounded-t-md md:rounded-l-md md:rounded-t-none focus:outline-none focus:ring-1 focus:ring-[#787474] mb-2 md:mb-0"
                            />
                            <button className="bg-[#07327a] text-white px-3 py-2 text-sm rounded-b-md md:rounded-r-md md:rounded-b-none hover:bg-[#787474]">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </aside>

                <style jsx>{`
                @media (max-width: 767px) {
                    .flex.justify-between.items-center.mb-6 {
                        flex-direction: row-reverse;
                    }
                }
            `}</style>
            </div>
        </ErrorBoundary>
    );
};

export default FeedPage;