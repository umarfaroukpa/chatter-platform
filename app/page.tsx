"use client"

import { useState } from "react";
import Image from "next/image";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider, GithubAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";
import Link from "next/link";
import logo from "../public/logo.png";
import balloon from "../public/balloon.png";

export default function Home() {
  const [loading, setLoading] = useState(false);


  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert('Logged in with Google!');
    } catch (error) {
      console.error("Google login error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
      alert('Logged in with Facebook!');
    } catch (error) {
      console.error("Facebook login error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTwitterLogin = async () => {
    setLoading(true);
    try {
      const provider = new TwitterAuthProvider();
      await signInWithPopup(auth, provider);
      alert('Logged in with Twitter!');
    } catch (error) {
      console.error("Twitter login error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setLoading(true);
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      alert('Logged in with Github!');
    } catch (error) {
      console.error("Github login error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left section - 60% width, white background */}
      <div className="w-3/5 bg-white flex flex-col p-8">
        {/* Logo and title */}
        <div className="flex items-center -mt-6">
          <Image src={logo} alt="Logo" width={50} height={50} />
          <span className="ml-2 text-2xl font-bold text-black">Chatter</span>
        </div>

        {/* Signup/Login Form */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Signup/Login</h3>

          <h6 className="text-base italic font-thin text-gray-250 opacity-70 mb-6">
            Join Our Dev Community with millions of active developers
          </h6>

          {/* Form */}
          <form className="w-3/4 mb-20">
            <div className="flex">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                className="flex-grow p-3 border rounded-l-md"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-r-md font-semibold"
              >
                Submit
              </button>
            </div>
          </form>

          {/* Or continue with */}
          <div className="flex mb-6">
            <hr className="" />
            <span className="items-center text-gray-500">Or Continue With</span>
            <hr className="flex-grow w-1/2 border-t-[1px] border-gray-600" />
          </div>

          {/* Social Media Icons */}
          <div className="flex mb-6">
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

          {/* Need Help */}
          <p className="mt-32">
            Having troubles?{" "}
            <Link href="/resetpassword" className="text-[#407BFF] font-semibold">
              Need help?
            </Link>

          </p>
        </div>
      </div>

      {/* Right section - 40% width, blue background */}
      <div className="w-2/5 bg-[#407bff] flex flex-col justify-center items-center p-16">
        <div className="">
          <h1 className="text-3xl font-bold text-white">
            Start a dev blog with just 1 click!!
          </h1>
          <p className="mt-4 text-lg text-white">
            Specially for tech writers and readers
          </p>
        </div>

        {/* Picture provision in the bottom half */}
        <div className="mt-auto">
          <Image src={balloon} alt="Balloon" width={200} height={300} />
        </div>
      </div>
    </div>
  );
}
