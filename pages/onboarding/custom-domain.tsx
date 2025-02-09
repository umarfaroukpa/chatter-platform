"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Domain Details", "Custom Domain", "Tags"];

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

const CustomDomain = () => {
    const router = useRouter();
    const [customDomain, setCustomDomain] = useState<string>(""); // Stores custom domain input
    const [isValidDomain, setIsValidDomain] = useState<boolean | null>(null); // For validation status
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Validate domain format using a simple regex
    const validateDomainFormat = (domain: string): boolean => {
        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)*[a-zA-Z0-9][a-zA-Z0-9-_]{1,63}\.[a-zA-Z]{2,6}$/;
        return domainRegex.test(domain);
    };

    // Optional: Mock function to check domain availability (In reality, this would be a server call)
    const checkDomainAvailability = async (domain: string) => {
        // Example of a check (Replace with an actual API call)
        const takenDomains = ["mydomain.com", "example.com"];
        return !takenDomains.includes(domain.toLowerCase());
    };

    // Handle Domain Input Change
    const handleDomainChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setCustomDomain(value);

        if (!validateDomainFormat(value)) {
            setErrorMessage("Please enter a valid domain format (e.g., example.com).");
            setIsValidDomain(false);
        } else {
            // Optionally check for domain availability
            const available = await checkDomainAvailability(value);
            setIsValidDomain(available);
            setErrorMessage(available ? "" : "This domain is already registered.");
        }
    };

    // Handle Next Step
    const handleNext = () => {
        if (isValidDomain) {
            // Proceed if the custom domain is valid
            router.push("/onboarding/tags"); // Adjust the route as per your flow
        } else {
            alert("Please enter a valid and available custom domain before proceeding.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen -mt-24">
            <div>
                <h1 className="text-4xl font-bold">Map Your Custom Domain To Chatter</h1>
                <p className="text-lg text-[#787474] mb-8">Your domain should point to chatter for your blog to open</p>

                {/* Custom Domain Input */}
                <div className="mb-12 flex flex-col items-start">
                    <label htmlFor="customDomain" className="text-xl mb-2">Enter your custom domain:</label>
                    <input
                        type="text"
                        id="customDomain"
                        value={customDomain}
                        onChange={handleDomainChange}
                        placeholder="example.com"
                        className={`py-2 px-4 border-2 rounded-lg w-80 focus:outline-none focus:ring-4 focus:ring-blue-300 ${isValidDomain === false ? "border-red-500" : "border-gray-300"
                            }`}

                    />
                    <span className=" ">
                        {/* Optional: Display the full domain with chatter.dev */}
                        Host: @
                    </span>
                    <span className="bg-gray-200 py-2 px-4 rounded-lg text-lg text-gray-600">
                        Value: network.chatter.dev

                    </span>

                    {/* Feedback Message */}
                    {isValidDomain === false && <p className="text-red-500 mt-2">{errorMessage}</p>}
                    {isValidDomain === true && <p className="text-green-500 mt-2">This domain is available!</p>}
                    {isValidDomain === null && customDomain.length > 0 && <p className="text-gray-500 mt-2">Checking availability...</p>}
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
                        className="bg-[#07327a] text-white py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
                        onClick={handleNext}
                        disabled={!isValidDomain || customDomain.length === 0}
                    >
                        Next
                    </button>
                </div>

                {/* Progress Bar */}
                <ProgressBar currentStep={4} />
            </div>
        </div>
    );
};

export default CustomDomain;
