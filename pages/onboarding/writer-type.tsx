import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle, PlusCircle } from "lucide-react";

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
        <div className="flex flex-col items-center justify-start md:justify-center min-h-screen mt-10 md:-mt-32 px-4">
            <div className="flex flex-col items-center w-full max-w-4xl mt-6 md:mt-16">
                <h1 className="text-3xl md:text-4xl font-bold text-left md:text-center mb-4">What kind of writer are you?</h1>
                <p className="text-base md:text-lg text-[#787474] opacity-80 mb-6 md:mb-8 text-left md:text-center">
                    This will help us personalize your experience to reach your goal.
                </p>

                {/* Writer Type Selection */}
                <div className="space-y-6 mb-8 md:mb-12">
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
                        {/* New Blogger */}
                        <div
                            onClick={() => handleSelect("new")}
                            className={`cursor-pointer flex items-center space-x-4 p-4 md:p-6 w-full md:w-60 bg-gray-100 rounded-2xl transform transition-transform duration-300 ease-in-out hover:scale-105 
                                focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a] 
                                ${selectedType === "new" ? "bg-[#07327a] border-[#07327a] shadow-lg " : "border-gray-300"}`}
                        >
                            <div className="flex-grow">
                                <h4 className="font-semibold text-sm md:text-base text-center">I am New Blogger</h4>
                            </div>
                            <div className="ml-4">
                                {selectedType === "new" ? (
                                    <CheckCircle className="text-green-500 h-5 w-5 md:h-6 md:w-6" />
                                ) : (
                                    <PlusCircle className="text-gray-400 h-5 w-5 md:h-6 md:w-6" />
                                )}
                            </div>
                        </div>

                        {/* Professional Writer */}
                        <div
                            onClick={() => handleSelect("professional")}
                            className={`cursor-pointer flex items-center space-x-4 p-6 md:w-72 w-72 bg-gray-100 rounded-2xl transform transition-transform duration-300 ease-in-out hover:scale-105 
                                focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a] 
                                ${selectedType === "professional" ? "bg-[#07327a] border-[#07327a] shadow-lg " : "border-gray-300"}`}
                        >
                            <div className="flex-grow">
                                <h4 className="font-semibold text-base text-center">I am Professional Writer</h4>
                            </div>
                            <div className="ml-6">
                                {selectedType === "professional" ? (
                                    <CheckCircle className="text-green-500 h-6 w-6" />
                                ) : (
                                    <PlusCircle className="text-gray-400 h-6 w-6" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Casual Writer */}
                    <div className="flex flex-col md:flex-row mt-4 md:mt-10">
                        <div
                            onClick={() => handleSelect("casual")}
                            className={`cursor-pointer flex items-center space-x-4 p-4 md:p-6 w-full md:w-60 bg-gray-100 rounded-2xl transform transition-transform duration-300 ease-in-out hover:scale-105 
                                focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a] 
                                ${selectedType === "casual" ? "bg-[#07327a] border-[#07327a] shadow-lg " : "border-gray-300"}`}
                        >
                            <div className="flex-grow">
                                <h4 className="font-semibold text-sm md:text-base text-center leading-tight">I Write Casually</h4>
                            </div>
                            <div className="ml-4">
                                {selectedType === "casual" ? (
                                    <CheckCircle className="text-green-500 h-5 w-5 md:h-6 md:w-6" />
                                ) : (
                                    <PlusCircle className="text-gray-400 h-5 w-5 md:h-6 md:w-6" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
                    <button
                        className="text-[#787474] border-2 py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105 w-full md:w-auto"
                        onClick={() => router.push("/dashboard")}
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

            <ProgressBar currentStep={2} />
        </div>
    );
};

export default WriterType;