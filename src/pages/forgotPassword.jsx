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

            <div className="min-h-screen flex flex-col bg-gray-50 pt-30 px-8 md:px-4 py-10">
                <main className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-2xl md:text-3xl font-bold uppercase text-center mb-8">Forgot Password</h1>

                        <form onSubmit={handleForgotPassword} className="space-y-4">

                            {/* Email */}
                            <div className="relative">
                                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="w-full pl-10 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* OR Divider */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="text-gray-500 text-sm">OR</span>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            {/* Mobile */}
                            <div className="relative flex">
                                <span className="flex items-center justify-center px-4 border rounded-l-md bg-gray-100 text-gray-600">
                                    +1
                                </span>
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Mobile Number"
                                    className="flex-1 px-4 py-3 border-t border-b border-r rounded-r-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"} text-white font-medium rounded-md transition flex items-center justify-center`}
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>

                            {/* Login Link */}
                            <p className="text-center text-sm text-gray-600 mt-6 border-t pt-6">
                                Remembered your password?{" "}
                                <Link to="/login" className="text-black font-medium hover:underline">
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
