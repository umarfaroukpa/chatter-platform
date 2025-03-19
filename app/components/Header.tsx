"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../../lib/firebase";
import logo from "../../public/logo.png";
import { UserCircle, Menu, X, HelpCircle } from "lucide-react";

const Header = () => {
    const [user, setUser] = useState<User | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [logoutError, setLogoutError] = useState(null);
    const [showGuide, setShowGuide] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
                setSuccessMessage(null);
                setLogoutError(null);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setSuccessMessage(null);
        setLogoutError(null);
    }, [pathname]);

    if (!pathname) {
        return null;
    }

    const normalizedPathname = pathname.toLowerCase();
    const excludedPaths = ["/", "/auth/login", "/auth/register", "/dashboard/profilesetup", "/resetpassword", "/feed"];
    const isExcludedPage = excludedPaths.includes(normalizedPathname);

    // New unified logout flow
    const handleLogout = () => {
        // Show confirmation dialog
        setIsConfirming(true);
        // Close any open menus
        setShowDropdown(false);
        setIsMenuOpen(false);
    };

    const confirmLogout = async () => {
        try {
            await signOut(auth);
            setSuccessMessage("Logged out successfully!");
            setTimeout(() => {
                router.push("/");
                setSuccessMessage(null);
            }, 1500);
        } catch (error) {
            console.error("Error logging out:", error);
            setLogoutError("Error during logout. Please try again.");
        } finally {
            setIsConfirming(false);
        }
    };

    const cancelLogout = () => {
        setIsConfirming(false);
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
        setShowDropdown(false);
        setShowGuide(false);
    };

    const toggleGuide = () => {
        setShowGuide((prev) => !prev);
    };

    if (isExcludedPage) {
        return null;
    }

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md z-50 relative">
            {logoutError && <p className="text-red-500 mb-4 text-center">{logoutError}</p>}
            {successMessage && <p className="text-green-500 mb-4 text-center">{successMessage}</p>}
            <Link href="/" className="flex items-center">
                <Image src={logo} alt="Logo" width={50} height={50} />
                <span className="ml-2 text-2xl font-bold text-black">Chatter</span>
            </Link>

            {/* Logout Confirmation Modal */}
            {isConfirming && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-11/12 max-w-md">
                        <h2 className="text-lg md:text-xl font-bold mb-4 text-center">Confirm Logout</h2>
                        <p className="mb-6 text-center">Are you sure you want to log out?</p>
                        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
                            <button
                                className="text-[#787474] border border-[#787474] py-2 px-4 rounded hover:bg-[#07327a] hover:text-white transition"
                                onClick={confirmLogout}
                            >
                                Yes, Logout
                            </button>
                            <button
                                className="text-[#787474] border border-[#787474] py-2 px-4 rounded hover:bg-[#07327a] hover:text-white transition"
                                onClick={cancelLogout}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hamburger Icon for Mobile */}
            <button className="md:hidden text-[#07327a]" onClick={toggleMenu}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
                <div className="relative">
                    <button
                        onClick={toggleGuide}
                        className="flex items-center text-sm text-[#273c46] py-2 px-4 hover:text-[#07327a]"
                    >
                        Need Help ?
                    </button>

                    {showGuide && (
                        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 p-4 text-sm text-gray-800 max-h-[70vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-2">How to Use Chatter</h3>
                            <p className="mb-2">
                                Welcome to Chatter! This guide will help you navigate and make the most of the application.
                            </p>
                            <ul className="space-y-2 list-disc pl-4">
                                <li>
                                    <strong>Getting Started:</strong> If you are new, sign up or log in via the{" "}
                                    <Link href="/auth/login" className="text-[#07327a] underline">
                                        Login
                                    </Link>{" "}
                                    page. Complete your profile setup at{" "}
                                    <Link href="/dashboard/profilesetup" className="text-[#07327a] underline">
                                        Profile Setup
                                    </Link>
                                    .
                                </li>
                                <li>
                                    <strong>Navigation:</strong> Use the header to access key features. Click the logo to return to the homepage. The user icon (top-right) opens your account options.
                                </li>
                                <li>
                                    <strong>Writing:</strong> Start creating content from the dashboard. Personalize your experience by selecting your writer type during onboarding.
                                </li>
                                <li>
                                    <strong>Account Management:</strong> Update your profile or log out from the dropdown under the{" "}
                                    <UserCircle className="inline h-4 w-4" /> icon.
                                </li>
                                <li>
                                    <strong>Troubleshooting:</strong> Forgot your password? Use the{" "}
                                    <Link href="/resetpassword" className="text-[#07327a] underline">
                                        Reset Password
                                    </Link>{" "}
                                    link.
                                </li>
                                <li>
                                    <strong>Explore Feed:</strong> Check out other user content on the{" "}
                                    <Link href="/onboarding/feed" className="text-[#07327a] underline">
                                        Feed
                                    </Link>{" "}
                                    page (available after setup).
                                </li>
                            </ul>
                            <p className="mt-2">
                                Need more assistance? Contact support via the{" "}
                                <Link href="/resetpassword" className="text-[#07327a] underline">
                                    Help
                                </Link>{" "}
                                page.
                            </p>
                        </div>
                    )}
                </div>

                {user ? (
                    <div className="relative">
                        <button onClick={toggleDropdown} className="flex items-center space-x-2">
                            <UserCircle className="h-6 w-6 text-[#07327a]" />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg z-50">
                                <Link
                                    href="/dashboard/profilesetup"
                                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    Account
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/auth/login"
                        className="ml-4 bg-[#07327a] cursor-pointer text-white py-2 px-4 rounded-md font-semibold hover:scale-105 transition-transform duration-300"
                    >
                        Login
                    </Link>
                )}
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden z-50">
                    <div className="flex flex-col items-start p-4 space-y-4">
                        <div className="relative w-full">
                            <button
                                onClick={toggleGuide}
                                className="flex items-center text-sm text-[#273c46] py-2 hover:text-[#07327a]"
                            >
                                <HelpCircle className="h-5 w-5 mr-1" />
                                Need Help?
                            </button>

                            {showGuide && (
                                <div className="mt-2 w-full bg-white shadow-lg rounded-lg p-4 text-sm text-gray-800 max-h-[50vh] overflow-y-auto">
                                    <h3 className="text-lg font-semibold mb-2">How to Use Chatter</h3>
                                    <p className="mb-2">
                                        Welcome to Chatter! This guide will help you navigate and use the app.
                                    </p>
                                    <ul className="space-y-2 list-disc pl-4">
                                        <li>
                                            <strong>Getting Started:</strong> Sign up or log in at{" "}
                                            <Link href="/auth/login" className="text-[#07327a] underline">
                                                Login
                                            </Link>
                                            . Set up your profile at{" "}
                                            <Link href="/dashboard/profilesetup" className="text-[#07327a] underline">
                                                Profile Setup
                                            </Link>
                                            .
                                        </li>
                                        <li>
                                            <strong>Navigation:</strong> Tap the logo to go home. Use the menu to access options.
                                        </li>
                                        <li>
                                            <strong>Writing:</strong> Create content from the dashboard after setup.
                                        </li>
                                        <li>
                                            <strong>Account:</strong> Manage your profile or log out below.
                                        </li>
                                        <li>
                                            <strong>Help:</strong> Reset your password at{" "}
                                            <Link href="/resetpassword" className="text-[#07327a] underline">
                                                Reset Password
                                            </Link>
                                            .
                                        </li>
                                        <li>
                                            <strong>Feed:</strong> Explore content on the{" "}
                                            <Link href="/onboarding/feed" className="text-[#07327a] underline">
                                                Feed
                                            </Link>
                                            .
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        {user ? (
                            <>
                                <Link
                                    href="/dashboard/profilesetup"
                                    className="text-gray-800 hover:text-[#07327a]"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Account
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-800 hover:text-[#07327a]"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="bg-[#07327a] text-white py-2 px-4 rounded-md font-semibold hover:scale-105 transition-transform duration-300"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;