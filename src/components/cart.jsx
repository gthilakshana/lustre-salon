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
                    subName: item.subName || item.subtitle || "",
                    date: item.date,
                    time: item.time,
                    endTime,
                    type: item.gender,
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
                navigate("/");
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
        <div className="flex flex-col gap-4 mt-6 w-full max-w-7xl mx-auto">
            {cartItems.map((item, index) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex justify-between items-center p-4 border rounded-lg shadow hover:shadow-lg transition">
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-lg">{item.title || item.serviceName || "Service"}</h3>
                        <p className="text-gray-600">{formatter.format(Number(item.price || 0))}</p>
                        <p className="text-gray-500">{item.date} at {item.time} - {item.endTime || addMinutesToTimeStr(item.time || "9:00 AM", 45)}</p>
                        <p className="text-gray-500">For: {item.gender}</p>
                        <p className="text-gray-500">Stylist: {item.stylist || item.stylistName || "Unnamed Stylist"}</p>
                        <p className="text-gray-500">Payment Type: {item.paymentType || (paymentOption === "book-only" ? "Book Only" : paymentOption === "half" ? "Half" : "Full")}</p>
                    </div>
                    <button onClick={() => handleDelete(item.id || item._id)} className="text-red-500 hover:text-red-700 transition cursor-pointer">
                        <RiDeleteBin6Line size={20} />
                    </button>
                </motion.div>
            ))}

            <div className="mt-6 p-5 flex flex-col gap-3 shadow-sm">
                <div className="flex flex-wrap gap-4">
                    {["full", "half", "book-only"].map(opt => (
                        <label key={opt} className={`cursor-pointer px-5 py-2 border transition font-medium uppercase ${paymentOption === opt ? "bg-red-500 text-white" : "bg-white text-black hover:bg-gray-200"}`}>
                            <input type="radio" name="paymentOption" value={opt} checked={paymentOption === opt} onChange={() => setPaymentOption(opt)} className="hidden" />
                            {opt === "full" ? "Full Payment" : opt === "half" ? "Half Payment" : "Book Only"}
                        </label>
                    ))}
                </div>
                <p className="text-gray-600 mt-4">{getDescription()}</p>
            </div>

            <div className="flex flex-col gap-1 mt-4 p-4 border-t border-gray-300">
                <div className="flex justify-between w-full"><h3 className="text-lg font-medium">Payment Now:</h3><span className="text-lg font-semibold">{formatter.format(amounts.payNow)}</span></div>
                <div className="flex justify-between w-full"><h3 className="text-md font-medium text-gray-500">Due Amount:</h3><span className="text-lg font-semibold text-gray-500">{formatter.format(amounts.due)}</span></div>
            </div>

            <div className="flex justify-end mt-4 gap-3">
                <button onClick={handleCheckout} className={`flex items-center cursor-pointer gap-2 px-6 py-3 font-semibold rounded shadow transition ${paymentOption === "book-only" ? "bg-black text-white hover:bg-gray-800" : "bg-red-500 text-white hover:bg-red-600"}`}>
                    <FaCreditCard size={18} />
                    {paymentOption === "book-only" ? "Book Appointment" : "Proceed to Checkout"}
                </button>
            </div>
        </div>
    );
}
