import Header from "../components/header";
import Footer from "../components/footer";

export default function Register() {
    return (
        <>
            <Header />
            <div className="min-h-screen flex pt-26 flex-col bg-white">
                <main className="flex-1 flex items-center justify-center px-4 mt-16 mb-16">
                    <div className="w-full max-w-md bg-white">

                        <h1 className="text-2xl font-semibold text-center mb-8">
                            Create an Account
                        </h1>


                        <form className="space-y-4">

                            <input
                                type="text"
                                placeholder="First Name & Last Name"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />


                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />


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


                            <div className="flex items-center gap-4 border px-4 py-3 rounded-md">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="gender" value="male" />
                                    Male
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="gender" value="female" />
                                    Female
                                </label>
                            </div>


                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />


                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />


                            <button
                                type="submit"
                                className="w-full py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition"
                            >
                                Create account
                            </button>


                            <p className="text-center text-sm text-gray-600 mt-6 border-t pt-6">
                                Already have an account?{" "}
                                <a href="/login" className="text-black font-medium hover:underline">
                                    Login
                                </a>
                            </p>
                        </form>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}
