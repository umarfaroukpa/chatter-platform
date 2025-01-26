"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebase";

const ProfileSetup = () => {
    const router = useRouter();
    const [userType, setUserType] = useState<"reader" | "writer" | "">("");
    const [tags, setTags] = useState<string[]>([]);
    const [domain, setDomain] = useState<string>("");

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const profileData = {
            userType,
            tags,
            domain: userType === "writer" ? domain : undefined,
        };

        try {
            const response = await fetch("/api/user/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    uid: auth.currentUser?.uid,
                    profileData,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            // Redirect based on user type
            if (userType === "reader") {
                router.push("/dashboard/reader");
            } else if (userType === "writer") {
                router.push("/dashboard/writer");
            }
        } catch (error) {
            console.error("Error setting up profile:", error);
        }
    };

    // Handle adding and removing tags
    const addTag = (tag: string) => {
        if (!tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    // Available tags for selection
    const availableTags = ["JavaScript", "AI", "Fiction", "Technology", "Finance", "Blockchain", "Health"];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6 text-center">Set up your profile</h2>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div>
                        <label className="block text-lg font-medium mb-2">User Type</label>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setUserType("reader")}
                                className={`py-2 px-4 rounded-md ${userType === "reader" ? "bg-[07327a] text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                Reader
                            </button>
                            <button
                                type="button"
                                onClick={() => setUserType("writer")}
                                className={`py-2 px-4 rounded-md ${userType === "writer" ? "bg-[07327a] text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                Writer
                            </button>
                        </div>
                    </div>

                    {userType === "writer" && (
                        <div>
                            <label className="block text-lg font-medium mb-2">Domain/Field of Expertise</label>
                            <input
                                type="text"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                placeholder="e.g., Technology, Finance"
                                className="w-full py-2 px-4 border border-gray-300 rounded-md"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-lg font-medium mb-2">Tags (Choose your interests)</label>
                        <div className="flex flex-wrap gap-2">
                            {availableTags.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => addTag(tag)}
                                    className={`py-1 px-3 rounded-full text-sm ${tags.includes(tag)
                                        ? "bg-[07327a] text-white"
                                        : "bg-gray-200 text-gray-700"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {tags.length > 0 && (
                        <div>
                            <h3 className="text-lg font-medium mb-2">Selected Tags:</h3>
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="py-1 px-3 rounded-full bg-red-500 text-white text-sm"
                                    >
                                        {tag} &times;
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#07327a] text-white font-bold rounded-md hover:bg-[07327a]-700"
                    >
                        Get Started
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetup;
