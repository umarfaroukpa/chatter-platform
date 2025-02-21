"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { Book, Pencil, PlusCircle, CheckCircle } from "lucide-react";

// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Tags"];

    return (
        <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-10">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center mb-4">
                    <div
                        className={`w-4 h-4 rounded-full ${index <= currentStep ? "bg-[#07327a]" : "bg-gray-400"
                            }`}
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
    const [role, setRole] = useState<string | null>(null);
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
            }, 1500);
        } catch {
            setLogoutError("Error during logout. Please try again.");
        } finally {
            setIsConfirming(false);
        }
    };

    const handleNext = () => {
        if (role) {
            if (role === "Reader") {
                router.push("/onboarding/personalize");
            } else if (role === "Writer") {
                router.push("/onboarding/writer-type");
            } else {
                alert("Please select a role before continuing");
            }
        };
    };

    return (
        <div className="relative flex justify-center items-center h-screen -mt-24">
            {/* Display error or success messages */}
            {logoutError && <p className="text-[#787474] mb-4">{logoutError}</p>}
            {successMessage && <p className="text-[#787474] mb-4">{successMessage}</p>}

            {/* Logout Confirmation */}
            {isConfirming && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
                        <p className="mb-6">Are you sure you want to log out?</p>
                        <div className="flex space-x-4">
                            <button
                                className="bg-red-600 text-white py-2 px-6 rounded-lg"
                                onClick={confirmLogout}
                            >
                                Yes, Logout
                            </button>
                            <button
                                className="bg-gray-300 text-black py-2 px-6 rounded-lg"
                                onClick={() => setIsConfirming(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex align-middle justify-center w-full max-w-2xl mt-36">
                <div className="flex flex-col items-start justify-start ">
                    <h1 className="text-4xl font-bold text-left">
                        What Brings You To Chatter
                    </h1>
                    <p className="text-lg mb-8 opacity-80 text-[#787474] text-left">
                        We will personalize your needs according to your selection.
                    </p>

                    {/* Role Selection Cards */}
                    <div className="flex space-x-8 mb-12">
                        {/* Reader Card */}
                        <div
                            onClick={() => setRole("Reader")}
                            className={`cursor-pointer rounded-lg p-4 w-60 flex justify-between items-center bg-gray-100 transform transition-transform duration-300 ease-in-out hover:scale-105 
                                ${role === "Reader"
                                    ? "border-[#07327a] shadow-lg rounded-2xl"
                                    : "border-gray-300 rounded-lg"
                                }`}
                            tabIndex={0}
                        >
                            <div className="flex items-center space-x-4">
                                <Pencil size={50} className="text-[#787474]" />
                                <div>
                                    <h3 className="font-semibold text-xl">READER</h3>
                                    <p className="text-gray-300 text-xs">
                                        I am here to read articles and be a part of the community.
                                    </p>
                                </div>
                            </div>
                            <div>
                                {role === "Reader" ? (
                                    <CheckCircle className="text-green-500" size={24} />
                                ) : (
                                    <PlusCircle className="text-gray-400" size={24} />
                                )}
                            </div>
                        </div>

                        {/* Writer Card */}
                        <div
                            onClick={() => setRole("Writer")}
                            className={`cursor-pointer rounded-lg p-4 w-60 flex justify-between items-center bg-slate-100 transform transition-transform duration-300 ease-in-out hover:scale-105 
                                ${role === "Writer"
                                    ? "border-[#07327a] shadow-lg rounded-2xl"
                                    : "border-gray-300 rounded-lg"
                                }`}
                            tabIndex={0}
                        >
                            <div className="flex items-center space-x-4">
                                <Book size={50} className="text-[#07327a]" />
                                <div>
                                    <h3 className="font-semibold text-xl">WRITER</h3>
                                    <p className="text-gray-300 text-xs">
                                        I am here to write blogs and share my knowledge.
                                    </p>
                                </div>
                            </div>
                            <div>
                                {role === "Writer" ? (
                                    <CheckCircle className="text-green-500" size={24} />
                                ) : (
                                    <PlusCircle className="text-gray-400" size={24} />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Back and Next Buttons */}
                    <div className="flex space-x-4 mt-10">
                        <button
                            className="text-[#787474] border-2 py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
                            onClick={() => router.push("/")}
                        >
                            Back
                        </button>
                        <button
                            className="bg-[#07327a] text-white py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <ProgressBar currentStep={1} />
        </div>
    );
}
