"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Tags", "Get Started"];

    return (
        <div className="fixed top-1/2 left-4 transform -translate-y-1/2">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center mb-4">
                    <div
                        className={`w-4 h-4 rounded-full ${index <= currentStep ? "bg-blue-600" : "bg-gray-400"}`}
                    ></div>
                    <span className="ml-2">{step}</span>
                </div>
            ))}
        </div>
    );
};

export default function Page() {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [logoutError, setLogoutError] = useState<string | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [role, setRole] = useState("");
    const router = useRouter();

    const handleLogout = async () => {
        setIsConfirming(true);
    };

    const confirmLogout = async () => {
        try {
            await signOut(auth);
            setSuccessMessage("Logged out successfully!");
            setTimeout(() => {
                router.push("/");
                // Redirect after a short delay
            }, 1500);
        } catch {
            setLogoutError("Error during logout. Please try again.");
        } finally {
            setIsConfirming(false);
        }
    };

    const handleNext = () => {
        if (role) {
            router.push("/onboarding/personalize");
        } else {
            alert("Please select a role before continuing");
        }
    };

    return (
        <div className="p-6">
            {/* Display error or success messages */}
            {logoutError && <p className="text-red-500 mb-4">{logoutError}</p>}
            {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

            {/* Confirmation prompt */}
            {isConfirming ? (
                <div className="bg-yellow-100 p-4 rounded-md">
                    <p className="text-yellow-700 mb-4">Are you sure you want to log out?</p>
                    <button
                        onClick={confirmLogout}
                        className="bg-red-500 text-white py-2 px-4 mr-2 rounded-md"
                    >
                        Yes, log out
                    </button>
                    <button
                        onClick={() => setIsConfirming(false)}
                        className="bg-gray-500 text-white py-2 px-4 rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <div className="relative">
                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="absolute -top-20 right-0 bg-gray-600 text-white py-2 px-4 rounded-md mt-4 -mr-4"
                    >
                        Log out
                    </button>
                </div>
            )}

            {/* Role Selection */}
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">WHAT BRINGS YOU TO CHATTER?</h1>
                <p className="text-lg mb-8 opacity-70 text-gray-250">We will personalize your needs according to your selection.</p>

                <div className="flex space-x-8 mb-12">
                    <button
                        onClick={() => setRole("Reader")}
                        className={`py-3 px-8 rounded-lg font-semibold ${role === "Reader" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
                    >
                        Reader
                    </button>
                    <button
                        onClick={() => setRole("Writer")}
                        className={`py-3 px-8 rounded-lg font-semibold ${role === "Writer" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
                    >
                        Writer
                    </button>
                </div>

                <div className="flex space-x-4">
                    <button
                        className="bg-gray-500 text-white py-2 px-6 rounded-lg"
                        onClick={() => router.push("/dashboard")}
                    >
                        Back
                    </button>
                    <button
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg"
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <ProgressBar currentStep={1} />
        </div>
    );
}
