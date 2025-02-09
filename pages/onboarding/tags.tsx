import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaGithub, FaReact, FaJs } from 'react-icons/fa';
import { SiNextdotjs, SiNodedotjs } from 'react-icons/si';
import { CheckCircle, PlusCircle, Search } from 'lucide-react';

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
            router.push('/feed');
        } else {
            alert('Please select at least one tag!');
        }
    };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className=" flex flex-col  items-center justify-center  min-h-screen text-right">
            <div className=" flex flex-col w-[400px] ">
                <h1 className="text-3xl font-bold">Choose Your Tags</h1>
                <p className="text-base opacity-90 text-[#787474] text-left mb-6">
                    We use tags to personalize your feed and make it easier to discover relevant content.
                </p>

                {/* Search Bar */}
                <div className="flex items-center relative mb-8 w-60">
                    <input
                        type="text"
                        className="border border-gray-300 w-full py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#07327a]"
                        placeholder="Search tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="cursor-pointer text-[#787474] bg-[#07327a] transform transition-transform duration-300 ease-in-out hover:scale-105 " size={45} />
                </div>

                {/* Tags Layout */}
                <div className="flex mb-6 space-x-4">
                    {filteredTags.slice(0, 3).map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => handleTagSelect(name)}
                            className={`relative flex items-center border-2 rounded-2xl p-4 w-72 h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                        focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                        ${selectedTags.includes(name) ? 'bg-[#07327a] text-white border-[#07327a] shadow-lg' : 'text-[#07327a] border-gray-300'}`}
                        >
                            <div className="flex items-center">
                                <Icon size={35} className={`${selectedTags.includes(name) ? 'text-white' : 'text-[#07327a]'}`} />
                            </div>
                            <div className="ml-4 flex-grow">
                                <span>{name}</span>
                            </div>
                            <div className={`p-2 border-2 rounded-full ml-4 ${selectedTags.includes(name) ? 'border-white' : 'border-gray-300'}`}>
                                {selectedTags.includes(name) ? (
                                    <CheckCircle size={24} className="text-green-500" />
                                ) : (
                                    <PlusCircle size={24} className="text-gray-400" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 mb-6 space-x-4">
                    {filteredTags.slice(3).map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => handleTagSelect(name)}
                            className={`relative flex items-center py-6 px-8 border-2 rounded-2xl p-4 w-72 h-28 transform transition-transform duration-300 ease-in-out hover:scale-105 
                        focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-[#07327a]
                        ${selectedTags.includes(name) ? 'bg-[#07327a] text-white border-[#07327a] shadow-lg' : 'text-[#07327a] border-gray-300'}`}
                        >
                            <div className="flex items-center ">
                                <Icon size={35} className={`${selectedTags.includes(name) ? 'text-white' : 'text-[#07327a]'}`} />
                            </div>
                            <div className="ml-4 flex-grow">
                                <span>{name}</span>
                            </div>
                            <div className={`p-2 border-2 rounded-full ml-4 ${selectedTags.includes(name) ? 'border-white' : 'border-gray-300'}`}>
                                {selectedTags.includes(name) ? (
                                    <CheckCircle size={24} className="text-green-500" />
                                ) : (
                                    <PlusCircle size={24} className="text-gray-400" />
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex space-x-4 mt-6">
                    <button className="text-[#787474] py-2 px-6 rounded-lg border-2 border-gray-300 cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105 " onClick={() => router.back()}>
                        Back
                    </button>
                    <button className="bg-[#07327a] text-white py-2 px-6 rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105" onClick={handleNext}>
                        Get Started
                    </button>
                </div>

                <ProgressBar currentStep={3} />

            </div>
        </div >
    );
};

export default TagsSelection;
