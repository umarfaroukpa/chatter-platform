"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase";

interface UserData {
    username: string;
    userType: string;
    phoneNumber?: string;
    email?: string;
    profilePicUrl?: string;
    tags: string[];
    posts: { id: string; title: string; content: string }[];
    bookmarks: string[];
    comments: { id: string; text: string }[];
}

const Sidebar = ({ onTabChange, activeTab, isOpen, toggleSidebar }: { onTabChange: (tab: string) => void; activeTab: string; isOpen: boolean; toggleSidebar: () => void }) => {
    return (
        <div
            className={`bg-gray-300 text-white fixed inset-y-0 left-0 w-64 transition-transform duration-300 z-20 md:static md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
            <div className="flex flex-col text-[#787474] pl-4 pt-4">
                <h3 className="text-lg font-semibold">Account</h3>
                <h6 className="text-sm opacity-70">Manage Your Account Info</h6>
            </div>
            <div className="flex flex-col text-[#787474] mt-6">
                <button onClick={() => onTabChange("profile")} className={`w-full text-left py-3 px-4 ${activeTab === "profile" ? "bg-[#07327a] text-white" : "hover:bg-gray-200 hover:text-[#07327a]"}`}>My Profile</button>
                <button onClick={() => onTabChange("posts")} className={`w-full text-left py-3 px-4 ${activeTab === "posts" ? "bg-[#07327a] text-white" : "hover:bg-gray-200 hover:text-[#07327a]"}`}>My Posts</button>
                <button onClick={() => onTabChange("bookmarks")} className={`w-full text-left py-3 px-4 ${activeTab === "bookmarks" ? "bg-[#07327a] text-white" : "hover:bg-gray-200 hover:text-[#07327a]"}`}>Bookmarks</button>
                <button onClick={() => onTabChange("comments")} className={`w-full text-left py-3 px-4 ${activeTab === "comments" ? "bg-[#07327a] text-white" : "hover:bg-gray-200 hover:text-[#07327a]"}`}>Comments</button>
            </div>
            <button onClick={toggleSidebar} className="md:hidden absolute top-4 right-4 text-[#787474] hover:text-[#07327a]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

const ProfilePage = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    const fetchUserData = useCallback(async (retries = 3, delay = 1000) => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            router.push("/auth/login");
            return;
        }

        try {
            const response = await axios.post('/api/user', { uid: user.uid }, { headers: { 'Content-Type': 'application/json' } });
            const result = response.data;

            if (result.success) {
                setUserData(result.data);
                localStorage.setItem('currentUser', JSON.stringify({ uid: user.uid }));
                setLoading(false);
            } else if (result.error === 'User not found' && retries > 0) {
                console.log(`User not found, retrying (${retries} attempts left)...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchUserData(retries - 1, delay * 2);
            } else {
                setError('Failed to fetch user data: ' + result.error);
                setLoading(false);
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.status === 404 && retries > 0) {
                console.log(`404 received, retrying (${retries} attempts left)...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchUserData(retries - 1, delay * 2);
            } else {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                console.error('Error fetching user data:', errorMessage);
                setError(errorMessage);
                setLoading(false);
            }
        }
    }, [router]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData();
            } else {
                setLoading(false);
                router.push("/auth/login");
            }
        });
        return () => unsubscribe();
    }, [fetchUserData, router]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleProfileUpdate = async () => {
        if (userData) {
            if (userData.email && !validateEmail(userData.email)) {
                setError("Please enter a valid email address");
                return;
            }
            const profileDataToSend = {
                username: userData.username || "Anonymous",
                phoneNumber: userData.phoneNumber || "",
                email: userData.email || "",
                profilePicUrl: userData.profilePicUrl || "",
            };
            try {
                const response = await axios.post('/api/profile', {
                    uid: auth.currentUser?.uid,
                    profileData: profileDataToSend,
                }, { headers: { 'Content-Type': 'application/json' } });
                if (response.data.success) {
                    setUserData((prev) => ({
                        ...(prev || { userType: "unknown", tags: [], posts: [], bookmarks: [], comments: [] }),
                        ...profileDataToSend,
                    }));
                    setEditing(false);
                    await fetchUserData();
                }
            } catch (error: unknown) {
                console.error('Error updating profile:', error instanceof Error ? error.message : 'unknown error');
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const MAX_FILE_SIZE = 100 * 1024;
            if (file.size > MAX_FILE_SIZE) {
                alert('File too large! Maximum size allowed is 100 KB.');
                return;
            }
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('uid', auth.currentUser!.uid);
                const response = await axios.post('/api/uploadings', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
                if (response.data.success && userData) {
                    const profilePicUrl = `/api/profilepicture?uid=${auth.currentUser!.uid}`;
                    setNewProfilePic(file);
                    setUserData({ ...userData, profilePicUrl });
                    await handleProfileUpdate();
                }
            } catch (error: unknown) {
                console.error('Error uploading file:', error instanceof Error ? error.message : 'unknown error');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-2xl font-bold text-[#07327a] animate-pulse">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            setLoading(true);
                            fetchUserData();
                        }}
                        className="text-[#787474] py-2 px-4 rounded border border-[#787474] hover:bg-[#07327a] hover:text-white transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen md:flex-row relative">
            {error && <p className="text-red-500">Error: {error}</p>}
            <button onClick={toggleSidebar} className="md:hidden fixed top-4 left-4 z-30 bg-[#07327a] text-white p-2 rounded-full shadow hover:bg-[#787474]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <Sidebar onTabChange={handleTabChange} activeTab={activeTab} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            {isSidebarOpen && <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-10" onClick={toggleSidebar}></div>}
            <div className="flex-1 p-6 md:p-8 md:ml-64">
                {activeTab === "profile" && (
                    <div className="profile-page">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-0 mb-8">
                            <div className="flex-1 -ml-48 text-start md:text-left">
                                <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-20 text-[#07327a]">Profile Details</h1>
                                <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-700">User</h3>
                                <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-700">+Phone Number</h3>
                                <h3 className="text-base md:text-lg font-semibold text-gray-700">+Email</h3>
                            </div>
                            <div className="flex-1 flex flex-col items-center">
                                <div className="profile-image bg-gray-200 w-20 h-20 md:w-24 md:h-24 rounded-full mb-4 flex items-center justify-center overflow-hidden">
                                    {newProfilePic ? (
                                        <Image src={URL.createObjectURL(newProfilePic)} alt="Profile Preview" width={96} height={96} className="w-full h-full object-cover" />
                                    ) : userData?.profilePicUrl ? (
                                        <Image src={userData.profilePicUrl} alt="Profile" width={96} height={96} className="w-full h-full object-cover" />
                                    ) : (
                                        <p className="text-sm md:text-base text-gray-500">No image</p>
                                    )}
                                </div>
                                <div className="w-full text-center">
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={userData?.username || "User"}
                                            onChange={(e) => setUserData(userData ? { ...userData, username: e.target.value } : null)}
                                            className="text-base md:text-lg border rounded px-2 py-1 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#07327a]"
                                        />
                                    ) : (
                                        <p className="text-base md:text-lg mb-4 text-gray-800">{userData?.username || "User"}</p>
                                    )}
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={userData?.phoneNumber || ""}
                                            onChange={(e) => setUserData(userData ? { ...userData, phoneNumber: e.target.value } : { ...userData, phoneNumber: "" })}
                                            className="text-base md:text-lg border rounded px-2 py-1 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-[#07327a]"
                                            placeholder="+Add Phone Number"
                                        />
                                    ) : (
                                        <p className="text-base md:text-lg mb-4 text-gray-800">{userData?.phoneNumber || "+Add Phone Number"}</p>
                                    )}
                                    {editing ? (
                                        <input
                                            type="email"
                                            value={userData?.email || ""}
                                            onChange={(e) => setUserData(userData ? { ...userData, email: e.target.value } : { ...userData, email: "" })}
                                            className="text-base md:text-lg border rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-[#07327a]"
                                            placeholder="+Add Email Address"
                                        />
                                    ) : (
                                        <p className="text-base md:text-lg text-gray-800">{userData?.email || "+Add Email Address"}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col items-center md:items-end">
                                {editing ? (
                                    <button className="text-[#787474] border border-[#787474] py-2 px-6 rounded-lg mb-4 hover:bg-[#07327a] hover:text-white transition" onClick={handleProfileUpdate}>
                                        Save Changes
                                    </button>
                                ) : (
                                    <button className="text-[#787474] border border-[#787474] py-2 px-6 rounded-lg mb-4 hover:bg-[#07327a] hover:text-white transition" onClick={() => setEditing(true)}>
                                        Edit Profile
                                    </button>
                                )}
                                {editing && <input type="file" onChange={handleFileChange} accept="image/*" className="mt-4 text-sm md:text-base text-gray-700" />}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "posts" && (
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-[#07327a]">Posts</h2>
                        {userData?.posts?.length ? (
                            userData.posts.map((post, index) => (
                                <div key={post.id || index} className="mb-6 p-4 bg-white shadow rounded-lg">
                                    <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">{post.title}</h3>
                                    <p className="text-sm md:text-base text-gray-600">{post.content}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm md:text-base text-gray-600">No posts available.</p>
                        )}
                    </div>
                )}
                {activeTab === "bookmarks" && (
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-[#07327a]">Bookmarks</h2>
                        {userData?.bookmarks?.length ? (
                            userData.bookmarks.map((bookmarkId, index) => (
                                <div key={bookmarkId || index} className="mb-6 p-4 bg-white shadow rounded-lg">
                                    <h3 className="text-lg md:text-xl text-gray-800">Post ID: {bookmarkId}</h3>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm md:text-base text-gray-600">No bookmarks available.</p>
                        )}
                    </div>
                )}
                {activeTab === "comments" && (
                    <div>
                        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-[#07327a]">Comments</h2>
                        {userData?.comments?.length ? (
                            userData.comments.map((comment, index) => (
                                <div key={comment.id || index} className="mb-6 p-4 bg-white shadow rounded-lg">
                                    <p className="text-sm md:text-base text-gray-600">{comment.text}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm md:text-base text-gray-600">No comments available.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 z-10">
                <Link href="/" className="text-[#787474] py-2 px-6 border border-[#787474] rounded-lg w-full md:w-auto text-center hover:bg-[#07327a] hover:text-white transition">Go to Homepage</Link>
                <Link href="/onboarding/feed" className="text-[#787474] py-2 px-6 border border-[#787474] rounded-lg w-full md:w-auto text-center hover:bg-[#07327a] hover:text-white transition">Go to Feed</Link>
            </div>
        </div>
    );
};

export default ProfilePage;

