"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../lib/firebase";

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
            <div className="flex flex-col items-center text-[#787474] mt-6">
                <div className="flex flex-col">
                    <h3 className="text-lg">Account</h3>
                    <h6 className="text-base opacity-50">Manage Your Account Info</h6>
                </div>
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
    const router = useRouter();

    const fetchUserData = useCallback(async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const response = await axios.post('/api/user', {
                        uid: user.uid,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    // Axios automatically parses JSON, so response.data is the result
                    const result = response.data;
                    if (result.success) {
                        setUserData(result.data);
                    } else {
                        console.error('Error fetching user data:', result.error);
                    }
                } catch (error: any) {
                    console.error('Error fetching user data:', error.response?.data || error.message);
                } finally {
                    setLoading(false);
                }
            } else {
                router.push("/auth/login");
            }
        });
    }, [router]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleProfileUpdate = async () => {
        if (userData) {
            try {
                const response = await axios.post('/api/profile', {
                    uid: auth.currentUser?.uid,
                    profileData: {
                        username: userData.username || "Anonymous",
                        phoneNumber: userData.phoneNumber || "",
                        email: userData.email || "",
                        profilePicUrl: userData.profilePicUrl || "",
                    },
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const result = response.data;
                console.log('Update response:', result);
                if (result.success) {
                    setUserData({
                        ...userData,
                        username: result.data.username || "Anonymous",
                        phoneNumber: result.data.phoneNumber || "",
                        email: result.data.email || "",
                        profilePicUrl: result.data.profilePicUrl || "",
                    });
                    setEditing(false);
                } else {
                    console.error('Error updating profile:', result.error);
                }
            } catch (error: any) {
                console.error('Error updating profile:', error.response?.data || error.message);
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            console.log('Uploading file:', file.name, file.size);
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('uid', auth.currentUser!.uid); // Pass UID from Firebase Auth

                const response = await axios.post('/api/uploadings', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                const contentType = response.headers['content-type'];
                if (contentType && contentType.includes('application/json')) {
                    const data = response.data;
                    if (data.success && userData) {
                        const profilePicUrl = `/api/profilepicture?uid=${auth.currentUser!.uid}`;
                        setNewProfilePic(file); // Optional: for immediate preview
                        setUserData({ ...userData, profilePicUrl });
                        await handleProfileUpdate(); // Save profilePicUrl to MongoDB
                    }
                } else {
                    console.error('Unexpected response (not JSON):', response.data);
                }
            } catch (error: any) {
                console.error('Error uploading file:', error.response?.data || error.message);
            }
        }
    };

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar onTabChange={handleTabChange} activeTab={activeTab} />

            {/* Main content */}
            <div className="flex-1 ml-64 p-8">
                {activeTab === "profile" && (
                    <div className="profile-page">
                        <h1 className="text-4xl font-bold mb-6">Profile Details</h1>

                        {/* Profile Header */}
                        <div className="flex justify-between items-center mb-8">
                            {editing ? (
                                <input
                                    type="text"
                                    value={userData?.username || ""}
                                    onChange={(e) => setUserData(userData ? { ...userData, username: e.target.value } : null)}
                                    className="text-2xl font-semibold"
                                />
                            ) : (
                                <h2 className="text-2xl font-semibold">{userData?.username || "User"}</h2>
                            )}
                            <div className="profile-image bg-gray-200 w-24 h-24 rounded-full">
                                {userData?.profilePicUrl ? (
                                    <img src={userData.profilePicUrl} alt="Profile" className="rounded-full w-24 h-24" />
                                ) : (
                                    <p>No image</p>
                                )}
                                {editing && (
                                    <input type="file" onChange={handleFileChange} accept="image/*" />
                                )}
                            </div>
                            {editing ? (
                                <button
                                    className="bg-green-600 text-white py-2 px-4 rounded-lg"
                                    onClick={handleProfileUpdate}
                                >
                                    Save Changes
                                </button>
                            ) : (
                                <button
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                                    onClick={() => setEditing(true)}
                                >
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="mb-8">
                            <h3 className="text-xl mb-4 font-semibold">Phone Number</h3>
                            {editing ? (
                                <input
                                    type="text"
                                    value={userData?.phoneNumber || ""}
                                    onChange={(e) => setUserData(userData ? { ...userData, phoneNumber: e.target.value } : null)}
                                    className="border px-2 py-1"
                                />
                            ) : (
                                <p>{userData?.phoneNumber || "+Add Phone number"}</p>
                            )}
                        </div>

                        <div className="mb-8">
                            <h3 className="text-xl mb-4 font-semibold">Email</h3>
                            {editing ? (
                                <input
                                    type="email"
                                    value={userData?.email || ""}
                                    onChange={(e) => setUserData(userData ? { ...userData, email: e.target.value } : null)}
                                    className="border px-2 py-1"
                                />
                            ) : (
                                <p>{userData?.email || "+Add Email Address"}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Other tabs: posts, bookmarks, comments */}
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

            {/* Footer for Homepage and Feed navigation */}
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