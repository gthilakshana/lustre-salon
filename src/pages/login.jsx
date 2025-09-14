import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Login() {
    return (
        <>
            <Header />
            <div className="min-h-screen flex pt-16 flex-col bg-white">
                <main className="flex-1 flex items-center justify-center px-4 mt-16 mb-16">
                    <div className="w-full max-w-md bg-white">

                        <h1 className="text-3xl font-bold uppercase text-center mb-8">
                            Login
                        </h1>


                        <form className="space-y-4">

                            <input
                                type="email"
                                placeholder="Gmail address"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />


                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-px bg-gray-300"></div>
                                <span className="text-gray-500 text-sm">OR</span>
                                <div className="flex-1 h-px bg-gray-300"></div>
                            </div>


                            <div className="flex">
                                <span className="px-4 py-3 border border-r-0 rounded-l-md bg-gray-50">
                                    +94
                                </span>
                                <input
                                    type="text"
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


                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />


                            <button
                                type="submit"
                                className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
                            >
                                Login
                            </button>


                            <p className="text-right text-sm text-gray-600">
                                <a href="/forgot-password" className="text-black font-medium hover:underline">
                                    Forgot password?
                                </a>
                            </p>


                            <p className="text-center text-sm text-gray-600 mt-6 border-t pt-6">
                                Don’t have an account?{" "}

                                <Link
                                    to="/register"
                                    className="text-black font-medium hover:underline">
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
