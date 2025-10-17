import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    console.log({ email, password, remember });
  }

  return (
    <div className="flex h-screen w-screen bg-white overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-12 md:px-20 animate-slideInLeft">
        <div className="w-full max-w-sm animate-fadeIn">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600 mb-8">
            Enter your Credentials to access your account
          </p>

          <div onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium text-sm mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-medium text-sm"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium underline"
                >
                  forgot password
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-lg py-2.5 px-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 text-gray-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center space-x-2 text-gray-700 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 accent-yellow-400 cursor-pointer"
              />
              <span>Remember for 30 days</span>
            </label>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#F9C80E] hover:bg-[#e0b50d] text-white font-bold py-3 rounded-lg transition duration-200 text-base"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm">Or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Social Login */}
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 border border-gray-300 rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex-1 border border-gray-300 rounded-lg py-2.5 flex items-center justify-center gap-2 hover:bg-gray-50 transition text-sm font-medium text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l-.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-600 font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Purple Background with Questify Branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-purple-400 via-purple-500 to-purple-700 relative overflow-hidden animate-slideInRight">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-30 animate-float">
          <div className="absolute top-10 left-10 w-24 h-24 bg-purple-300 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-purple-200 rounded-full"></div>
        </div>

        {/* Questify Logo Card */}
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 max-w-xs text-center animate-scaleIn">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <svg
                className="w-20 h-20 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeWidth="2" d="M12 6v6m3-3H9" />
              </svg>
              <svg
                className="absolute top-0 right-0 w-6 h-6 text-gray-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Questify</h2>
          <p className="text-gray-600 text-sm">YOUR GOALS. YOUR GAME</p>
        </div>
      </div>
    </div>
  );
}
