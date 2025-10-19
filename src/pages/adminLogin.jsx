import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-international-phone/style.css";
import { ShowToast } from "../components/lustreToaster";
import axios from "axios";
import Header from "../components/header";
import Footer from "../components/footer";

export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

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

            setTimeout(() => {
                navigate("/admin");
            }, 2000);
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Login failed.";
            ShowToast(
                "error",
                "Login Failed",
                errorMsg || "Please try again or contact system support."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <div className="min-h-screen flex pt-16 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/adminLogin.png')" }}>
                <main className="flex flex-1 items-center justify-center px-4">

                    <div className="w-full max-w-md bg-black shadow-xl  p-8 m-4">
                        <h1 className="text-2xl md:text-3xl font-bold uppercase text-center text-white mb-8">
                            Admin Login
                        </h1>

                        <form onSubmit={handleLogin} className="space-y-4">

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Gmail address"
                                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                            />


                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-px bg-gray-600"></div>
                                <span className="text-gray-400 text-sm">OR</span>
                                <div className="flex-1 h-px bg-gray-600"></div>
                            </div>


                            <div className="flex">
                                <span className="flex items-center justify-center px-4 border-t border-b border-l rounded-l-md bg-gray-800 text-white">
                                    +1
                                </span>

                                <input
                                    type="tel"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Mobile number"
                                    className="flex-1 h-[54px] w-full px-4 border-t border-b border-r-0 bg-gray-900 text-white focus:outline-none"
                                />

                                <button
                                    type="button"
                                    className="h-[54px] px-5 bg-gray-700 text-white font-medium rounded-r-md cursor-pointer hover:bg-gray-600 transition"
                                >
                                    Verify
                                </button>
                            </div>


                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                            />


                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 cursor-pointer bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition flex items-center justify-center"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    "Admin Login"
                                )}
                            </button>


                            <p className="text-right text-sm text-gray-400">
                                <Link
                                    to="/forgotPassword"
                                    className="text-white font-medium hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </p>


                            <p className="text-center text-sm text-gray-400 mt-6 border-t border-gray-700 pt-6">
                                Go back to{" "}
                                <Link
                                    to="/login"
                                    className="text-white font-medium hover:underline"
                                >
                                    User Login
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
