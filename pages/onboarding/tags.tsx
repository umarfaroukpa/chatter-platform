import { useState } from 'react';
import { useRouter } from 'next/navigation';



const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const steps = ['SignUp/Login', 'About', 'Personalize', 'Tags', 'Get Started'];

    return (
        <div className="fixed top-1/2 left-4 transform -translate-y-1/2">
            {steps.map((step, index) => (
                <div key={index} className="flex items-center mb-4">
                    <div
                        className={`w-4 h-4 rounded-full ${index <= currentStep ? 'bg-blue-600' : 'bg-gray-400'}`}
                    ></div>
                    <span className="ml-2">{step}</span>
                </div>
            ))}
        </div>
    );
}


const TagsSelection = () => {
    const router = useRouter();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const tags = ['GitHub', 'Next.js', 'AWS', 'JavaScript', 'Flutter', 'General Programming'];

    const handleTagSelect = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
        );
    };

    const handleNext = () => {
        if (selectedTags.length > 0) {
            router.push('/onboarding/getstarted');
        } else {
            alert('Please select at least one tag!');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">CHOOSE YOUR TAGS</h1>
            <p className="text-lg mb-8">
                We use tags to personalize your feed and make it easier to discover relevant content.
            </p>

            <input
                type="text"
                placeholder="Search tags..."
                className="mb-6 px-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-4 mb-12">
                {tags
                    .filter((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((tag) => (
                        <button
                            key={tag}
                            onClick={() => handleTagSelect(tag)}
                            className={`py-2 px-4 rounded-lg font-semibold ${selectedTags.includes(tag) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
            </div>

            <div className="flex space-x-4">
                <button className="bg-gray-500 text-white py-2 px-6 rounded-lg" onClick={() => router.back()}>Back</button>
                <button className="bg-blue-600 text-white py-2 px-6 rounded-lg" onClick={handleNext}>Next</button>
            </div>

            <ProgressBar currentStep={3} />
        </div>
    );
};

export default TagsSelection;
