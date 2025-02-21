"use client";

import { useState, useEffect, Suspense } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

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

            // Save user data to Firestore
            const userData = {
                username: "Your default username", 
                userType: "standard", 
                tags: [], 
                posts: [],
                bookmarks: [],
                comments: [],
            };

            await setDoc(doc(db, "users", user.uid), userData);

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
            if (error.code === "auth/weak-password") {
                setError("Password should be at least 6 characters.");
            } else {
                setError("Error: " + error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

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
