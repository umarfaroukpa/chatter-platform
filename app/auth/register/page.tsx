"use client";

import { useState, useEffect, Suspense } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { auth } from "../../../lib/firebase";
import admin from 'firebase-admin';

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
            // Firebase Authentication registration
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user data to MongoDB via /api/profile
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

            // Save user data to Firestore via API call (create a new endpoint)
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
        } catch (error: any) {
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

    // Rest of your component remains unchanged
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleRegister} className="bg-gray-100 p-6 rounded-md shadow-md w-80">
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                    required
                />
                <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="mr-2"
                        />
                        Remember me
                    </label>
                </div>
                <button
                    type="submit"
                    className="bg-[#07327a] text-white px-4 py-2 rounded w-full"
                    disabled={isLoading}
                >
                    {isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Register"}
                </button>
            </form>
        </div>
    );
};

const RegisterPage = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <RegisterPageContent />
        </Suspense>
    );
};

export default RegisterPage;