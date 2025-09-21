import axios from "axios";
import { ShowToast, LustreToaster } from "../components/lustreToaster";
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


        if (!fullName || !email || !mobile || !gender || !password || !confirmPassword) {
            return ShowToast(
                "error",
                "Invalid input",
                "Please fill in all the required fields."
            );
        }


        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            return ShowToast(
                "error",
                "Invalid input",
                "Please enter a valid email address."
            );
        }


        if (password !== confirmPassword) {
            return ShowToast(
                "error",
                "Invalid input",
                "Passwords do not match."
            );
        }

        // Password strength validation (6 characters minimum)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return ShowToast(
                "error",
                "Weak password",
                "Password must be at least 6 characters, include uppercase, lowercase, number, and special character."
            );
        }


        try {
            const response = await axios.post(
                import.meta.env.VITE_API_URL + "/api/users/register",
                { fullName, email, mobile, gender, password, confirmPassword }
            );


            ShowToast(
                "success",
                "Registration Successful",
                response.data.message || "Welcome to Lustre Salon! Please login to continue."
            );

            setTimeout(() => navigate("/login"), 2000);

        } catch (error) {
            const errorMsg = error?.response?.data?.message || "Signup failed.";


            ShowToast(
                "error",
                "Registration Failed",
                errorMsg || "Please check your details and try again."
            );
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

                            />


                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"

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

                            />


                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"

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
