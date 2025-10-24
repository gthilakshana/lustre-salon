import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-international-phone/style.css";
import { ShowToast } from "../components/lustreToaster";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";
import { HiMail, HiPhone, HiLockClosed } from "react-icons/hi";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [useMobile, setUseMobile] = useState(false);

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

        setLoading(true);

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
                    "Your account is blocked. Please contact the system administrator."
                );
            }

            if (user?.role !== "admin") {
                setLoading(false);
                return ShowToast(
                    "error",
                    "Access Denied",
                    "This login is for administrators only."
                );
            }

            ShowToast(
                "success",
                "Login Successful AdminPanel",
                message || "Welcome back, AdminPanel!"
            );

            if (token) localStorage.setItem("token", token);
            if (user) localStorage.setItem("user", JSON.stringify(user));

            setTimeout(() => { navigate("/admin"); }, 2000);
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Login failed.";
            ShowToast(
                "error",
                "Login Failed",
                errorMsg || "Please try again or contact system support.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div
                className="min-h-screen flex justify-center items-center pt-16 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/adminLogin.png')" }}
            >
                <div className="w-full max-w-md bg-black/90 backdrop-blur-md p-8 m-4 rounded-lg shadow-2xl">
                    <h1 className="text-xl md:text-2xl font-bold uppercase text-center text-white mb-8">
                        Admin Login
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {!useMobile && (
                            <div className="relative">
                                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Gmail address"
                                    className="w-full pl-10 pr-4 py-3 text-base md:text-base border-gray-700 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                        )}

                        {useMobile && (
                            <div className="relative">
                                <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Mobile number"
                                    className="w-full pl-10 pr-4 py-3 text-base md:text-base border border-gray-700 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                            </div>
                        )}

                        <div className="relative">
                            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full pl-10 pr-4 py-3 text-base md:text-base border border-gray-700 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-red-600 text-white text-base md:text-base font-medium rounded-md hover:bg-red-700 transition flex justify-center items-center"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2  border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Admin Login"
                            )}
                        </button>

                        <div className="flex justify-between text-sm">
                            <Link to="/forgotPassword" className="text-gray-300 hover:underline text-xs md:text-md">
                                Forgot password?
                            </Link>
                            <button
                                type="button"
                                onClick={() => setUseMobile(!useMobile)}
                                className="text-gray-300 hover:underline text-xs md:text-md"
                            >
                                {useMobile ? "Use Email Instead" : "Use Mobile Instead"}
                            </button>
                        </div>

                        <p className="text-center text-xs md:text-md text-gray-400 mt-6 border-t border-gray-700 pt-6">
                            Go back to{" "}
                            <Link to="/login" className="text-white text-xs md:text-md font-medium hover:underline">
                                User Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}
