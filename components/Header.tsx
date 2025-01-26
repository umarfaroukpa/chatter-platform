"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.png";
import vectorImage from "../public/vector.png";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

const Header = () => {
    const [isExcludedPage, setIsExcludedPage] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        //  Idefine paths where the header and the image should not be shown
        const excludedPaths = ["/", "/auth/login", "/auth/register", "/resetpassword"];

        // Normalize the pathname to lowercase and split by "/"
        const normalizedPath = pathname?.toLowerCase().split("?")[0];

        // Check if the current path is in the excluded list
        setIsExcludedPage(excludedPaths.includes(normalizedPath || ""));
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await signOut(auth); // Log out the user
            router.push("/"); // Redirect to homepage after logging out
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    // Return null to not render the header on excluded pages
    if (isExcludedPage) {
        return null;
    }

    return (
        <>
            <header className="flex items-center justify-between p-4 bg-white shadow-md">
                <Link href="/" className="flex items-center">
                    <Image src={logo} alt="Logo" width={50} height={50} />
                    <span className="ml-2 text-2xl font-bold text-black">Chatter</span>
                </Link>

                {/* Show "Need help" and "Logout" on all pages except excluded pages */}
                <div className="flex items-center">
                    <p className="text-sm text-[#273c46] py-2 px-4">
                        Having troubles?{" "}
                        <Link href="/resetpassword" className="text-[#07327a] font-semibold">
                            Need help?
                        </Link>
                    </p>
                    <button
                        onClick={handleLogout}
                        className="ml-4 bg-[#07327a] text-white py-2 px-4 rounded-md font-semibold"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Fixed Image at the bottom-right of the page */}
            {/* Do not render this image on the homepage */}
            {!isExcludedPage && (
                <div className="fixed bottom-0 right-0 color-[#07327a]" >
                    <Image
                        src={vectorImage}
                        alt="Vector Image"
                        width={620}
                        height={150}
                    />
                </div>
            )}
        </>
    );
};

export default Header;
