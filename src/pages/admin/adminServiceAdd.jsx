import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminServiceAdd({ isOpen, onClose, refresh }) {
    const [serviceName, setServiceName] = useState("");
    const [subName, setSubName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Active");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await axios.post(import.meta.env.VITE_API_URL + "/api/services", {
                serviceName,
                subName,
                price,
                description,
                status,
            });
            toast.success("Service added successfully");
            refresh();
            onClose();
            setServiceName("");
            setSubName("");
            setPrice("");
            setDescription("");
            setStatus("Active");
        } catch (err) {
            console.error("Add service error:", err);
            toast.error("Failed to add service");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-center px-4">
            <div className="bg-white shadow-2xl relative w-[90%] md:w-[45%] max-h-[80vh] p-6  animate-fadeIn">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute -top-5 -right-5 w-10 h-10 bg-red-600 rounded-full text-white flex justify-center items-center shadow-lg hover:bg-white hover:text-red-600 transition"
                >
                    <FaTimes />
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-4">Add Service</h2>

                <form onSubmit={handleSubmit} className="flex flex-col   gap-4">
                    <select
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-400 outline-none"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Haircuts & Styling">Haircuts & Styling</option>
                        <option value="Hair Color Services">Hair Color Services</option>
                        <option value="Ladies hair chemical services">Ladies hair chemical services</option>
                        <option value="Hair extension services">Hair extension services</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Service Name"
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-400 outline-none"
                        required
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-400 outline-none"
                        required
                        min={0}
                    />

                    <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-400 outline-none"
                        rows="4"
                        required
                    ></textarea>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2 border rounded-md focus:ring-1 focus:ring-gray-400 outline-none"
                        required
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-black text-white rounded-md cursor-pointer hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Service"}
                    </button>
                </form>
            </div>
        </div>
    );
}
