"use client";
import { useState } from "react";
import axios from "axios";

const CreatePostPage = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("/api/posts", { title, content, author: "User" });
            alert("Post created!");
        } catch (error) {
            console.error("Error creating post", error);
        }
    };

    return (
        <div className="container mx-auto">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <input
                    type="text"
                    placeholder="Post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                />
                <textarea
                    placeholder="Post content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mb-4 p-2 border rounded w-full h-40"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Create Post
                </button>
            </form>
        </div>
    );
};

export default CreatePostPage;
