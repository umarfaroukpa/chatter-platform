"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import logo from "../public/logo.png";
import { UserCircle, Menu, X } from "lucide-react";

const Header = () => {
    const [user, setUser] = useState<User | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu
    const router = useRouter();
    const pathname = usePathname();

    // If pathname is null (router not ready), return null to avoid issues
    if (!pathname) {
        return null;
    }

    // Convert the pathname to lowercase
    const normalizedPathname = pathname.toLowerCase();

    // Exclude these paths from showing the header
    const excludedPaths = ["/", "/auth/login", "/auth/register", "/dashboard/profilesetup", "/resetpassword", "/feed"];
    const isExcludedPage = excludedPaths.includes(normalizedPathname);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/");
            setShowDropdown(false);
            // Close mobile menu on logout
            setIsMenuOpen(false);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
        // Close dropdown when toggling mobile menu
        setShowDropdown(false);
    };

    // If the current page is excluded, header will not render
    if (isExcludedPage) {
        return null;
    }

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md z-50 relative -mb-14">
            <Link href="/" className="flex items-center">
                <Image src={logo} alt="Logo" width={50} height={50} />
                <span className="ml-2 text-2xl font-bold text-black">Chatter</span>
            </Link>

            {/* Hamburger Icon for Mobile */}
            <button className="md:hidden text-[#07327a]" onClick={toggleMenu}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
                <p className="text-sm text-[#273c46] py-2 px-4">
                    Having troubles?{" "}
                    <Link href="/resetpassword" className="text-[#07327a] font-semibold">
                        Need help?
                    </Link>
                </p>

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

            {/* Mobile Menu (visible when hamburger is clicked) */}
            {isMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white shadow-md md:hidden z-50">
                    <div className="flex flex-col items-start p-4 space-y-4">
                        <p className="text-sm text-[#273c46]">
                            Having troubles?{" "}
                            <Link
                                href="/resetpassword"
                                className="text-[#07327a] font-semibold"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Need help?
                            </Link>
                        </p>

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