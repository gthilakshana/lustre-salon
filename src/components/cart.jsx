import { FaTrash, FaCreditCard } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { motion } from "framer-motion";

export default function Cart({ cartItems, setCartItems }) {
    if (!cartItems.length) {
        return <p className="text-gray-500 mt-6">Please select a service, date/time, and gender.</p>;
    }

    const handleDelete = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const total = cartItems.reduce((sum, item) => {
        const priceNumber = parseFloat(item.price.replace(/,/g, '').replace(' LKR', '')) || 0;
        return sum + priceNumber;
    }, 0);

    return (
        <div className="flex flex-col gap-4 mt-6 w-full">
            {cartItems.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex justify-between items-center p-4 border rounded-lg shadow"
                >
                    <div className="flex flex-col">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-gray-600">{item.price}</p>
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

            <div className="flex justify-between items-center mt-4 p-4 border-t border-gray-300">
                <h3 className="text-lg font-bold">Total:</h3>
                <span className="text-lg font-semibold">{total.toLocaleString()} LKR</span>
            </div>

            <div className="flex justify-end mt-4">
                <button className="flex items-center cursor-pointer gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded shadow hover:bg-red-600 transition">
                    <FaCreditCard size={18} />
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}
