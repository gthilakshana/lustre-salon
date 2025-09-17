import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../components/header";
import Footer from "../components/footer";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email && !mobile) {
            return toast.error("Enter email or mobile number", {
                style: { background: "#fcd0d0", color: "#000" },
            });
        }

        if (email && !/\S+@\S+\.\S+/.test(email)) {
            return toast.error("Enter a valid email address", {
                style: { background: "#fcd0d0", color: "#000" },
            });
        }

        setLoading(true);
        try {
            const response = await axios.post(
                import.meta.env.VITE_API_URL + "/api/users/forgot-password",
                { email, mobile }
            );

            toast.success(response.data.message, {
                style: { background: "#d0f0fd", color: "#000" },
            });

            // Navigate to login page after success
            setTimeout(() => {
                navigate("/login");
            }, 2000); // 2 seconds delay to show the toast
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Request failed.";
            toast.error(errorMsg, {
                style: { background: "#fcd0d0", color: "#000" },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen flex pt-16 flex-col bg-white">
                <main className="flex-1 flex items-center justify-center px-4 mt-16 mb-16">
                    <div className="w-full max-w-md bg-white">
                        <h1 className="text-3xl font-bold uppercase text-center mb-8">
                            Forgot Password
                        </h1>

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Gmail address"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-black"
                            />

                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="text-gray-500 text-sm">OR</span>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            <div className="flex ">
                                <span className="flex items-center justify-center px-4 border-t border-b border-l rounded-l-md bg-gray-100 text-gray-700">
                                    +94
                                </span>

                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Mobile number"
                                    className="flex-1 h-[54px] w-full px-4 border-t border b border-r rounded-r-md focus:outline-none focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"} text-white font-medium rounded-md transition cursor-pointer`}
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>

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
