import React from 'react';
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

const GetStarted = () => {
    const router = useRouter();

    const handleGetStarted = () => {
        router.push('/feed');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">You&apos;re all set!</h1>
            <p className="text-lg mb-8">You&apos;re ready to explore content curated just for you.</p>

            <button
                className="bg-blue-600 text-white py-3 px-6 rounded-lg"
                onClick={handleGetStarted}
            >
                Get Started
            </button>
            <ProgressBar currentStep={4} />
        </div>
    );
};

export default GetStarted;
