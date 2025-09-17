import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../components/header";
import Footer from "../components/footer";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            return toast.error("All fields are required", {
                style: { background: "#fcd0d0", color: "#000" },
            });
        }

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match", {
                style: { background: "#fcd0d0", color: "#000" },
            });
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/reset-password/${token}`,
                { password, confirmPassword }
            );

            toast.success(response.data.message, {
                style: { background: "#d0f0fd", color: "#000" },
            });

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Password reset failed";
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
                            Reset Password
                        </h1>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="New Password"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                                    } text-white font-medium rounded-md transition`}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
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
