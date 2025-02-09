"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

// Progress Bar Component
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

const WriterType = () => {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string>("");

    const handleSelect = (type: string) => {
        setSelectedType(type);
    };

    const handleNext = () => {
        if (selectedType) {
            router.push("/onboarding/domain-details");
        } else {
            alert("Please select an option before continuing.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div>
                <h1 className="text-4xl font-bold">What kind of writer are you?</h1>
                <p className="text-lg text-[#787474] opacity-80 mb-8">
                    This will help us personalize your experience to reach your goal.
                </p>

                {/* Writer Type Selection */}
                <div className="space-y-6 mb-12">
                    <div className="flex space-x-8">
                        {/* New Blogger */}
                        <div
                            onClick={() => handleSelect("new")}
                            className={`cursor-pointer  rounded-lg p-6  w-60 flex items-center  bg-gray-100 transform transition-transform duration-300 ease-in-out hover:scale-105 
                                focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a] 
                                ${selectedType === "new" ? "border-[#07327a] shadow-lg rounded-2xl" : "border-gray-300 rounded-lg"}`}
                        >

                            <div>
                                <h4 className="flex font-semibold text-center">I am New Blogger</h4>
                            </div>
                            {selectedType === "new" && (
                                <CheckCircle className="ml-2 text-green-500" size={24} />
                            )}
                        </div>


                        <div
                            onClick={() => handleSelect("professional")}
                            className={`cursor-pointer  rounded-lg p-6 w-60 flex items-center space-x-4 [#07327a] bg-gray-100 transform transition-transform duration-300 ease-in-out hover:scale-105 
                                focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a] 
                                ${selectedType === "professional" ? "border-[#07327a] shadow-lg rounded-2xl" : "border-gray-300 rounded-lg"}`}
                        >

                            <div>
                                <h4 className=" font-semibold text-center text-base">I am Professional Writer</h4>
                            </div>
                            {selectedType === "professional" && (
                                <CheckCircle className=" text-green-500" size={24} />
                            )}
                        </div>
                    </div>


                    <div className="flex">
                        <div
                            onClick={() => handleSelect("casual")}
                            className={`cursor-pointer  rounded-lg p-6 w-60 flex items-center space-x-4 bg-gray-100 transform transition-transform duration-300 ease-in-out hover:scale-105 
                                focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a] 
                                ${selectedType === "casual" ? "border-[#07327a] shadow-lg rounded-2xl" : "border-gray-300 rounded-lg"}`}
                        >

                            <div>
                                <h4 className="font-semibold text-base text-center leading-tight">
                                    I Write Casually
                                </h4>
                            </div>
                            {selectedType === "casual" && (
                                <CheckCircle className="ml-2 text-green-500" size={24} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex space-x-4">
                    <button
                        className="text-[#787474] border-2 py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
                        onClick={() => router.push("/dashboard")}
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

                <ProgressBar currentStep={2} />
            </div>
        </div>
    );
};

export default WriterType;
