"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { Book, Pencil, PlusCircle, CheckCircle } from "lucide-react";
import axios from "axios";

const ProgressBar = ({ currentStep }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Tags"];
    return (
        <div className="hidden md:block fixed top-1/2 left-4 transform -translate-y-1/2 z-10">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center mb-4">
                    <div
                        className={`w-4 h-4 rounded-full ${index <= currentStep ? "bg-[#07327a]" : "bg-gray-400"}`}
                    ></div>
                    <span className="ml-2">{step}</span>
                </div>
            ))}
        </div>
    );
};

export default function Page() {
    const [successMessage, setSuccessMessage] = useState(null);
    const [logoutError, setLogoutError] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const [role, setRole] = useState(null);
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

    const handleNext = async () => {
        if (role) {
            try {
                const user = auth.currentUser;
                if (user) {
                    await axios.post("/api/profile", {
                        uid: user.uid,
                        profileData: { userType: role },
                    });
                    console.log(`User type set to ${role} for UID: ${user.uid}`);
                }

                if (role === "Reader") {
                    router.push("/onboarding/personalize");
                } else if (role === "Writer") {
                    router.push("/onboarding/writer-type");
                }
            } catch (error) {
                console.error("Error saving user type:", error);
                alert("Failed to save your role. Please try again.");
            }
        } else {
            alert("Please select a role before continuing");
        }
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen -mt-20 md:-mt-40">
            {logoutError && <p className="text-[#787474] mb-4 text-center">{logoutError}</p>}
            {successMessage && <p className="text-[#787474] mb-4 text-center">{successMessage}</p>}

            {isConfirming && (
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-11/12 max-w-md">
                        <h2 className="text-lg md:text-xl font-bold mb-4 text-center">Confirm Logout</h2>
                        <p className="mb-6 text-center">Are you sure you want to log out?</p>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
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

            <div className="flex flex-col items-center justify-center w-full max-w-4xl px-4 mt-16 md:mt-36">
                <h1 className="text-2xl md:text-4xl font-bold text-left md:text-left md:mr-6 mb-4">
                    What Brings You To Chatter
                </h1>
                <p className="text-base md:text-lg mb-6 md:mb-8 opacity-80 text-[#787474] text-left md:text-center">
                    We will personalize your needs according to your selection.
                </p>

                <div className="flex flex-col items-center justify-center md:flex-row space-y-6 md:space-y-0 md:space-x-8 mb-8 md:mb-12 w-full">
                    <div
                        onClick={() => setRole("Reader")}
                        className={`cursor-pointer rounded-lg p-4 w-full md:w-60 flex justify-between items-center bg-gray-100 transform transition-transform duration-300 ease-in-out hover:scale-105 ${role === "Reader" ? "border-[#07327a] shadow-lg rounded-2xl" : "border-gray-300 rounded-lg"
                            }`}
                        tabIndex={0}
                    >
                        <div className="flex items-center space-x-4">
                            <Pencil className="h-10 w-10 md:h-12 md:w-12 text-[#787474]" />
                            <div>
                                <h3 className="font-semibold text-lg md:text-xl">READER</h3>
                                <p className="text-gray-300 text-xs">I am here to read articles and be a part of the community.</p>
                            </div>
                        </div>
                        <div>
                            {role === "Reader" ? (
                                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                            ) : (
                                <PlusCircle className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                            )}
                        </div>
                    </div>

                    <div
                        onClick={() => setRole("Writer")}
                        className={`cursor-pointer rounded-lg p-4 w-full md:w-60 flex justify-between items-center bg-slate-100 transform transition-transform duration-300 ease-in-out hover:scale-105 ${role === "Writer" ? "border-[#07327a] shadow-lg rounded-2xl" : "border-gray-300 rounded-lg"
                            }`}
                        tabIndex={0}
                    >
                        <div className="flex items-center space-x-4">
                            <Book className="h-10 w-10 md:h-12 md:w-12 text-[#07327a]" />
                            <div>
                                <h3 className="font-semibold text-lg md:text-xl">WRITER</h3>
                                <p className="text-gray-300 text-xs">I am here to write blogs and share my knowledge.</p>
                            </div>
                        </div>
                        <div>
                            {role === "Writer" ? (
                                <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                            ) : (
                                <PlusCircle className="h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                            )}
                        </div>
                    </div>
                </div>

                <div className=" flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6 md:mt-10 w-full justify-center ">
                    <button
                        className="text-[#787474] border-2 py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 w-full md:w-auto"
                        onClick={() => router.push("/")}
                    >
                        Back
                    </button>
                    <button
                        className="bg-[#07327a] text-white py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 w-full md:w-auto"
                        onClick={handleNext}
                    >
                        Next
                    </button>
                </div>
            </div>

            <ProgressBar currentStep={1} />
        </div>
    );
}