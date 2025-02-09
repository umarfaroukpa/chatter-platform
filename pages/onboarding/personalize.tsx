import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Search, Lightbulb, Compass, Pencil, CheckCircle } from "lucide-react";

// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Tags"];

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
        <div className="flex flex-col items-center justify-start min-h-screen mt-24 space-x-8">
            <h1 className="text-4xl font-bold ">Select All That Applies To You</h1>
            <p className="text-lg opacity-80 text-[#787474] text-left mb-6">This will help us personalize your experience to reach your goals.</p>

            {/* Button Layout */}
            <div className="flex flex-col items-start justify-start space-y-8 mb-12">
                {/* First row: To Gain Depth, To Find Something New */}
                <div className="flex space-x-8 items-start py-3">
                    <button
                        onClick={() => handleSelect("To Gain Depth")}
                        className={`relative flex items-center py-6 px-8 border-2 rounded-2xl p-4 w-72 h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Gain Depth") ? "bg-[#07327a] text-white border-[#07327a] shadow-lg" : " text-black border-gray-300"
                            }`}
                    >
                        {/* Icon Wrapper with Border Radius */}
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Gain Depth") ? "border-white" : "border-gray-300"}`}>
                            <BookOpen size={35} className={`${selections.includes("To Gain Depth") ? "text-white" : "text-[#787474]"}`} />
                        </div>
                        <div className="ml-6 flex-grow">
                            <span className="ml-2">To Gain Depth</span>
                        </div>
                        {selections.includes("To Gain Depth") && (
                            <CheckCircle className="ml-4 text-green-500" size={24} />
                        )}
                    </button>
                    <button
                        onClick={() => handleSelect("To Find Something New")}
                        className={`relative flex items-center py-6 px-8 border-2 rounded-2xl p-4 w-72 h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Find Something New") ? "bg-[#07327a] text-white border-[#07327a] shadow-lg" : " text-black border-gray-300"
                            }`}
                    >
                        {/* Icon Wrapper with Border Radius */}
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Find Something New") ? "border-white" : "border-gray-300"}`}>
                            <Search size={35} className={`${selections.includes("To Find Something New") ? "text-white" : "text-[#787474]"}`} />
                        </div>
                        <div className="ml-6 flex-grow">
                            <span className="ml-2">To Find Something New</span>
                        </div>
                        {selections.includes("To Find Something New") && (
                            <CheckCircle className="ml-4 text-green-500" size={24} />
                        )}
                    </button>
                </div>

                {/* Second row: To Explore Answers, To Find Inspiration */}
                <div className="flex space-x-8 py-3">
                    <button
                        onClick={() => handleSelect("To Explore Answers")}
                        className={`relative flex items-center py-6 px-8 border-2 rounded-2xl p-4 w-72 h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Explore Answers") ? "bg-[#07327a] text-white border-[#07327a] shadow-lg" : " text-black border-gray-300"
                            }`}
                    >
                        {/* Icon Wrapper with Border Radius */}
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Explore Answers") ? "border-white" : "border-gray-300"}`}>
                            <Pencil size={35} className={`${selections.includes("To Explore Answers") ? "text-white" : "text-[#787474]"}`} />
                        </div>
                        <div className="ml-6 flex-grow">
                            <span className="ml-2">To Explore Answers</span>
                        </div>
                        {selections.includes("To Explore Answers") && (
                            <CheckCircle className="ml-4 text-green-500" size={24} />
                        )}
                    </button>
                    <button
                        onClick={() => handleSelect("To Find Inspiration")}
                        className={`relative flex items-center py-6 px-8 border-2 rounded-2xl p-4 w-72 h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Find Inspiration") ? "bg-[#07327a] text-white border-[#07327a] shadow-lg" : " text-black border-gray-300"
                            }`}
                    >
                        {/* Icon Wrapper with Border Radius */}
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Find Inspiration") ? "border-white" : "border-gray-300"}`}>
                            <Lightbulb size={35} className={`${selections.includes("To Find Inspiration") ? "text-white" : "text-[#787474]"}`} />
                        </div>
                        <div className="ml-6 flex-grow">
                            <span className="ml-2">To Find Inspiration</span>
                        </div>
                        {selections.includes("To Find Inspiration") && (
                            <CheckCircle className="ml-4 text-green-500" size={24} />
                        )}
                    </button>
                </div>

                {/* Last row: To Explore Chatter (spans two columns) */}
                <div className="flex justify-center py-3">
                    <button
                        onClick={() => handleSelect("To Explore Chatter")}
                        className={`relative flex items-center py-6 px-8 col-span-2 border-2 rounded-2xl p-4 w-72 h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selections.includes("To Explore Chatter") ? "bg-[#07327a] text-white border-[#07327a] shadow-lg" : " text-black border-gray-300"
                            }`}
                    >
                        {/* Icon Wrapper with Border Radius */}
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Explore Chatter") ? "border-white" : "border-gray-300"}`}>
                            <Compass size={35} className={`${selections.includes("To Explore Chatter") ? "text-white" : "text-[#787474]"}`} />
                        </div>
                        <div className="ml-6 flex-grow">
                            <span className="ml-2">To Explore Chatter</span>
                        </div>
                        {selections.includes("To Explore Chatter") && (
                            <CheckCircle className="ml-4 text-green-500" size={24} />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex justify-start space-x-4">
                <button className="text-[#787474] py-2 px-6 rounded-lg border-2 border-gray-300" onClick={() => router.push("/dashboard")}>
                    Back
                </button>
                <button className="bg-[#07327a] text-white py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
                    onClick={handleNext}
                >
                    Next
                </button>
            </div>

            {/* Progress Bar */}
            <ProgressBar currentStep={2} />
        </div>
    );
};

export default Personalize;
