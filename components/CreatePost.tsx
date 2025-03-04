"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import RichTextEditor from "../components/TextEditor";

const CreatePostPage = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tags, setTags] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                // Fetch user profile to verify if they are a writer
                try {
                    const response = await axios.post('/api/user', { uid: user.uid });
                    if (response.data.success) {
                        const userData = response.data.data;
                        if (userData.userType !== "Writer") {
                            alert("Only Writers can create posts");
                            router.push('/feed');
                        }
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    router.push('/feed');
                }
            } else {
                router.push('/auth/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            alert("Please fill in both title and content fields");
            return;
        }

        try {
            setLoading(true);
            const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

            const response = await axios.post("/api/posts", {
                title,
                content,
                tags: tagArray,
                uid: user.uid
            });

            if (response.data.success) {
                alert("Post created successfully!");
                router.push('/feed');
            } else {
                alert("Failed to create post: " + response.data.error);
            }
        } catch (error) {
            console.error("Error creating post", error);
            alert("Error creating post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Post Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a compelling title..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                        Post Content
                    </label>
                    <RichTextEditor
                        value={content}
                        onChange={setContent}
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                        Tags (comma separated)
                    </label>
                    <input
                        id="tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="technology, news, tutorial, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => router.push('/feed')}
                        className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {loading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePostPage;