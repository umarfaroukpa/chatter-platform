"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaGithub, FaReact, FaJs } from 'react-icons/fa';
import { SiNextdotjs, SiNodedotjs } from 'react-icons/si';
import { CheckCircle, PlusCircle, Search } from 'lucide-react';

// Progress Bar Component
const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ["SignUp/Login", "About", "Personalize", "Tags"];

    return (
        <div className="fixed top-1/2 left-4 transform -translate-y-1/2 z-10 md:block hidden">
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

// Mobile Progress Indicator
const MobileProgress = ({ currentStep }: { currentStep: number }) => {
    const totalSteps = 4; // Total number of steps

    return (
        <div className="w-full flex justify-center md:hidden mb-6">
            <div className="flex space-x-2">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                        key={index}
                        className={`h-2 w-8 rounded-full ${index <= currentStep ? "bg-[#07327a]" : "bg-gray-300"
                            }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};

const TagsSelection = () => {
    const router = useRouter();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    const tags = [
        { name: 'GitHub', icon: FaGithub },
        { name: 'Next.js', icon: SiNextdotjs },
        { name: 'Nodejs', icon: SiNodedotjs },
        { name: 'JavaScript', icon: FaJs },
        { name: 'React', icon: FaReact },
        { name: 'General Programming', icon: FaReact },
    ];

    const handleTagSelect = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
        );
    };

    const handleNext = () => {
        if (selectedTags.length > 0) {
            router.push('/onboarding/feed');
        } else {
            alert('Please select at least one tag!');
        }
    };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center justify-start min-h-screen -mt-8 px-4 py-8 md:py-0">
            {/* Mobile Progress - only shown on small screens */}
            <MobileProgress currentStep={3} />

            <div className="w-full max-w-md md:mt-24">
                <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left">Choose Your Tags</h1>
                <p className="text-sm md:text-base opacity-90 text-[#787474] text-center md:text-left mb-6">
                    We use tags to personalize your feed and make it easier to discover relevant content.
                </p>

                {/* Search Bar */}
                <div className="flex items-center border-e-0 relative mb-8 ">
                    <input
                        type="text"
                        className="border border-gray-300  w-72  px-4 pl-10 text-sm  focus:outline-none focus:ring-2 focus:ring-[#07327a]"
                        placeholder="Search tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="cursor-pointer text-[#787474] bg-[#07327a] transform transition-transform duration-300 ease-in-out hover:scale-105 " size={22} />
                </div>


                {/* Tags Layout - Grid for mobile, columns for desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {filteredTags.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => handleTagSelect(name)}
                            className={`relative flex items-center p-3 md:p-4 rounded-2xl w-full h-16 md:h-24 bg-gray-100 transform transition-transform duration-300 ease-in-out hover:scale-105 
                            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                            ${selectedTags.includes(name) ? 'bg-[#07327a] border-[#07327a] shadow-lg ' : 'border-gray-300'}`}
                        >
                            <div className="flex items-center">
                                <Icon size={24} className={selectedTags.includes(name) ? '' : 'text-gray-700'} />
                            </div>
                            <div className="ml-3 md:ml-4 flex-grow">
                                <span className="text-sm md:text-base">{name}</span>
                            </div>
                            <div className="p-1 md:p-2">
                                {selectedTags.includes(name) ? (
                                    <CheckCircle size={18} className="text-green-500" />
                                ) : (
                                    <PlusCircle size={18} className="text-gray-400" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-center items-centerz md:justify-start space-x-4">
                    <button
                        className="text-[#787474] py-2 px-6 rounded-lg border-2 border-gray-300 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
                        onClick={() => router.back()}
                    >
                        Back
                    </button>
                    <button
                        className="bg-[#07327a] text-white py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
                        onClick={handleNext}
                    >
                        Get Started
                    </button>
                </div>

                <ProgressBar currentStep={3} />
            </div>
        </div>
    );
};

export default TagsSelection;