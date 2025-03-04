"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Domain Details", "Tags"];

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
    const [host, setHost] = useState<string>("");
    const [isValidHost, setIsValidHost] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Real API call to check host availability
    const checkHostAvailability = async (host: string) => {
        try {
            const response = await fetch("/api/checkSubdomain", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ subdomain: host }),
            });

            const data = await response.json();

            if (data.available) {
                setIsValidHost(true);
                setErrorMessage("");
            } else {
                setIsValidHost(false);
                setErrorMessage(data.message);
            }
        } catch (error) {
            setIsValidHost(false);
            setErrorMessage("An error occurred while checking the subdomain.");
        }
    };

    // Handle Host Input Change
    const handleHostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        setHost(value);

        if (value.length === 0) {
            setErrorMessage("Host cannot be empty.");
            setIsValidHost(false);
        } else {
            checkHostAvailability(value);
        }
    };

    // Handle Next Step
    const handleNext = () => {
        if (isValidHost) {
            router.push("/onboarding/tags");
        } else {
            alert("Please enter a valid and available host before proceeding.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen -mt-32">
            <div>
                <h1 className="text-4xl font-bold">Map Your Custom Domain To Chatter</h1>
                <p className="text-lg text-[#787474] mb-8">Your domain should point to Chatter for your blog to open.</p>

                {/* Custom Domain Input */}
                <div className="mb-12 flex flex-col items-start">
                    <label htmlFor="host" className="text-xl mb-2">Enter your custom domain:</label>

                    {/* Flex container for Host and Value input side by side */}
                    <div className="flex space-x-8">
                        {/* Form 1: Host input with live "@" */}
                        <div className="flex flex-col">
                            <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-2 w-64">
                                <input
                                    type="text"
                                    id="host"
                                    value={host}
                                    onChange={handleHostChange}
                                    placeholder="Host: @"
                                    className="flex-grow focus:outline-none focus:ring-0"
                                />
                            </div>

                            {/* Feedback Message for Host */}
                            {isValidHost === false && <p className="text-red-500 mt-2">{errorMessage}</p>}
                            {isValidHost === true && <p className="text-green-500 mt-2">This host is available!</p>}
                        </div>

                        {/* Form 2: Value input with live "Chatter.Network" */}
                        <div className="flex flex-col">
                            <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-2 w-64">
                                <span className="text-gray-500">Value: Chatter.Network</span>
                            </div>
                        </div>
                    </div>
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
                        disabled={!isValidHost || host.length === 0}
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

export default CustomDomain;
