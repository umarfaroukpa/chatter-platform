import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle, PlusCircle, Globe, Link } from "lucide-react";

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

const DomainDetails = () => {
    const router = useRouter();
    const [selectedDomain, setSelectedDomain] = useState<"subdomain" | "custom" | null>(null);

    const handleNext = () => {
        if (selectedDomain === "subdomain") {
            router.push("/onboarding/subdomain");
        } else if (selectedDomain === "custom") {
            router.push("/onboarding/custom-domain");
        } else {
            alert("Please select a domain option.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <div className="text-left">
                <h1 className="text-4xl font-bold">Choose the type of domain you want</h1>
                <p className="text-lg text-[#787474] mb-12">Choose where you want your blog to be located.</p>

                {/* Domain Options */}
                <div className="flex space-x-4 mb-20 items-center justify-center">
                    {/* Subdomain Card */}
                    <div
                        onClick={() => setSelectedDomain("subdomain")}
                        className={`cursor-pointer flex justify-between items-center p-6 rounded-lg w-full max-w-lg bg-gray-100 transition-transform duration-300 ease-in-out hover:scale-105 
                            ${selectedDomain === "subdomain" ? "border-[#07327a] bg-[#f0f8ff]" : "border-gray-300"}`}
                    >
                        <div className="flex items-center space-x-4">
                            <Globe size={36} className="text-[#07327a]" />
                            <div className="flex flex-col text-left">
                                <h3 className="text-base font-semibold ">Chatter Subdomain</h3>
                                <p className="text-sm text-[#787474]">
                                    Choose Chatter's subdomain to publish <br /> your blogs.
                                </p>
                            </div>
                        </div>
                        <div className="ml-auto">
                            {selectedDomain === "subdomain" ? (
                                <CheckCircle className="text-green-500" size={24} />
                            ) : (
                                <PlusCircle className="text-gray-400" size={24} />
                            )}
                        </div>
                    </div>

                    {/* Custom Domain Card */}
                    <div
                        onClick={() => setSelectedDomain("custom")}
                        className={`cursor-pointer flex justify-between items-center p-6 rounded-lg w-full max-w-lg bg-gray-100 transition-transform duration-300 ease-in-out hover:scale-105 
                            ${selectedDomain === "custom" ? "border-[#07327a] bg-[#f0f8ff]" : "border-gray-300"}`}
                    >
                        <div className="flex items-center space-x-4">
                            <Link size={36} className="text-[#07327a]" />
                            <div className="flex flex-col text-left">
                                <h3 className="text-base font-semibold">Custom Domain</h3>
                                <p className=" text-sm text-[#787474]">
                                    If you have your own domain you can  map it here for free.
                                </p>
                            </div>
                        </div>
                        <div className="ml-auto">
                            {selectedDomain === "custom" ? (
                                <CheckCircle className="text-green-500" size={24} />
                            ) : (
                                <PlusCircle className="mr-2 text-gray-400" size={24} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex space-x-4">
                    <button
                        className="text-[#787474] py-2 px-6 rounded-lg border-2 border-gray-300 transform transition-transform duration-300 ease-in-out hover:scale-105"
                        onClick={() => router.push("/onboarding/writer-type")}
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

                <ProgressBar currentStep={3} />
            </div>
        </div>
    );
};

export default DomainDetails;
