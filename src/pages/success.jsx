import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { ShowToast } from "../components/lustreToaster";

export default function Success() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const sessionId = new URLSearchParams(search).get("session_id");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let timer;

        if (!sessionId) {
            ShowToast("error", "No payment session found.");
            timer = setTimeout(() => navigate("/"), 2500);
            return () => clearTimeout(timer);
        }

        const confirmPayment = async () => {
            try {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/appointments/confirm-payment`,
                    { sessionId },
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    }
                );

                console.log("Confirm payment success:", data);
                ShowToast("success", "💳 Payment successful! Appointments booked.");

                timer = setTimeout(() => navigate("/"), 2500);
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

        return () => clearTimeout(timer);
    }, [sessionId, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            {loading ? (
                <div className="text-center">
                    <h1 className="text-2xl font-semibold mb-2">Processing Payment...</h1>
                    <p className="text-gray-600">
                        Please wait while we confirm your appointment.
                    </p>
                </div>
            ) : (
                <div className="text-center">
                    <h1 className="text-2xl font-semibold text-green-600 mb-2">
                        Payment Complete!
                    </h1>
                    <p className="text-gray-600">
                        You will be redirected to the homepage shortly.
                    </p>
                </div>
            )}
        </div>
    );
}
