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

  const handleEmailSubmit = async (e) => {
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
    } catch (error) {
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
    } catch (error) {
      console.error("Google login error:", error.message);
    } finally {
      ;
    }
  };

  const handleFacebookLogin = async () => {

    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Logged in with Facebook!");
    } catch (error) {
      console.error("Facebook login error:", error.message);
    } finally {

    }
  };

  const handleTwitterLogin = async () => {

    try {
      const provider = new TwitterAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Logged in with Twitter!");
    } catch (error) {
      console.error("Twitter login error:", error.message);
    } finally {

    }
  };

  const handleGithubLogin = async () => {

    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Logged in with Github!");
    } catch (error) {
      console.error("Github login error:", error.message);
    } finally {

    }
  };

  return (
    <div className="h-screen flex">
      {isLoggedIn && user && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.displayName || "User"}!</h2>
            <p className="mb-4">You are already logged in. Do you want to go to your dashboard?</p>
            <button
              onClick={handleRedirect}
              className="bg-[#07327a] text-white py-2 px-4 rounded-md font-semibold mr-2"
            >
              Yes, take me there
            </button>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="bg-gray-500 text-white py-2 px-4 rounded-md font-semibold"
            >
              No, stay here
            </button>
          </div>
        </div>
      )}

      {/* Left section - 60% width, white background */}
      <div className="w-3/5 bg-white flex flex-col p-8 h-full">
        <Link href="/" className="flex items-center -mt-4">
          <Image src={logo} alt="Logo" width={50} height={50} />
          <span className="ml-2 text-2xl font-bold text-black">Chatter</span>
        </Link>

        {/* Signup/Login Form */}
        <div className="mt-32 flex-grow">
          <h3 className="text-2xl font-bold mb-4">Signup/Login</h3>

          <h6 className="text-base italic font-thin text-gray-250 opacity-70 mb-6">
            Join Our Dev Community with millions of active developers
          </h6>

          <form className="w-3/4 mb-20" onSubmit={handleEmailSubmit}>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                className="flex-grow p-3 border rounded-l-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-[#07327a] text-white py-2 px-4 rounded-r-md font-semibold"
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader size={20} color={"#fff"} /> : "Submit"}
              </button>
            </div>
          </form>

          <div className="flex items-center mb-6">
            <span className="px-4 text-gray-500">Or Continue With</span>
            <hr className="w-1/4 border-t-[2px] border-gray-600" />
          </div>

          <div className="flex items-center mb-6">
            <div className="cursor-pointer" onClick={handleGoogleLogin}>
              <Image
                src="/rb_9777-removebg-preview.png"
                alt="Google"
                width={50}
                height={50}
              />
            </div>
            <div className="cursor-pointer" onClick={handleFacebookLogin}>
              <Image
                src="/150897972_10464408-removebg-preview.png"
                alt="Facebook"
                width={50}
                height={50}
              />
            </div>
            <div className="cursor-pointer" onClick={handleTwitterLogin}>
              <Image
                src="/rb_45422-removebg-preview.png"
                alt="Twitter"
                width={50}
                height={50}
              />
            </div>
            <div className="cursor-pointer" onClick={handleGithubLogin}>
              <Image
                src="/github-64-removebg-preview.png"
                alt="Github"
                width={35}
                height={35}
              />
            </div>
          </div>

          <p className="mt-11 text-[#273c46]">
            Having troubles?{" "}
            <Link href="/resetpassword" className="text-[#07327a] font-semibold">
              Need help?
            </Link>
          </p>
        </div>
      </div>

      {/* Right section - 40% width, blue background */}
      <div className="w-2/5 bg-[#07327a] flex flex-col justify-center items-center p-16 h-full">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Start a dev blog with just 1 click!!
          </h1>
          <p className="mt-4 text-lg text-white">
            Specially for tech writers and readers
          </p>
        </div>

        <div className="mt-auto">
          <Image src={balloon} alt="Balloon" width={200} height={300} />
        </div>
      </div>
    </div>
  );
}
