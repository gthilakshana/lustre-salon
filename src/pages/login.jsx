import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-international-phone/style.css";
import { ShowToast } from "../components/lustreToaster";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false); // Added loading state

    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email && !mobile) {
            return ShowToast(
                "error",
                "Invalid input",
                "Please enter either your email or mobile number."
            );
        }

        setLoading(true); // Start loader

        try {
            const response = await axios.post(
                import.meta.env.VITE_API_URL + "/api/users/login",
                { email, mobile, password }
            );

            const { message, token, user } = response.data;

            if (user?.status === "blocked") {
                setLoading(false);
                return ShowToast(
                    "error",
                    "Account Blocked",
                    "Your account is blocked. Please contact Lustre Salon admin for assistance."
                );
            }

            ShowToast(
                "success",
                "Login Successful",
                message || "Welcome back to Lustre Salon!"
            );

            if (token) {
                localStorage.setItem("token", token);
            }
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            }

            setTimeout(() => {
                if (user?.role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }, 2000);
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Login failed.";
            ShowToast(
                "error",
                "Login Failed",
                errorMsg || "Please try again or contact Lustre Salon support."
            );
        } finally {
            setLoading(false); // Stop loader
        }
    };

    return (
        <>
            <Header />

            <div className="min-h-screen flex pt-16 flex-col bg-white">
                <main className="flex-1 flex items-center justify-center px-4 mt-16 mb-16">
                    <div className="w-full max-w-md bg-white p-4">
                        <h1 className="text-2xl md:text-3xl font-bold uppercase text-center mb-8">Login</h1>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Gmail address"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="text-gray-500 text-sm">OR</span>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>

                            {/* Mobile */}
                            <div className="flex">
                                <span className="flex items-center justify-center px-4 border-t border-b border-l rounded-l-md bg-gray-100 text-gray-700">
                                    +94
                                </span>

                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Mobile number"
                                    className="flex-1 h-[54px] w-full px-4 border-t border-b border-r-0 focus:outline-none"
                                />

                                <button
                                    type="button"
                                    className="h-[54px] px-5 bg-black text-white font-medium rounded-r-md cursor-pointer hover:bg-gray-800 transition"
                                >
                                    Verify
                                </button>
                            </div>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />

                            {/* Login Button with Loader */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 cursor-pointer bg-black text-white font-medium rounded-md hover:bg-gray-800 transition flex items-center justify-center "
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    "Login"
                                )}
                            </button>


                            <p className="text-right text-sm text-gray-600">
                                <Link
                                    to="/forgotPassword"
                                    className="text-black font-medium hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </p>

                            <p className="text-center text-sm text-gray-600 mt-6 border-t pt-6">
                                Don’t have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-black font-medium hover:underline"
                                >
                                    Create one
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
