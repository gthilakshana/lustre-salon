import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShowToast } from "../components/lustreToaster";
import Header from "../components/header";
import Footer from "../components/footer";
import { HiMail, HiPhone } from "react-icons/hi";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email && !mobile) {
            return ShowToast("error", "Input Required", "Please enter either your email or mobile number.");
        }

        if (email && !/\S+@\S+\.\S+/.test(email)) {
            return ShowToast("error", "Invalid Email", "Please enter a valid email address.");
        }

        if (mobile) {
            const usaMobileRegex = /^1?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
            if (!usaMobileRegex.test(mobile)) {
                setLoading(false);
                return ShowToast(
                    "error",
                    "Invalid Mobile Number",
                    "Please enter a valid USA mobile number (10 digits, optionally starting with 1)."
                );
            }
        }


        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/forgot-password`,
                { email, mobile }
            );

            ShowToast("success", "Request Sent", response.data.message || "Check your email or SMS for further instructions.");

            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Request failed.";
            ShowToast("error", "Request Failed", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="min-h-screen flex flex-col bg-gray-50 pt-24 px-4">
                <main className="flex-1 flex items-center justify-center py-10">
                    <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">

                        <h1 className="text-xl sm:text-2xl font-bold text-center uppercase mb-6">
                            Forgot Password
                        </h1>

                        <form onSubmit={handleForgotPassword} className="space-y-3">

                            {/* Email */}
                            <div className="relative">
                                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="w-full pl-10 pr-4 py-3 text-base md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* OR Divider */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="text-gray-500 text-xs md:text-md">OR</span>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            {/* Mobile */}
                            <div className="relative flex items-center">
                                <HiPhone className="absolute left-3 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, "");
                                        setMobile(val);
                                    }}
                                    placeholder="Mobile number (USA)"
                                    className="w-full pl-10 px-4 py-3 text-base md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                    pattern="^1?[2-9]\d{2}[2-9]\d{2}\d{4}$"
                                    title="Enter a valid USA mobile number (10 digits, optionally starting with 1)"
                                />
                            </div>


                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 ${loading
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-black hover:bg-gray-800"
                                    } text-white font-medium text-base md:text-base rounded-md transition flex items-center justify-center`}
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2  border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>

                            {/* Login link */}
                            <p className="text-center text-xs md:text-md text-gray-600 border-t pt-5 mt-4">
                                Remembered your password?{" "}
                                <Link
                                    to="/login"
                                    className="text-black text-xs md:text-md font-medium hover:underline"
                                >
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </main>
            </div>

            <Footer />
        </>

    );
}
