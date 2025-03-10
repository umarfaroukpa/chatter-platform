"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function PostPage() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const postId = params.id;
    const router = useRouter();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/posts/${postId}`);
                if (response.data.success) {
                    setPost(response.data.data);
                } else {
                    setError(response.data.message || "Failed to load post");
                }
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(err.response?.data?.message || err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-[#787474] mb-4">Error</h1>
                <p className="text-[#787474]">{error}</p>
            </div>
        </div>;
    }

    if (!post) {
        return <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
                <p className="text-[#787474]">The post you're looking for doesn't exist or has been removed.</p>
            </div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <div className="flex items-center text-sm text-[#787474] mb-6">
                    <span>By {post.author?.name || "Unknown"}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags.map((tag) => (
                            <span key={tag} className="bg-gray-100 text-[#787474] px-2 py-1 rounded text-sm">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                    <button
                        className="bg-[#07327a] text-white px-6 py-2 rounded hover:bg-[#787474] transition"
                        onClick={() => router.push("/feed")}
                    >
                        Back to Feed
                    </button>
                </div>
            </div>
        </div>
    );
}