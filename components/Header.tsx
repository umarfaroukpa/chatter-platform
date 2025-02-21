"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import logo from "../public/logo.png";
import { UserCircle } from "lucide-react";

const Header = () => {
    const [user, setUser] = useState<User | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // If pathname is null (router not ready), return null to avoid issues
    if (!pathname) {
        return null;
    }

    // Convert the pathname to lowercase
    const normalizedPathname = pathname.toLowerCase();

    // Exclude these paths from showing the header
    const excludedPaths = ["/", "/auth/login", "/auth/register", "/dashboard/profilesetup", "/resetpassword"];
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
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    // If the current page is excluded, don't render the header
    if (isExcludedPage) {
        return null;
    }

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-md z-50 relative">
            <Link href="/" className="flex items-center">
                <Image src={logo} alt="Logo" width={50} height={50} />
                <span className="ml-2 text-2xl font-bold text-black">Chatter</span>
            </Link>

            <div className="flex items-center space-x-4">
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
        </header>
    );
};

export default Header;
