//app/dashboard/profilesetup/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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
    bookmarks: { id: string; title: string }[];
    comments: { id: string; text: string }[];
}

const Sidebar = ({ onTabChange, activeTab }: { onTabChange: (tab: string) => void; activeTab: string }) => {
    return (
        <div className="bg-gray-300 text-white fixed h-screen transition-all duration-300 z-10 w-64">
            <div className="flex flex-col text-[#787474] pl-4">
                <h3 className="text-lg pt-4">Account</h3>
                <h6 className="text-base opacity-50">Manage Your Account Info</h6>
            </div>
            <div className="flex flex-col items-center text-[#787474] ">
                <button
                    onClick={() => onTabChange("profile")}
                    className={`mt-4 w-full text-left py-2 px-4 ${activeTab === "profile" ? 'bg-[#07327a] text-white' : 'hover:text-gray-600'}`}
                >
                    My Profile
                </button>
                <button
                    onClick={() => onTabChange("posts")}
                    className={`mt-4 w-full text-left py-2 px-4 ${activeTab === "posts" ? 'bg-[#07327a] text-white' : 'hover:text-gray-600'}`}
                >
                    My Posts
                </button>
                <button
                    onClick={() => onTabChange("bookmarks")}
                    className={`mt-4 w-full text-left py-2 px-4 ${activeTab === "bookmarks" ? 'bg-[#07327a] text-white' : 'hover:text-gray-600'}`}
                >
                    Bookmarks
                </button>
                <button
                    onClick={() => onTabChange("comments")}
                    className={`mt-4 w-full text-left py-2 px-4 ${activeTab === "comments" ? 'bg-[#07327a] text-white' : 'hover:text-gray-600'}`}
                >
                    Comments
                </button>
            </div>
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
    const router = useRouter();

    const fetchUserData = useCallback(async () => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const response = await axios.post('/api/user', {
                        uid: user.uid,
                    }, {
                        headers: { 'Content-Type': 'application/json' },
                    });
                    const result = response.data;
                    console.log('Fetched user data:', result.data);
                    if (result.success) {
                        setUserData(result.data);
                    } else {
                        console.error('Error fetching user data:', result.error);
                        if (result.error === 'User not found') {
                            const defaultData = {
                                uid: user.uid,
                                username: "Default User",
                                userType: "unknown",
                                email: user.email || "",
                                phoneNumber: "",
                                profilePicUrl: "",
                                tags: [],
                                posts: [],
                                bookmarks: [],
                                comments: [],
                            };
                            setUserData(defaultData);
                            try {
                                await axios.post('/api/profile', { uid: user.uid, profileData: defaultData });
                                console.log('Created default user in MongoDB');
                            } catch (createError: any) {
                                console.error('Error creating default user:', createError.response?.data || createError.message);
                                setError('Failed to initialize user profile.');
                            }
                        } else {
                            setError('Failed to fetch user data: ' + result.error);
                        }
                    }
                } catch (error: any) {
                    console.error('Error fetching user data:', error.response?.data || error.message);
                    setError('Failed to load user data due to server issue. Please try again.');
                } finally {
                    setLoading(false); // Ensure loading stops even on error
                }
            } else {
                setLoading(false); // Stop loading if no user
                router.push("/auth/login");
            }
        });

        // Cleanup subscription to prevent memory leaks
        return () => unsubscribe();
    }, [router]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleProfileUpdate = async () => {
        if (userData) {
            const profileDataToSend = {
                username: userData.username || "Anonymous",
                phoneNumber: userData.phoneNumber || "",
                email: userData.email || "",
                profilePicUrl: userData.profilePicUrl || "",
            };
            console.log('Sending profileData to /api/profile:', profileDataToSend);
            try {
                const response = await axios.post('/api/profile', {
                    uid: auth.currentUser?.uid,
                    profileData: profileDataToSend,
                }, {
                    headers: { 'Content-Type': 'application/json' },
                });

                const result = response.data;
                console.log('Update response from /api/profile:', result);
                if (result.success) {
                    setUserData((prev: UserData | null): UserData => {
                        const updatedData = {
                            ...(prev || { userType: "unknown", tags: [], posts: [], bookmarks: [], comments: [] }),
                            username: result.data.username || "Anonymous",
                            phoneNumber: result.data.phoneNumber || "",
                            email: result.data.email || "",
                            profilePicUrl: result.data.profilePicUrl || "",
                        };
                        console.log('Updated local userData:', updatedData);
                        return updatedData;
                    });
                    setEditing(false);
                    await fetchUserData();
                } else {
                    console.error('Error updating profile:', result.error);
                }
            } catch (error: any) {
                console.error('Error calling /api/profile:', error.response?.data || error.message);
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log('Uploading file:', file.name, file.size);

            const MAX_FILE_SIZE = 100 * 1024; // 25 KB (Note: Your comment says 500 KB, adjust if needed)
            if (file.size > MAX_FILE_SIZE) {
                console.error('File size exceeds limit:', file.size, 'bytes. Maximum allowed is', MAX_FILE_SIZE, 'bytes.');
                alert('File too large! Maximum size allowed is 25 KB.');
                return;
            }

            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('uid', auth.currentUser!.uid);

                const response = await axios.post('/api/uploadings', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                const contentType = response.headers['content-type'];
                if (contentType && contentType.includes('application/json')) {
                    const data = response.data;
                    if (data.success && userData) {
                        const profilePicUrl = `/api/profilepicture?uid=${auth.currentUser!.uid}`;
                        setNewProfilePic(file);
                        setUserData({ ...userData, profilePicUrl });
                        await handleProfileUpdate();
                    }
                } else {
                    console.error('Unexpected response (not JSON):', response.data);
                }
            } catch (error: any) {
                console.error('Error uploading file:', error.response?.data || error.message);
            }
        }
    };

    // If loading, return the loading screen
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="loading-animation text-2xl font-bold">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar onTabChange={handleTabChange} activeTab={activeTab} />
            <div className="flex-1 ml-64 p-8">
                {activeTab === "profile" && (
                    <div className="profile-page">
                        <div className="flex justify-between items-start mb-8">
                            {/* Left: Profile Details and Labels */}
                            <div className="flex-1">
                                <h1 className="text-4xl font-bold mb-20">Profile Details</h1>
                                <h3 className="text-lg font-semibold mb-4">User</h3>
                                <h3 className="text-lg font-semibold mb-4">+Phone Number</h3>
                                <h3 className="text-lg font-semibold">+Email</h3>
                            </div>
                            {/* Center: Profile Pic and Outputted Values */}
                            <div className="flex-1 flex flex-col items-center">
                                <div className="profile-image bg-gray-200 w-24 h-24 rounded-full mb-4">
                                    {newProfilePic ? (
                                        <img src={URL.createObjectURL(newProfilePic)} alt="Profile Preview" className="rounded-full w-24 h-24" />
                                    ) : userData?.profilePicUrl ? (
                                        <img src={userData.profilePicUrl} alt="Profile" className="rounded-full w-24 h-24" />
                                    ) : (
                                        <p>No image</p>
                                    )}
                                </div>
                                <div className="w-full text-center">
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={userData?.username || "User"}
                                            onChange={(e) => setUserData(userData ? { ...userData, username: e.target.value } : null)}
                                            className="text-lg border px-2 py-1 w-full mb-4"
                                        />
                                    ) : (
                                        <p className="text-lg mb-4">{userData?.username || "User"}</p>
                                    )}
                                    {editing ? (
                                        <input
                                            type="text"
                                            value={userData?.phoneNumber || ""}
                                            onChange={(e) => setUserData(userData ? { ...userData, phoneNumber: e.target.value } : { ...userData, phoneNumber: "" })}
                                            className="text-lg border px-2 py-1 w-full mt-12 mb-4"
                                            placeholder="+Add Phone Number"
                                        />
                                    ) : (
                                        <p className="text-lg mb-4">{userData?.phoneNumber || "+Add Phone Number"}</p>
                                    )}
                                    {editing ? (
                                        <input
                                            type="email"
                                            value={userData?.email || ""}
                                            onChange={(e) => setUserData(userData ? { ...userData, email: e.target.value } : { ...userData, email: "" })}
                                            className="text-lg border px-2 py-1 w-full"
                                            placeholder="+Add Email Address"
                                        />
                                    ) : (
                                        <p className="text-lg">{userData?.email || "+Add Email Address"}</p>
                                    )}
                                </div>
                            </div>
                            {/* Right: Edit/Save Button and File Input */}
                            <div className="flex-1 flex flex-col items-end">
                                {editing ? (
                                    <button
                                        className="bg-green-600 text-white py-2 px-4 rounded-lg mb-4"
                                        onClick={handleProfileUpdate}
                                    >
                                        Save Changes
                                    </button>
                                ) : (
                                    <button
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg mb-4"
                                        onClick={() => setEditing(true)}
                                    >
                                        Edit Profile
                                    </button>
                                )}
                                {editing && (
                                    <input type="file" onChange={handleFileChange} accept="image/*" className="mt-4" />
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "posts" && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Posts</h2>
                        {userData?.posts?.length ? (
                            userData.posts.map((post) => (
                                <div key={post.id} className="post-card mb-6 p-4 bg-white shadow rounded-lg">
                                    <h3 className="text-2xl font-semibold mb-2">{post.title}</h3>
                                    <p>{post.content}</p>
                                </div>
                            ))
                        ) : (
                            <p>No posts available.</p>
                        )}
                    </div>
                )}
                {activeTab === "bookmarks" && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Bookmarks</h2>
                        {userData?.bookmarks?.length ? (
                            userData.bookmarks.map((bookmark) => (
                                <div key={bookmark.id} className="bookmark-card mb-6 p-4 bg-white shadow rounded-lg">
                                    <h3 className="text-xl">{bookmark.title}</h3>
                                </div>
                            ))
                        ) : (
                            <p>No bookmarks available.</p>
                        )}
                    </div>
                )}
                {activeTab === "comments" && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                        {userData?.comments?.length ? (
                            userData.comments.map((comment) => (
                                <div key={comment.id} className="comment-card mb-6 p-4 bg-white shadow rounded-lg">
                                    <p>{comment.text}</p>
                                </div>
                            ))
                        ) : (
                            <p>No comments available.</p>
                        )}
                    </div>
                )}
            </div>
            <div className="fixed bottom-0 right-0 p-4 bg-gray-100 w-full flex justify-center items-center">
                <Link href="/" className="mr-4 bg-blue-600 text-white py-2 px-4 rounded-lg">
                    Go to Homepage
                </Link>
                <Link href="/feed" className="bg-blue-600 text-white py-2 px-4 rounded-lg">
                    Go to Feed
                </Link>
            </div>
        </div>
    );
};

export default ProfilePage;