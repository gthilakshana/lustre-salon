import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMail, HiPhone, HiLockClosed } from "react-icons/hi";
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
                `${import.meta.env.VITE_API_URL}/api/users/login`,
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

            if (user?.role === "admin") {
                setLoading(false);
                return ShowToast(
                    "error",
                    "Access Denied",
                    "Admin accounts cannot log in from the user login page."
                );
            }

            ShowToast(
                "success",
                "Login Successful",
                message || "Welcome back to Lustre Salon!"
            );

            if (token) localStorage.setItem("token", token);
            if (user) localStorage.setItem("user", JSON.stringify(user));

            setTimeout(() => {
                navigate("/user");
            }, 1500);
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Login failed.";
            ShowToast(
                "error",
                "Login Failed",
                errorMsg || "Please try again or contact Lustre Salon support."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 pt-30 px-8 md:px-4 py-10">
                <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md ">
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-8 uppercase text-gray-900">
                        Login
                    </h1>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {!useMobile && (
                            <div className="relative">
                                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Gmail address"
                                    className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                        )}

                        {useMobile && (
                            <div className="relative flex items-center">
                                <HiPhone className="absolute left-3 text-gray-400 w-5 h-5" />
                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Mobile number"
                                    className="flex-1 pl-10 pr-4 py-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                                <button
                                    type="button"
                                    className="px-4 py-3 bg-black text-white rounded-r-md font-medium hover:bg-gray-800 transition"
                                >
                                    Verify
                                </button>
                            </div>
                        )}

                        <div className="relative">
                            <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition flex justify-center items-center"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Login"
                            )}
                        </button>

                        <div className="flex justify-between text-sm text-gray-600">
                            <Link
                                to="/forgotPassword"
                                className="hover:underline text-gray-900 font-medium"
                            >
                                Forgot password?
                            </Link>
                            <button
                                type="button"
                                onClick={() => setUseMobile(!useMobile)}
                                className="text-gray-900 font-medium hover:underline"
                            >
                                {useMobile ? "Use Email Instead" : "Use Mobile Instead"}
                            </button>
                        </div>

                        <p className="text-center text-sm text-gray-600 mt-6 border-t pt-6">
                            Don’t have an account?{" "}
                            <Link
                                to="/register"
                                className="text-gray-900 font-medium hover:underline"
                            >
                                Create one
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}
