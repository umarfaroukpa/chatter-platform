import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Search, Lightbulb, Compass, Pencil, CheckCircle, PlusCircle } from "lucide-react";

// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Tags"];

    return (
        <div className="hidden md:block fixed top-1/2 left-4 transform -translate-y-1/2 z-10">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center mb-4">
                    <div
                        className={`w-4 h-4 rounded-full ${index <= currentStep ? "bg-[#07327a]" : "bg-[#787474]"}`}
                    ></div>
                    <span className="ml-2 text-sm md:text-base">{step}</span>
                </div>
            ))}
        </div>
    );
};

const Personalize = () => {
    const router = useRouter();
    const [selections, setSelections] = useState<string[]>([]);

    const handleSelect = (option: string) => {
        setSelections((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
        );
    };

    const handleNext = () => {
        if (selections.length > 0) {
            router.push("/onboarding/tags");
        } else {
            alert("Please select at least one option!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen mt-16 md:mt-32 md:py-0 px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-left md:text-left mb-4">
                Select All That Applies To You
            </h1>
            <p className="text-base md:text-lg opacity-80 text-[#787474] text-left mb-6 md:mb-6">
                This will help us personalize your experience to reach your goals.
            </p>

            {/* Button Layout */}
            <div className="flex flex-col items-start justify-start space-y-6 md:space-y-8 w-full max-w-2xl">
                {/* First row on desktop, stacked on mobile */}
                <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0 w-full">
                    <button
                        onClick={() => handleSelect("To Gain Depth")}
                        className={`relative flex items-center py-4 md:py-6 px-6 md:px-8 border-2 rounded-2xl w-full md:w-72 h-24 md:h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Gain Depth") ? "bg-[#07327a] text-white" : "border-gray-300 text-black"}`}
                    >
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Gain Depth") ? "border-white" : "border-gray-300"}`}>
                            <BookOpen
                                className={`h-8 w-8 md:h-10 md:w-10 ${selections.includes("To Gain Depth") ? "text-white" : "text-[#787474]"}`}
                            />
                        </div>
                        <div className="ml-4 md:ml-6 flex-grow">
                            <span className="text-base md:text-lg">To Gain Depth</span>
                        </div>
                        <div className="p-2">
                            {selections.includes("To Gain Depth") ? (
                                <CheckCircle className="text-green-500 h-6 w-6 md:h-7 md:w-7" />
                            ) : (
                                <PlusCircle className="text-gray-400 h-6 w-6 md:h-7 md:w-7" />
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelect("To Find Something New")}
                        className={`relative flex items-center py-4 md:py-6 px-6 md:px-8 border-2 rounded-2xl w-full md:w-72 h-24 md:h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Find Something New") ? "bg-[#07327a] text-white" : "border-gray-300 text-black"}`}
                    >
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Find Something New") ? "border-white" : "border-gray-300"}`}>
                            <Search
                                className={`h-8 w-8 md:h-10 md:w-10 ${selections.includes("To Find Something New") ? "text-white" : "text-[#787474]"}`}
                            />
                        </div>
                        <div className="ml-4 md:ml-6 flex-grow">
                            <span className="text-base md:text-lg">To Find Something New</span>
                        </div>
                        <div className="p-2">
                            {selections.includes("To Find Something New") ? (
                                <CheckCircle className="text-green-500 h-6 w-6 md:h-7 md:w-7" />
                            ) : (
                                <PlusCircle className="text-gray-400 h-6 w-6 md:h-7 md:w-7" />
                            )}
                        </div>
                    </button>
                </div>

                {/* Second row on desktop, stacked on mobile */}
                <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0 w-full">
                    <button
                        onClick={() => handleSelect("To Explore Answers")}
                        className={`relative flex items-center py-4 md:py-6 px-6 md:px-8 border-2 rounded-2xl w-full md:w-72 h-24 md:h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Explore Answers") ? "bg-[#07327a] text-white" : "border-gray-300 text-black"}`}
                    >
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Explore Answers") ? "border-white" : "border-gray-300"}`}>
                            <Pencil
                                className={`h-8 w-8 md:h-10 md:w-10 ${selections.includes("To Explore Answers") ? "text-white" : "text-[#787474]"}`}
                            />
                        </div>
                        <div className="ml-4 md:ml-6 flex-grow">
                            <span className="text-base md:text-lg">To Explore Answers</span>
                        </div>
                        <div className="p-2">
                            {selections.includes("To Explore Answers") ? (
                                <CheckCircle className="text-green-500 h-6 w-6 md:h-7 md:w-7" />
                            ) : (
                                <PlusCircle className="text-gray-400 h-6 w-6 md:h-7 md:w-7" />
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelect("To Find Inspiration")}
                        className={`relative flex items-center py-4 md:py-6 px-6 md:px-8 border-2 rounded-2xl w-full md:w-72 h-24 md:h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Find Inspiration") ? "bg-[#07327a] text-white" : "border-gray-300 text-black"}`}
                    >
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Find Inspiration") ? "border-white" : "border-gray-300"}`}>
                            <Lightbulb
                                className={`h-8 w-8 md:h-10 md:w-10 ${selections.includes("To Find Inspiration") ? "text-white" : "text-[#787474]"}`}
                            />
                        </div>
                        <div className="ml-4 md:ml-6 flex-grow">
                            <span className="text-base md:text-lg">To Find Inspiration</span>
                        </div>
                        <div className="p-2">
                            {selections.includes("To Find Inspiration") ? (
                                <CheckCircle className="text-green-500 h-6 w-6 md:h-7 md:w-7" />
                            ) : (
                                <PlusCircle className="text-gray-400 h-6 w-6 md:h-7 md:w-7" />
                            )}
                        </div>
                    </button>
                </div>

                {/* Last row on desktop, stacked on mobile */}
                <div className="flex justify-center w-full">
                    <button
                        onClick={() => handleSelect("To Explore Chatter")}
                        className={`relative flex items-center py-4 md:py-6 px-6 md:px-8 border-2 rounded-2xl w-full md:w-72 h-24 md:h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Explore Chatter") ? "bg-[#07327a] text-white" : "border-gray-300 text-black"}`}
                    >
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Explore Chatter") ? "border-white" : "border-gray-300"}`}>
                            <Compass
                                className={`h-8 w-8 md:h-10 md:w-10 ${selections.includes("To Explore Chatter") ? "text-white" : "text-[#787474]"}`}
                            />
                        </div>
                        <div className="ml-4 md:ml-6 flex-grow">
                            <span className="text-base md:text-lg">To Explore Chatter</span>
                        </div>
                        <div className="p-2">
                            {selections.includes("To Explore Chatter") ? (
                                <CheckCircle className="text-green-500 h-6 w-6 md:h-7 md:w-7" />
                            ) : (
                                <PlusCircle className="text-gray-400 h-6 w-6 md:h-7 md:w-7" />
                            )}
                        </div>
                    </button>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-6 md:mt-0 w-full justify-center">
                    <button
                        className="text-[#787474] py-2 px-6 rounded-lg border-2 border-gray-300 transform transition-transform duration-300 ease-in-out hover:scale-105 w-full md:w-auto"
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

export default Personalize;