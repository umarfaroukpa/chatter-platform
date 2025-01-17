import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../lib/firebase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                // Handle login
                await signInWithEmailAndPassword(auth, email, password);
                alert('Logged in successfully');
            } else {
                // Handle signup
                await createUserWithEmailAndPassword(auth, email, password);
                alert('User registered successfully');
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

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
            <form onSubmit={handleFormSubmit} className="p-8 border rounded">
                <h2 className="text-2xl mb-4">{isLogin ? 'Login' : 'Sign Up'}</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full mb-4 p-2 border"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full mb-4 p-2 border"
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-4">
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-blue-600">
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
                </button>
                <button onClick={handlePasswordReset} className="w-full text-blue-600 mt-2">
                    Forgot Password?
                </button>
            </form>
        </div>
    );
}
