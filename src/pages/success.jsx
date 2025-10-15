import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ShowToast } from "../components/lustreToaster";
import Header from "../components/header";

export default function Success() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sessionId = new URLSearchParams(search).get("session_id");
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timer;
        let countdownInterval;

        if (!sessionId) {
            ShowToast("error", "No payment session found.");
            timer = setTimeout(() => navigate("/"), 2500);
            return () => clearTimeout(timer);
        }

        const confirmPayment = async () => {
            const token = localStorage.getItem("token");
            console.log("Token status:", token ? "Token Found" : "Token MISSING!");
            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/stripe/confirm-payment`,
                    { sessionId },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    }
                );

                console.log("Confirm payment success:", data);
                ShowToast("success", "Payment successful! Appointments booked.");

                countdownInterval = setInterval(() => {
                    setCountdown(prev => {
                        if (prev <= 1) {
                            clearInterval(countdownInterval);
                            navigate("/");
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } catch (err) {
                console.error("Confirm payment failed:", err);
                ShowToast(
                    "error",
                    err.response?.data?.message || "Payment confirmation failed."
                );
                timer = setTimeout(() => navigate("/dateAndTimeSelect"), 2500);
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();

        return () => {
            clearTimeout(timer);
            clearInterval(countdownInterval);
        };
    }, [sessionId, navigate]);

    return (
        <>
            <Header />

            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
                {loading ? (
                    <div className="text-center px-4 sm:px-0">
                        <h1 className="text-xl sm:text-2xl font-semibold mb-2">Processing Payment...</h1>
                        <p className="text-gray-600 text-sm sm:text-base">
                            Please wait while we confirm your appointment at <span className="font-semibold">LUSTRE SALON</span>.
                        </p>
                    </div>
                ) : (
                    <div className="bg-white shadow-lg p-6 sm:p-8 max-w-md w-full text-center mx-2 sm:mx-0">



                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 sm:w-12 sm:h-12 text-black"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Payment Successful</h1>
                        <p className="text-gray-600 text-sm sm:text-base mb-6">
                            Thank you for your payment. Your appointment is confirmed.
                        </p>

                        <p className="text-gray-500 text-sm sm:text-base">
                            Redirecting to homepage in <span className="font-semibold">{countdown}</span> seconds...
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
