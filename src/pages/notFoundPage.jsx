import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <>
            <Header />

            <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white text-white px-6 relative">
                {/* Icon */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                >
                    <FaExclamationTriangle className="text-red-600 text-6xl md:text-7xl" />
                </motion.div>



                {/* Title */}
                <motion.h2
                    className="text-2xl md:text-4xl text-black font-bold mt-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    Page Not Found
                </motion.h2>

                {/* Description */}
                <motion.p
                    className="text-gray-700 max-w-lg text-center mt-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    Sorry, the page you are looking for doesn’t exist or has been moved.
                    Please check the URL or go back to the homepage.
                </motion.p>

                {/* Button */}
                <motion.button
                    onClick={() => navigate("/")}
                    className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg transition"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    Back to Home
                </motion.button>
            </div>

            <Footer />
        </>
    );
}
