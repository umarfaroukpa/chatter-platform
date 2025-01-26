import { useRouter } from "next/navigation";
import { useState } from "react";



// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Tags", "Get Started"];

    return (
        <div className="fixed top-1/2 left-4 transform -translate-y-1/2">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center mb-4">
                    <div
                        className={`w-4 h-4 rounded-full ${index <= currentStep ? "bg-blue-600" : "bg-gray-400"}`}
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">SELECT ALL THAT APPLIES TO YOU</h1>
            <p className="text-lg mb-8">This will help us personalize your experience to reach your goals.</p>

            <div className="grid grid-cols-2 gap-8 mb-12">
                <button
                    onClick={() => handleSelect("To Gain Depth")}
                    className={`py-3 px-6 rounded-lg font-semibold ${selections.includes("To Gain Depth") ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
                >
                    To Gain Depth
                </button>
                <button
                    onClick={() => handleSelect("To Find Something New")}
                    className={`py-3 px-6 rounded-lg font-semibold ${selections.includes("To Find Something New") ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
                >
                    To Find Something New
                </button>
                <button
                    onClick={() => handleSelect("To Explore Answers")}
                    className={`py-3 px-6 rounded-lg font-semibold ${selections.includes("To Explore Answers") ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
                >
                    To Explore Answers
                </button>
                <button
                    onClick={() => handleSelect("To Find Inspiration")}
                    className={`py-3 px-6 rounded-lg font-semibold ${selections.includes("To Find Inspiration") ? "bg-blue-600 text-white" : "bg-gray-200 text-black"}`}
                >
                    To Find Inspiration
                </button>
            </div>

            <div className="flex space-x-4">
                <button className="bg-gray-500 text-white py-2 px-6 rounded-lg" onClick={() => router.back()}>Back</button>
                <button className="bg-blue-600 text-white py-2 px-6 rounded-lg" onClick={handleNext}>
                    Next
                </button>
            </div>
            <ProgressBar currentStep={2} />
        </div>
    );
};

export default Personalize;
