"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { ClipLoader } from 'react-spinners';

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess("Password reset email sent successfully.");
        } catch (error) {
            setError("Error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleReset} className="bg-gray-100 p-6 rounded-md shadow-md w-80">
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 p-2 border rounded w-full"
                    required
                />
                <button
                    type="submit"
                    className="bg-[07327a] text-white px-4 py-2 rounded w-full"
                    disabled={isLoading}
                >
                    {isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Reset Password"}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
