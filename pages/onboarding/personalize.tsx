import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookOpen, Search, Lightbulb, Compass, Pencil, CheckCircle, PlusCircle } from "lucide-react";

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
            <h1 className="text-4xl font-bold">Select All That Applies To You</h1>
            <p className="text-lg opacity-80 text-[#787474] text-left mb-6">
                This will help us personalize your experience to reach your goals.
            </p>

            {/* Button Layout */}
            <div className="flex flex-col items-start justify-start space-y-8">
                {/* First row: To Gain Depth, To Find Something New */}
                <div className="flex space-x-8 items-start py-3">
                    <button
                        onClick={() => handleSelect("To Gain Depth")}
                        className={`relative flex items-center py-6 px-10 rounded-2xl w-96 h-36 bg-gray-100
                            ${selections.includes("To Gain Depth") ? "bg-[#07327a] border-[#07327a] shadow-lg " : "border-gray-300 text-black"}
                        `}
                    >
                        {/* Icon Wrapper with Border Radius */}
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Gain Depth") ? "border-white" : "border-gray-300"}`}>
                            <BookOpen size={40} className={`${selections.includes("To Gain Depth") ? "" : "text-[#787474]"}`} />
                        </div>
                        <div className="ml-6 flex-grow">
                            <span className="ml-2 text-lg">To Gain Depth</span>
                        </div>
                        <div className="p-2">
                            {selections.includes("To Gain Depth") ? (
                                <CheckCircle className="text-green-500" size={28} />
                            ) : (
                                <PlusCircle className="text-gray-400" size={28} />
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelect("To Find Something New")}
                        className={`relative flex items-center py-6 px-10 rounded-2xl w-96 h-36 bg-gray-100
                            ${selections.includes("To Find Something New") ? "bg-[#07327a] border-[#07327a] shadow-lg " : "border-gray-300 text-black"}
                        `}
                    >
                        {/* Icon Wrapper with Border Radius */}
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Find Something New") ? "border-white" : "border-gray-300"}`}>
                            <Search size={40} className={`${selections.includes("To Find Something New") ? "" : "text-[#787474]"}`} />
                        </div>
                        <div className="ml-6 flex-grow">
                            <span className="ml-2 text-lg">To Find Something New</span>
                        </div>
                        <div className="p-2">
                            {selections.includes("To Find Something New") ? (
                                <CheckCircle className="text-green-500" size={28} />
                            ) : (
                                <PlusCircle className="text-gray-400" size={28} />
                            )}
                        </div>
                    </button>
                </div>

                {/* Second row: To Explore Answers, To Find Inspiration */}
                <div className="flex space-x-8 py-3">
                    <button
                        onClick={() => handleSelect("To Explore Answers")}
                        className={`relative flex items-center py-6 px-10 rounded-2xl w-96 h-36 bg-gray-100
                            ${selections.includes("To Explore Answers") ? "bg-[#07327a] border-[#07327a] shadow-lg " : "border-gray-300 text-black"}
                        `}
                    >
                        {/* Icon Wrapper with Border Radius */}
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Explore Answers") ? "border-white" : "border-gray-300"}`}>
                            <Pencil size={40} className={`${selections.includes("To Explore Answers") ? "" : "text-[#787474]"}`} />
                        </div>
                        <div className="ml-6 flex-grow">
                            <span className="ml-2 text-lg">To Explore Answers</span>
                        </div>
                        <div className="p-2">
                            {selections.includes("To Explore Answers") ? (
                                <CheckCircle className="text-green-500" size={28} />
                            ) : (
                                <PlusCircle className="text-gray-400" size={28} />
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelect("To Find Inspiration")}
                        className={`relative flex items-center py-6 px-10 rounded-2xl w-96 h-36 bg-gray-100
                            ${selections.includes("To Find Inspiration") ? "bg-[#07327a] border-[#07327a] shadow-lg " : "border-gray-300 text-black"}
                        `}
                    >
                        {/* Icon Wrapper with Border Radius */}
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Find Inspiration") ? "border-white" : "border-gray-300"}`}>
                            <Lightbulb size={40} className={`${selections.includes("To Find Inspiration") ? "" : "text-[#787474]"}`} />
                        </div>
                        <div className="ml-6 flex-grow">
                            <span className="ml-2 text-lg">To Find Inspiration</span>
                        </div>
                        <div className="p-2">
                            {selections.includes("To Find Inspiration") ? (
                                <CheckCircle className="text-green-500" size={28} />
                            ) : (
                                <PlusCircle className="text-gray-400" size={28} />
                            )}
                        </div>
                    </button>
                </div>

                {/* Last row: To Explore Chatter (spans two columns) */}
                <div className="flex justify-center py-3 mb-12">
                    <button
                        onClick={() => handleSelect("To Explore Chatter")}
                        className={`relative flex items-center py-6 px-10 col-span-2 rounded-2xl w-96 h-36 bg-gray-100
                            ${selections.includes("To Explore Chatter") ? "bg-[#07327a] border-[#07327a] shadow-lg " : "border-gray-300 text-black"}
                        `}
                    >
                        {/* Icon Wrapper with Border Radius */}
                        <div className={`p-2 border-2 rounded-full ${selections.includes("To Explore Chatter") ? "border-white" : "border-gray-300"}`}>
                            <Compass size={40} className={`${selections.includes("To Explore Chatter") ? "text-white" : "text-[#787474]"}`} />
                        </div>
                        <div className="ml-6 flex-grow">
                            <span className="ml-2 text-lg">To Explore Chatter</span>
                        </div>
                        <div className="p-2">
                            {selections.includes("To Explore Chatter") ? (
                                <CheckCircle className="text-green-500" size={28} />
                            ) : (
                                <PlusCircle className="text-gray-400" size={28} />
                            )}
                        </div>
                    </button>
                </div>
                {/* Next Button */}
                <div className=" space-x-4">
                    <button
                        className="text-[#787474] py-2 px-6 rounded-lg border-2 border-gray-300 transform transition-transform duration-300 ease-in-out hover:scale-105"
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
            </div>



            <ProgressBar currentStep={2} />
        </div>
    );
};

export default Personalize;
