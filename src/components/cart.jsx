import { FaCreditCard } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useMemo } from "react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Cart({ cartItems, setCartItems }) {
    const [paymentOption, setPaymentOption] = useState("full");

    if (!cartItems.length) {
        return <p className="text-gray-500 mt-6">Please select a service, date/time, and gender.</p>;
    }

    const handleDelete = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const totalAmount = useMemo(() => {
        const total = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
        if (paymentOption === "half") return total / 2;
        if (paymentOption === "book-only") return 0;
        return total;
    }, [cartItems, paymentOption]);

    const handleCheckout = async () => {
        try {
            if (paymentOption === "book-only") {
                toast.success("Appointment booked without payment.");
                return;
            }

            const stripe = await stripePromise;

            const { data } = await axios.post(
                import.meta.env.VITE_API_URL + "/api/stripe/create-checkout-session",
                { cartItems, paymentOption },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }
            );

            await stripe.redirectToCheckout({ sessionId: data.id });
        } catch (err) {
            console.error("Checkout error:", err);
            toast.error("Failed to process payment.");
        }
    };

    const getDescription = () => {
        switch (paymentOption) {
            case "full":
                return "You will pay the full amount at checkout. Ensure your payment details are correct to confirm your appointment.";
            case "half":
                return "You will pay 50% of the total amount at checkout. The remaining amount will be collected during your visit.";
            case "book-only":
                return "No payment now. Your appointment will be booked only, without any payment. Please ensure to attend on the scheduled date and time, otherwise the booking may be subject to cancellation or rescheduling.";
            default:
                return "";
        }
    };


    return (
        <div className="flex flex-col gap-4 mt-6 w-full max-w-7xl mx-auto">
            {cartItems.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex justify-between items-center p-4 border rounded-lg shadow hover:shadow-lg transition"
                >
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-gray-600">{Number(item.price).toLocaleString()} LKR</p>
                        <p className="text-gray-500">{item.date} at {item.time}</p>
                        <p className="text-gray-500">For: {item.gender}</p>
                        <p className="text-gray-500">Stylist: {item.stylist || "Unnamed Stylist"}</p>
                    </div>
                    <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700 transition cursor-pointer"
                    >
                        <RiDeleteBin6Line size={20} />
                    </button>
                </motion.div>
            ))}

            {/* Payment Option */}
            <div className="mt-6 p-5  flex flex-col gap-3 shadow-sm">
                <div className="flex flex-wrap gap-4">
                    {[
                        { value: "full", label: "Full Payment", color: "bg-red-800 text-white" },
                        { value: "half", label: "Half Payment", color: "bg-yellow-800 text-white" },
                        { value: "book-only", label: "Book Only", color: "bg-black text-white" }
                    ].map(option => (
                        <label
                            key={option.value}
                            className={`cursor-pointer px-5 py-2  border transition font-medium uppercase ${paymentOption === option.value ? option.color : "bg-white text-black hover:bg-gray-200"}`}
                        >
                            <input
                                type="radio"
                                name="paymentOption"
                                value={option.value}
                                checked={paymentOption === option.value}
                                onChange={() => setPaymentOption(option.value)}
                                className="hidden"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
                <p className="text-gray-600 mt-10">{getDescription()}</p>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mt-4 p-4 border-t border-gray-300">
                <h3 className="text-lg font-bold">Total:</h3>
                <span className="text-lg font-semibold">{totalAmount.toLocaleString()} LKR</span>
            </div>

            {/* Checkout */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleCheckout}
                    className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded shadow hover:bg-red-600 transition"
                >
                    <FaCreditCard size={18} />
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}
