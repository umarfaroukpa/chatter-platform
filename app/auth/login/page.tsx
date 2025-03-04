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

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User signed in:", userCredential.user.uid); // Debug: Log UID
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
        } catch (error: any) {
            console.error("Firebase login error:", error.code, error.message); // Detailed logging
            switch (error.code) {
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
                    setError(`Login failed: ${error.message} (Code: ${error.code})`);
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
        } catch (error: any) {
            console.error("Password reset error:", error.code, error.message);
            setError(`Failed to send password reset email: ${error.message}`);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form onSubmit={handleLogin} className="bg-gray-100 p-6 rounded-md shadow-md w-80">
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
                    <button type="button" onClick={handlePasswordReset} className="text-[#07327a]">
                        Forgot Password?
                    </button>
                </div>
                <button
                    type="submit"
                    className="bg-[#07327a] text-white px-4 py-2 rounded w-full"
                    disabled={isLoading}
                >
                    {isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Login"}
                </button>
            </form>
        </div>
    );
};

const LoginPage = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <LoginPageContent />
        </Suspense>
    );
};

export default LoginPage;