"use client";

import { useState, useEffect, Suspense } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { auth } from "../../../lib/firebase";

const RegisterPageContent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const prefilledEmail = searchParams?.get("email");
        if (prefilledEmail) {
            setEmail(prefilledEmail);
        }
    }, [searchParams]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData = {
                uid: user.uid,
                username: "Your default username",
                userType: "standard",
                email: email,
                phoneNumber: "",
                profilePicUrl: "",
                tags: [],
                posts: [],
                bookmarks: [],
                comments: [],
            };

            const mongoResponse = await axios.post("/api/profile", {
                uid: user.uid,
                profileData: userData,
            });
            console.log("MongoDB save response:", mongoResponse.data);

            const firestoreResponse = await axios.post("/api/save-to-firestore", {
                uid: user.uid,
                userData: {
                    uid: user.uid,
                    email: email,
                    username: userData.username,
                    bookmarks: [],
                },
            });
            console.log("Firestore save response:", firestoreResponse.data);

            if (rememberMe) {
                localStorage.setItem("savedEmail", email);
                localStorage.setItem("savedPassword", password);
            } else {
                localStorage.removeItem("savedEmail");
                localStorage.removeItem("savedPassword");
            }

            setSuccessMessage("User registered successfully!");
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (error: Error | any) {
            console.error("Registration error:", error.code || error.response?.status, error.message || error);
            if (error.code === "auth/weak-password") {
                setError("Password should be at least 6 characters.");
            } else if (error.code === "auth/email-already-in-use") {
                setError("Email already in use.");
            } else {
                setError(`Error: ${error.message || "Unknown error occurred"}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <form
                    onSubmit={handleRegister}
                    className="bg-white p-6 rounded-lg shadow-md space-y-6"
                >
                    {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                    )}
                    {successMessage && (
                        <p className="text-green-500 text-sm text-center">{successMessage}</p>
                    )}

                    <div className="space-y-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07327a] focus:border-transparent"
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#07327a] focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-[#07327a] focus:ring-[#07327a] border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#07327a] text-white py-2 px-4 rounded-md hover:bg-[#05215c] focus:outline-none focus:ring-2 focus:ring-[#07327a] focus:ring-offset-2 disabled:opacity-50 transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ClipLoader size={20} color={"#fff"} className="inline-block" />
                        ) : (
                            "Register"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

const RegisterPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <RegisterPageContent />
        </Suspense>
    );
};

export default RegisterPage;