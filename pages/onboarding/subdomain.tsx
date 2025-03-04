"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Domain Details", "Tags",];

    return (
        <div className="fixed top-1/2 left-4 transform -translate-y-1/2">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center mb-4">
                    <div
                        className={`w-4 h-4 rounded-full ${index <= currentStep ? "bg-[#07327a]" : "bg-[#787474]"}`}
                    ></div>
                    <span className="ml-2">{step}</span>
                </div>
            ))}
        </div>
    );
};

const SubdomainSelection = () => {
    const router = useRouter();
    const [subdomain, setSubdomain] = useState<string>(""); // Holds the subdomain part
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // API call to check subdomain availability
    const checkSubdomainAvailability = async (subdomain: string) => {
        try {
            const response = await fetch("/api/checkSubdomain", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subdomain }),
            });

            if (!response.ok) {
                throw new Error("Failed to check subdomain availability.");
            }

            const data = await response.json();
            return data.available;
        } catch (error) {
            console.error("Error checking subdomain availability:", error);
            return false;
        }
    };

    // Handle Subdomain Change
    const handleSubdomainChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setSubdomain(value);

        if (value.length < 3) {
            setErrorMessage("Subdomain must be at least 3 characters long.");
            setIsAvailable(null);
        } else {
            const available = await checkSubdomainAvailability(value);
            setIsAvailable(available);
            setErrorMessage(available ? "" : "This subdomain is already taken.");
        }
    };

    // Handle Next Step
    const handleNext = () => {
        if (isAvailable && subdomain.length >= 3) {
            // Proceed to the next step if subdomain is valid and available
            router.push("/onboarding/tags");
        } else {
            alert("Please enter a valid and available subdomain before proceeding.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen -mt-32">
            <div className="">
                <h1 className="text-4xl font-bold">Choose Your Subdomain</h1>
                <p className="text-lg text-[#787474] mb-8">
                    This will be the link to your profile (e.g., yourname.chatter.dev).
                </p>

                {/* Subdomain Input */}
                <div className="mb-12 flex flex-col items-start">
                    <label htmlFor="subdomain" className="text-xl mb-2">
                        Enter your desired subdomain:
                    </label>
                    <div className="flex items-center">
                        <input
                            type="text"
                            id="subdomain"
                            value={subdomain}
                            onChange={handleSubdomainChange}
                            placeholder="select a subdomain"
                            className={`py-2 px-4 border-2 rounded-l-lg w-72 focus:outline-none focus:ring-4 focus:ring-blue-300 ${isAvailable === false ? "border-red-500" : "border-gray-300"
                                }`}
                        />
                        <span className="bg-gray-200 py-2 px-4 rounded-r-lg text-lg text-gray-600">
                            .chatter.dev
                        </span>
                    </div>
                    {/* Feedback Message */}
                    {isAvailable === false && <p className="text-red-500 mt-2">{errorMessage}</p>}
                    {isAvailable === true && <p className="text-green-500 mt-2">This subdomain is available!</p>}
                    {isAvailable === null && subdomain.length >= 3 && (
                        <p className="text-gray-500 mt-2">Checking availability...</p>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex space-x-4">
                    <button
                        className="text-[#787474] border-2 py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
                        onClick={() => router.push("/onboarding/domain-details")}
                    >
                        Back
                    </button>
                    <button
                        className="cursor-pointer bg-[#07327a] text-white py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
                        onClick={handleNext}
                        disabled={!isAvailable || subdomain.length < 3}
                    >
                        Next
                    </button>
                </div>

                {/* Progress Bar */}
                <ProgressBar currentStep={3} />
            </div>
        </div>
    );
};

export default SubdomainSelection;
