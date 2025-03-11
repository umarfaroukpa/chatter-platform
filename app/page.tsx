"use client";

import { useState, useEffect } from "react";
import { fetchSignInMethodsForEmail, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import balloon from "../public/balloon.png";
import logo from "../public/logo.png";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle redirection after user confirms
  const handleRedirect = () => {
    if (isLoggedIn && user) {
      router.push("/dashboard");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const cleanedEmail = email.trim().toLowerCase();
      const signInMethods = await fetchSignInMethodsForEmail(auth, cleanedEmail);

      if (signInMethods && signInMethods.length > 0) {
        router.push(`/auth/login?email=${cleanedEmail}`);
      } else {
        router.push(`/auth/register?email=${cleanedEmail}`);
      }
    } catch (error: any) {
      console.error("Error checking email:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Logged in with Google!");
    } catch (error: any) {
      console.error("Google login error:", error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Logged in with Facebook!");
    } catch (error: any) {
      console.error("Facebook login error:", error.message);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      const provider = new TwitterAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Logged in with Twitter!");
    } catch (error: any) {
      console.error("Twitter login error:", error.message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Logged in with Github!");
    } catch (error: any) {
      console.error("Github login error:", error.message);
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row ">
      {isLoggedIn && user && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-md shadow-md text-center w-11/12 sm:w-96">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Welcome back, {user?.displayName || "User"}!</h2>
            <p className="mb-4 text-sm sm:text-base">You are already logged in. Do you want to go to your dashboard?</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
              <button
                onClick={handleRedirect}
                className="bg-[#07327a] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#787474] transition"
              >
                Yes, take me there
              </button>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-600 transition"
              >
                No, stay here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left section - 60% width on large screens, full width on mobile */}
      <div className="w-full md:w-3/5 bg-white flex flex-col p-4 sm:p-6 md:p-8 h-full">
        <Link href="/" className="flex items-center -mt-2 md:-mt-4">
          <Image src={logo} alt="Logo" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
          <span className="ml-2 text-xl md:text-2xl font-bold text-black">Chatter</span>
        </Link>

        {/* Signup/Login Form */}
        <div className="mt-12 md:mt-32 flex-grow">
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">Signup/Login</h3>

          <h6 className="text-sm md:text-base italic font-light text-gray-500 opacity-70 mb-4 md:mb-6">
            Join Our Dev Community with millions of active developers
          </h6>

          <form className="w-full md:w-3/4 mb-8 md:mb-20" onSubmit={handleEmailSubmit}>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                className="flex-grow p-2 sm:p-3 border rounded-t-md sm:rounded-l-md sm:rounded-t-none focus:outline-none focus:ring-2 focus:ring-[#07327a]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-[#07327a] text-white py-2 px-4 rounded-b-md sm:rounded-r-md sm:rounded-b-none font-semibold hover:bg-[#787474] transition"
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Submit"}
              </button>
            </div>
          </form>

          <div className="flex items-center mb-4 md:mb-6">
            <span className="px-2 sm:px-4 text-gray-500 text-sm md:text-base">Or Continue With</span>
            <hr className="w-full sm:w-1/4 border-t-[1px] md:border-t-[2px] border-gray-600" />
          </div>

          <div className="flex gap-4 md:gap-6 mb-6 md:mb-6">
            <div className="cursor-pointer" onClick={handleGoogleLogin}>
              <Image src="/rb_9777-removebg-preview.png" alt="Google" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
            </div>
            <div className="cursor-pointer" onClick={handleFacebookLogin}>
              <Image src="/150897972_10464408-removebg-preview.png" alt="Facebook" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
            </div>
            <div className="cursor-pointer" onClick={handleTwitterLogin}>
              <Image src="/rb_45422-removebg-preview.png" alt="Twitter" width={40} height={40} className="md:w-[50px] md:h-[50px]" />
            </div>
            <div className="cursor-pointer" onClick={handleGithubLogin}>
              <Image src="/github-64-removebg-preview.png" alt="Github" width={30} height={30} className="md:w-[35px] md:h-[35px]" />
            </div>
          </div>

          <p className="mt-6 md:mt-11 text-[#273c46] text-sm md:text-base">
            Having troubles?{" "}
            <Link href="/resetpassword" className="text-[#07327a] font-semibold hover:underline">
              Need help?
            </Link>
          </p>
        </div>
      </div>

      {/* Right section - 40% width on large screens, full width on mobile */}
      <div className="w-full md:w-2/5 bg-[#07327a] flex flex-col justify-center items-center p-16 md:p-16 h-auto md:h-full ">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Start a dev blog with just 1 click!!</h1>
          <p className="mt-2 md:mt-4 text-base md:text-lg text-white">Specially for tech writers and readers</p>
        </div>

        <div className="mt-6 md:mt-auto">
          <Image src={balloon} alt="Balloon" width={150} height={120} className="md:w-[200px] md:h-[370px]" />
        </div>
      </div>
    </div>
  );
}