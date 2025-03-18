"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Domain Details", "Tags"];

    return (
        <div className="hidden md:block fixed top-1/2 left-4 transform -translate-y-1/2 md:top-1/2 md:left-4">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center mb-4">
                    <div
                        className={`w-4 h-4 rounded-full ${index <= currentStep ? "bg-[#07327a]" : "bg-[#787474]"}`}
                    ></div>
                    <span className="ml-2 hidden md:inline">{step}</span>
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
        } catch {
            setIsValidHost(false);
            setErrorMessage("An error occurred while checking the subdomain.");
        }
    };

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

    const handleNext = () => {
        if (isValidHost) {
            router.push("/onboarding/tags");
        } else {
            alert("Please enter a valid and available host before proceeding.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen -mt-20 px-4 md:px-0">
            <div className="w-full md:w-auto">
                <h1 className="text-3xl font-bold text-center md:text-left">Map Your Custom Domain To Chatter</h1>
                <p className="text-lg text-[#787474] mb-8 text-center md:text-left">Your domain should point to Chatter for your blog to open.</p>

                {/* Custom Domain Input */}
                <div className="mb-12 flex flex-col items-center md:items-start">
                    <label htmlFor="host" className="text-xl mb-2 text-center md:text-left">Enter your custom domain:</label>

                    {/* Flex container for Host and Value */}
                    <div className="flex flex-col gap-6 md:flex-row md:gap-6 md:space-x-8 w-full md:w-auto">
                        {/* Form 1: Host input */}
                        <div className="flex flex-col w-full md:w-64">
                            <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-2">
                                <input
                                    type="text"
                                    id="host"
                                    value={host}
                                    onChange={handleHostChange}
                                    placeholder="Host: @"
                                    className="flex-grow focus:outline-none focus:ring-0 text-sm md:text-base"
                                />
                            </div>
                            {isValidHost === false && <p className="text-red-500 mt-2 text-center md:text-left">{errorMessage}</p>}
                            {isValidHost === true && <p className="text-green-500 mt-2 text-center md:text-left">This host is available!</p>}
                        </div>

                        {/* Form 2: Value display */}
                        <div className="flex flex-col w-full md:w-64">
                            <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-2">
                                <span className="text-gray-500 text-sm md:text-base">Value: Chatter.Network</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col gap-4 md:flex-row md:space-x-4 mt-12 items-center">
                    <button
                        className="text-[#787474] border-2 py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 w-full md:w-auto"
                        onClick={() => router.push("/onboarding/domain-details")}
                    >
                        Back
                    </button>
                    <button
                        className="bg-[#07327a] text-white py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 w-full md:w-auto disabled:opacity-50"
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