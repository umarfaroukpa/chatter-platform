"use client"

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function ResetPassword() {
    const [email, setEmail] = useState('');

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent!');
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl mb-4">Reset Password</h2>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full mb-4 p-2 border"
            />
            <button onClick={handlePasswordReset} className="bg-blue-500 text-white py-2 px-4 rounded">
                Send Reset Email
            </button>
        </div>
    );
}
