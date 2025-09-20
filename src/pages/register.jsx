import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Register() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleRegister(e) {
        e.preventDefault();

        try {
            const response = await axios.post(
                import.meta.env.VITE_API_URL + "/api/users/register",
                { fullName, email, mobile, gender, password, confirmPassword }
            );


            toast.success(response.data.message, {
                style: { background: "#d0f0fd", color: "#000" },
            });

            setTimeout(() => navigate("/login"), 2000);

        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Signup failed.";
            toast.error(errorMsg, {
                style: { background: "#fcd0d0", color: "#000" },
            });
        }
    }

    return (
        <>
            <Header />

            <div className="min-h-screen flex pt-26 flex-col bg-white">
                <main className="flex-1 flex items-center justify-center px-4 mt-16 mb-16">
                    <div className="w-full max-w-md bg-white">
                        <h1 className="text-3xl font-bold uppercase text-center mb-8">
                            Create an Account
                        </h1>

                        <form onSubmit={handleRegister} className="space-y-4">

                            <input
                                type="text"
                                name="fullName"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="First Name & Last Name"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />


                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />


                            <div className="flex">
                                <span className="px-4 py-3 border border-r-0 rounded-l-md bg-gray-50">
                                    +94
                                </span>
                                <input
                                    type="text"
                                    name="mobile"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Mobile Number"
                                    className="w-full px-4 py-3 border-t border-b focus:outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    className="px-5 py-3 bg-black text-white font-medium rounded-r-md hover:bg-gray-800 transition"
                                >
                                    Verify
                                </button>
                            </div>


                            <div className="flex items-center gap-4 border px-4 py-3 rounded-md">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={gender === "male"}
                                        onChange={(e) => setGender(e.target.value)}
                                    />
                                    Male
                                </label>
                                <label className="flex items-center gap-2">
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


                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />


                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                required
                            />


                            <button
                                type="submit"
                                className="w-full py-3 bg-black cursor-pointer text-white font-medium rounded-md hover:bg-gray-800 transition"
                            >
                                Create account
                            </button>


                            <p className="text-center text-sm text-gray-600 mt-6 border-t pt-6">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-black font-medium hover:underline cursor-pointer"
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
