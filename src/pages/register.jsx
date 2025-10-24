import axios from "axios";
import { ShowToast } from "../components/lustreToaster";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { HiMail, HiPhone, HiLockClosed, HiUser } from "react-icons/hi";

export default function Register() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    async function handleRegister(e) {
        e.preventDefault();

        if (!fullName || !email || !mobile || !gender || !password || !confirmPassword) {
            return ShowToast("error", "Invalid input", "Please fill in all the required fields.");
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return ShowToast("error", "Invalid input", "Please enter a valid email address.");
        }

        if (password !== confirmPassword) {
            return ShowToast("error", "Invalid input", "Passwords do not match.");
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{6,}$/;
        if (!passwordRegex.test(password)) {
            return ShowToast(
                "error",
                "Weak password",
                "Password must be at least 6 characters, include uppercase, lowercase, number, and special character."
            );
        }


        // USA mobile validation
        const usaMobileRegex = /^1?[2-9]\d{2}[2-9]\d{2}\d{4}$/;
        if (!usaMobileRegex.test(mobile)) {
            setLoading(false);
            return ShowToast(
                "error",
                "Invalid Mobile Number",
                "Please enter a valid USA mobile number (10 digits, optionally starting with 1)."
            );
        }


        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users/register`,
                { fullName, email, mobile, gender, password, confirmPassword }
            );

            ShowToast(
                "success",
                "Registration Successful",
                response.data.description || "Welcome to Lustre Salon! Please login to continue."
            );

            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            const errorMsg = error?.response?.data?.description || "Signup failed.";
            ShowToast("error", "Registration Failed", errorMsg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header />

            <div className="min-h-screen flex flex-col bg-gray-50 pt-20  ">
                <main className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                        <h1 className="text-xl md:text-2xl font-bold text-center mb-8 uppercase">Create Account</h1>

                        <form onSubmit={handleRegister} className="space-y-3">

                            {/* Full Name */}
                            <div className="relative">
                                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full Name"
                                    className="w-full pl-10 pr-4 py-3 text-base md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>


                            {/* Email */}
                            <div className="relative">
                                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="w-full pl-10 px-4 py-3 text-base md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
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

                            {/* Gender */}
                            <div className="flex items-center gap-6 border px-4 py-3 rounded-md">
                                <label className="flex items-center gap-2 text-base md:text-base">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === "male"}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                    Male
                                </label>
                                <label className="flex items-center gap-2 text-base md:text-base">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={gender === "female"}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                    Female
                                </label>
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full pl-10 px-4 py-3 text-base md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm Password"
                                    className="w-full pl-10 px-4 py-3 text-base md:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-black cursor-pointer text-base md:text-base text-white font-medium rounded-md hover:bg-gray-800 transition flex items-center justify-center"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2  border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                    "Create Account"
                                )}
                            </button>

                            {/* Login Link */}
                            <p className="text-center text-xs md:text-md text-gray-600 mt-6 border-t pt-6">
                                Already have an account?{" "}
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
