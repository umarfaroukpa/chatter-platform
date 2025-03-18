"use client";

import { useState, useEffect, Suspense } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { ClipLoader } from 'react-spinners';
import { auth } from "../../../lib/firebase";

const LoginPageContent = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const prefilledEmail = searchParams?.get("email");
        if (prefilledEmail) {
            setEmail(prefilledEmail);
        }
    }, [searchParams]);

    useEffect(() => {
        const savedEmail = localStorage.getItem("savedEmail");
        const savedPassword = localStorage.getItem("savedPassword");
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in:", userCredential.user.uid);
            if (rememberMe) {
                localStorage.setItem("savedEmail", email);
                localStorage.setItem("savedPassword", password);
            } else {
                localStorage.removeItem("savedEmail");
                localStorage.removeItem("savedPassword");
            }
            setSuccessMessage("Login successful!");
            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (error) {
            const firebaseError = error as import('firebase/auth').AuthError;
            console.error("Firebase login error:", firebaseError.code, firebaseError.message);
            switch (firebaseError.code) {
                case "auth/user-not-found":
                    setError("No user found with this email.");
                    break;
                case "auth/wrong-password":
                    setError("Incorrect password.");
                    break;
                case "auth/invalid-email":
                    setError("Invalid email format.");
                    break;
                case "auth/invalid-credential":
                    setError("Invalid credentials provided.");
                    break;
                case "auth/too-many-requests":
                    setError("Too many login attempts. Please try again later.");
                    break;
                default:
                    setError(`Login failed: ${firebaseError.message} (Code: ${firebaseError.code})`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordReset = async () => {
        setError(null);
        setSuccessMessage(null);
        if (!email) {
            setError("Please enter your email to reset the password.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage("Password reset email sent successfully.");
        } catch (error) {
            const firebaseError = error as import('firebase/auth').AuthError;
            console.error("Password reset error:", firebaseError.code, firebaseError.message);
            setError(`Failed to send password reset email: ${firebaseError.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-50">
            <div className="w-full max-w-md">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Login</h1>
                <form
                    onSubmit={handleLogin}
                    className="bg-white p-6 rounded-lg shadow-lg w-full"
                >
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    {successMessage && <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>}

                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#07327a] text-sm md:text-base"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#07327a] text-sm md:text-base"
                            required
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2">
                        <label className="flex items-center text-sm">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="mr-2"
                            />
                            Remember me
                        </label>
                        <button
                            type="button"
                            onClick={handlePasswordReset}
                            className="text-[#07327a] text-sm hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#07327a] text-white py-3 rounded-md hover:bg-opacity-90 transition-colors disabled:opacity-50 text-sm md:text-base"
                        disabled={isLoading}
                    >
                        {isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const LoginPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
            <LoginPageContent />
        </Suspense>
    );
};

export default LoginPage;