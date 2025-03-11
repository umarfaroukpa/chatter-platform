import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Search, Lightbulb, Compass, Pencil, CheckCircle, PlusCircle } from "lucide-react";

// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Tags"];

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
        <div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-8">
            <h1 className="text-4xl md:text-4xl text-center font-bold mt-16  md:text-left">Select All That Applies To You</h1>
            <p className="text-lg md:text-lg opacity-80 text-[#787474] text-left mb-6 md:text-left">
                This will help us personalize your experience to reach your goals.
            </p>


            {/* Button Layout */}
            <div className="flex flex-col items-center md:items-start justify-start space-y-4 md:space-y-8 max-w-3xl">
                {/* First row: To Gain Depth, To Find Something New */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
                    <button
                        onClick={() => handleSelect("To Gain Depth")}
                        className={`relative flex items-center justify-between py-4 md:py-6 px-4 md:px-8 border-2 rounded-2xl w-full md:w-72 h-20 md:h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Gain Depth") ? "bg-[#07327a] text-white" : "border-gray-300 text-black"}`}
                    >
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Gain Depth") ? "border-white" : "border-gray-300"}`}>
                            <BookOpen
                                size={32}
                                className={`md:w-10 md:h-10 ${selections.includes("To Gain Depth") ? "text-white" : "text-[#787474]"}`}
                            />
                        </div>
                        <span className="text-base md:text-lg flex-grow text-center">To Gain Depth</span>
                        <div className="p-2">
                            {selections.includes("To Gain Depth") ? (
                                <CheckCircle size={24} className="md:w-7 md:h-7 text-green-500" />
                            ) : (
                                <PlusCircle size={24} className="md:w-7 md:h-7 text-gray-400" />
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelect("To Find Something New")}
                        className={`relative flex items-center justify-between py-4 md:py-6 px-4 md:px-8 border-2 rounded-2xl w-full md:w-72 h-20 md:h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Find Something New") ? "bg-[#07327a] text-white" : "border-gray-300 text-black"}`}
                    >
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Find Something New") ? "border-white" : "border-gray-300"}`}>
                            <Search
                                size={32}
                                className={`md:w-10 md:h-10 ${selections.includes("To Find Something New") ? "text-white" : "text-[#787474]"}`}
                            />
                        </div>
                        <span className="text-base md:text-lg flex-grow text-center">To Find Something New</span>
                        <div className="p-2">
                            {selections.includes("To Find Something New") ? (
                                <CheckCircle size={24} className="md:w-7 md:h-7 text-green-500" />
                            ) : (
                                <PlusCircle size={24} className="md:w-7 md:h-7 text-gray-400" />
                            )}
                        </div>
                    </button>
                </div>

                {/* Second row: To Explore Answers, To Find Inspiration */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
                    <button
                        onClick={() => handleSelect("To Explore Answers")}
                        className={`relative flex items-center justify-between py-4 md:py-6 px-4 md:px-8 border-2 rounded-2xl w-full md:w-72 h-20 md:h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Explore Answers") ? "bg-[#07327a] text-white" : "border-gray-300 text-black"}`}
                    >
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Explore Answers") ? "border-white" : "border-gray-300"}`}>
                            <Pencil
                                size={32}
                                className={`md:w-10 md:h-10 ${selections.includes("To Explore Answers") ? "text-white" : "text-[#787474]"}`}
                            />
                        </div>
                        <span className="text-base md:text-lg flex-grow text-center">To Explore Answers</span>
                        <div className="p-2">
                            {selections.includes("To Explore Answers") ? (
                                <CheckCircle size={24} className="md:w-7 md:h-7 text-green-500" />
                            ) : (
                                <PlusCircle size={24} className="md:w-7 md:h-7 text-gray-400" />
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelect("To Find Inspiration")}
                        className={`relative flex items-center justify-between py-4 md:py-6 px-4 md:px-8 border-2 rounded-2xl w-full md:w-72 h-20 md:h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Find Inspiration") ? "bg-[#07327a] text-white" : "border-gray-300 text-black"}`}
                    >
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Find Inspiration") ? "border-white" : "border-gray-300"}`}>
                            <Lightbulb
                                size={32}
                                className={`md:w-10 md:h-10 ${selections.includes("To Find Inspiration") ? "text-white" : "text-[#787474]"}`}
                            />
                        </div>
                        <span className="text-base md:text-lg flex-grow text-center">To Find Inspiration</span>
                        <div className="p-2">
                            {selections.includes("To Find Inspiration") ? (
                                <CheckCircle size={24} className="md:w-7 md:h-7 text-green-500" />
                            ) : (
                                <PlusCircle size={24} className="md:w-7 md:h-7 text-gray-400" />
                            )}
                        </div>
                    </button>
                </div>

                {/* Last row: To Explore Chatter */}
                <div className="flex justify-center w-full mb-8 md:mb-12">
                    <button
                        onClick={() => handleSelect("To Explore Chatter")}
                        className={`relative flex items-center justify-between py-4 md:py-6 px-4 md:px-8 border-2 rounded-2xl w-full md:w-72 h-20 md:h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Explore Chatter") ? "bg-[#07327a] text-white" : "border-gray-300 text-black"}`}
                    >
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Explore Chatter") ? "border-white" : "border-gray-300"}`}>
                            <Compass
                                size={32}
                                className={`md:w-10 md:h-10 ${selections.includes("To Explore Chatter") ? "text-white" : "text-[#787474]"}`}
                            />
                        </div>
                        <span className="text-base md:text-lg flex-grow text-center">To Explore Chatter</span>
                        <div className="p-2">
                            {selections.includes("To Explore Chatter") ? (
                                <CheckCircle size={24} className="md:w-7 md:h-7 text-green-500" />
                            ) : (
                                <PlusCircle size={24} className="md:w-7 md:h-7 text-gray-400" />
                            )}
                        </div>
                    </button>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto items-center justify-center">
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