"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Domain Details", "Tags"];

    return (
        <div className="hidden md:block fixed top-1/2 left-4 transform -translate-y-1/2">
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
    const [isChecking, setIsChecking] = useState<boolean>(false);
    const [userId, setUserId] = useState<string>("");

    // Fetch the user ID when component mounts
    useEffect(() => {
        // Replace this with your actual method to get the user ID
        // For example, from localStorage, context, or API call
        const fetchUserId = async () => {
            // Example implementation - replace with your actual method
            try {
                // This is a placeholder - implement your actual user ID retrieval logic
                const userIdFromStorage = localStorage.getItem('userId');
                if (userIdFromStorage) {
                    setUserId(userIdFromStorage);
                }
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    // API call to check subdomain availability
    const checkSubdomainAvailability = async (subdomain: string) => {
        setIsChecking(true);
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
            setIsChecking(false);
            return data.available;
        } catch (error) {
            console.error("Error checking subdomain availability:", error);
            setIsChecking(false);
            return false;
        }
    };

    // API call to reserve subdomain
    const reserveSubdomain = async () => {
        try {
            const response = await fetch("/api/checkSubdomain", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    subdomain,
                    userId,
                    reserve: true
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to reserve subdomain.");
            }

            const data = await response.json();
            return data.available;
        } catch (error) {
            console.error("Error reserving subdomain:", error);
            return false;
        }
    };

    // Handle Subdomain Change
    const handleSubdomainChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim().toLowerCase();
        setSubdomain(value);

        // Reset states
        setErrorMessage("");
        setIsAvailable(null);

        if (value.length < 3) {
            setErrorMessage("Subdomain must be at least 3 characters long.");
        } else if (!/^[a-z0-9-]+$/.test(value)) {
            setErrorMessage("Subdomain can only contain lowercase letters, numbers, and hyphens.");
        } else {
            // Debounce the API call
            const timeoutId = setTimeout(async () => {
                const available = await checkSubdomainAvailability(value);
                setIsAvailable(available);
                setErrorMessage(available ? "" : "This subdomain is already taken.");
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    };

    // Handle Next Step
    const handleNext = async () => {
        if (isAvailable && subdomain.length >= 3) {
            // Reserve the subdomain
            const reserved = await reserveSubdomain();

            if (reserved) {
                // Store the selected subdomain for later use if needed
                sessionStorage.setItem('selectedSubdomain', subdomain);

                // Proceed to the next step
                router.push("/onboarding/tags");
            } else {
                setErrorMessage("Failed to reserve this subdomain. Please try another one.");
                setIsAvailable(false);
            }
        } else {
            alert("Please enter a valid and available subdomain before proceeding.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-start md:justify-center pt-14 min-h-screenmd:mt-16 px-4">
            <div className="">
                <h1 className="text-3xl md:text-4xl font-bold ">Choose Your Subdomain</h1>
                <p className="text-lg md:text-lg text-[#787474] mb-8  md:text-center">
                    This will be the link to your profile (e.g., yourname.chatter.dev).
                </p>

                {/* Subdomain Input */}
                <div className="mb-12 flex flex-col items-start w-full">
                    <label htmlFor="subdomain" className="text-lg md:text-xl mb-2 text-left">
                        Enter your desired subdomain:
                    </label>
                    <div className="flex flex-col md:flex-row items-start md:items-center w-full">
                        <input
                            type="text"
                            id="subdomain"
                            value={subdomain}
                            onChange={handleSubdomainChange}
                            placeholder="select a subdomain"
                            className={`py-2 px-4 border-2 rounded-lg md:rounded-l-lg w-full md:w-72 focus:outline-none focus:ring-4 focus:ring-blue-300 ${isAvailable === false ? "border-red-500" :
                                isAvailable === true ? "border-green-500" : "border-gray-300"
                                }`}
                        />
                        <span className="hidden md:block bg-gray-200 py-2 px-4 rounded-lg md:rounded-r-lg text-base md:text-lg text-gray-600 md:mt-0">
                            .chatter.dev
                        </span>
                    </div>
                    {/* Feedback Message */}
                    {errorMessage && <p className="text-red-500 mt-2 text-sm md:text-base">{errorMessage}</p>}
                    {isAvailable === true && <p className="text-green-500 mt-2 text-sm md:text-base">This subdomain is available!</p>}
                    {isChecking && <p className="text-gray-500 mt-2 text-sm md:text-base">Checking availability...</p>}
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col mt-8 items-center justify-center md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
                    <button
                        className="text-[#787474] border-2 py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 w-full md:w-auto"
                        onClick={() => router.push("/onboarding/domain-details")}
                    >
                        Back
                    </button>
                    <button
                        className={`cursor-pointer ${!isAvailable || subdomain.length < 3
                            ? "bg-gray-400"
                            : "bg-[#07327a] hover:scale-105"
                            } text-white py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out w-full md:w-auto`}
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