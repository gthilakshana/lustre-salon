import { FaCreditCard } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { ShowToast } from "../components/lustreToaster";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function addMinutesToTimeStr(timeStr, minutesToAdd = 45) {
    if (!timeStr) return "1:00 PM";
    const trimmed = timeStr.trim();
    const ampmMatch = trimmed.match(/(AM|PM|am|pm)$/);
    let date = new Date();
    if (ampmMatch) {
        const [timePart, modifier] = trimmed.split(" ");
        const [h, m] = timePart.split(":").map(Number);
        let hours = h;
        if (modifier.toUpperCase() === "PM" && h !== 12) hours += 12;
        if (modifier.toUpperCase() === "AM" && h === 12) hours = 0;
        date.setHours(hours, m || 0, 0, 0);
    } else {
        const [h, m] = trimmed.split(":").map(Number);
        date.setHours(h, m || 0, 0, 0);
    }
    date.setMinutes(date.getMinutes() + minutesToAdd);
    let hh = date.getHours();
    const mm = date.getMinutes();
    const ampm = hh >= 12 ? "PM" : "AM";
    if (hh === 0) hh = 12;
    if (hh > 12) hh -= 12;
    const mmStr = mm < 10 ? `0${mm}` : `${mm}`;
    return `${hh}:${mmStr} ${ampm}`;
}


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Cart({ cartItems, setCartItems, user }) {
    const [paymentOption, setPaymentOption] = useState("full");
    const navigate = useNavigate();

    const formatter = useMemo(() => new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }), []);

    const handleDelete = (id) => setCartItems(prev => prev.filter(i => (i.id || i._id) !== id));

    const amounts = useMemo(() => {
        const total = cartItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
        if (paymentOption === "half") return { payNow: total / 2, due: total / 2 };
        if (paymentOption === "book-only") return { payNow: 0, due: total };
        return { payNow: total, due: 0 };
    }, [cartItems, paymentOption]);


    const handleCheckout = async () => {
        try {
            const appointmentsPayload = cartItems.map(item => {
                const totalCost = Number(item.price || 0);
                let fullPayment = totalCost;
                let duePayment = 0;

                if (paymentOption === "half") {
                    fullPayment = totalCost / 2;
                    duePayment = totalCost / 2;
                } else if (paymentOption === "book-only") {
                    fullPayment = 0;
                    duePayment = totalCost;
                }

                // Using 45 minutes duration
                const endTime = item.endTime || addMinutesToTimeStr(item.time || "9:00 AM", 45);

                return {
                    id: item.id,

                    stylistName: item.stylist || item.stylistName || "Unnamed Stylist",
                    serviceName: item.serviceName || item.title || item.name || "",
                    subName: item.subName || item.subtitle || "N/A",
                    date: item.date,
                    time: item.time,
                    endTime,
                    type: item.gender || "Gents",
                    price: totalCost,
                    fullPayment,
                    duePayment,
                    paymentType: paymentOption === "book-only" ? "Book Only" : paymentOption === "half" ? "Half" : "Full",
                    userId: user?._id
                };
            });

            if (paymentOption === "book-only") {
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/appointments/book-only`,
                    { appointments: appointmentsPayload },
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                ShowToast("success", "Booking successful!", data.message || "Your appointment is confirmed as Pending.");
                setCartItems([]);
                navigate("/user");
                return;
            }

            // --- Full/Half payments ---
            const stripe = await stripePromise;

            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`,
                {
                    cartItems: appointmentsPayload,
                    paymentOption
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            await stripe.redirectToCheckout({ sessionId: data.id });

        } catch (err) {
            console.error("Checkout error:", err);
            ShowToast(
                "error",
                "Failed to process appointment.",
                err.response?.data?.message || "Please try again or contact support."
            );
        }
    };

    const getDescription = () => paymentOption === "full"
        ? "You will pay the full amount at checkout."
        : paymentOption === "half"
            ? "You will pay 50% now. The remaining amount will be collected at your visit."
            : "No payment now. Full amount will be due on your visit.";

    if (!cartItems.length) return <p className="text-gray-500 mt-6">Please select a service, date/time, and gender.</p>;

    return (
        <div className="flex flex-col gap-6 mt-6 w-full max-w-4xl mx-auto px-2 sm:px-4">
            {/* Cart Items */}
            {cartItems.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-5 border rounded-lg shadow hover:shadow-lg bg-white transition"
                >
                    <div className="flex flex-col gap-1 sm:flex-1">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-800">{item.title || item.serviceName || "Service"}</h3>
                        <p className="text-gray-600 text-sm sm:text-base">{formatter.format(Number(item.price || 0))}</p>
                        <p className="text-gray-500 text-xs sm:text-sm">{item.date} at {item.time} - {item.endTime || addMinutesToTimeStr(item.time || "9:00 AM", 45)}</p>
                        <p className="text-gray-500 text-xs sm:text-sm">For: {item.gender}</p>
                        <p className="text-gray-500 text-xs sm:text-sm">Stylist: {item.stylist || item.stylistName || "Unnamed Stylist"}</p>
                        <p className="text-gray-500 text-xs sm:text-sm">Payment Type: {item.paymentType || (paymentOption === "book-only" ? "Book Only" : paymentOption === "half" ? "Half" : "Full")}</p>
                    </div>
                    <button
                        onClick={() => handleDelete(item.id || item._id)}
                        className="text-red-500 items-end self-end  hover:text-red-700 transition cursor-pointer mt-6 md:mt-0"
                    >
                        <RiDeleteBin6Line size={22} />
                    </button>
                </motion.div>
            ))}

            {/* Payment Option Selection */}
            <div className="mt-6 p-5 flex flex-col gap-3 shadow-sm rounded-md bg-gray-50">
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Select Payment Option</h4>
                <div className="flex flex-wrap gap-2 sm:gap-4">
                    {["full", "half", "book-only"].map(opt => (
                        <label
                            key={opt}
                            className={`cursor-pointer px-4 sm:px-5 py-2 sm:py-2 border rounded-md transition font-medium uppercase text-xs sm:text-sm ${paymentOption === opt ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-700 hover:bg-gray-200 border-gray-300"}`}
                        >
                            <input
                                type="radio"
                                name="paymentOption"
                                value={opt}
                                checked={paymentOption === opt}
                                onChange={() => setPaymentOption(opt)}
                                className="hidden"
                            />
                            {opt === "full" ? "Full" : opt === "half" ? "Half" : "Book"}
                        </label>
                    ))}
                </div>
                <p className="text-gray-600 mt-2 text-xs sm:text-sm">{getDescription()}</p>
            </div>

            {/* Payment Summary */}
            <div className="flex flex-col gap-1 mt-4 p-4 border-t border-gray-300 bg-white rounded-md shadow-sm">
                <div className="flex justify-between w-full text-sm sm:text-base">
                    <h3 className="font-medium text-gray-700">Payment Now:</h3>
                    <span className="font-semibold text-gray-800">{formatter.format(amounts.payNow)}</span>
                </div>
                <div className="flex justify-between w-full text-sm sm:text-base">
                    <h3 className="text-gray-500 font-medium">Due Amount:</h3>
                    <span className="text-gray-500 font-semibold">{formatter.format(amounts.due)}</span>
                </div>
            </div>

            {/* Checkout Button */}
            <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2 sm:gap-3">
                <button
                    onClick={handleCheckout}
                    className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3 font-semibold rounded-md shadow-md transition text-sm sm:text-base ${paymentOption === "book-only" ? "bg-black text-white hover:bg-gray-800" : "bg-red-500 text-white hover:bg-red-600"}`}
                >
                    <FaCreditCard size={18} className="sm:w-5 sm:h-5" />
                    {paymentOption === "book-only" ? "Book Appointment" : "Proceed to Checkout"}
                </button>
            </div>
        </div>


    );
}
