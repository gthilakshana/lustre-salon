import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminAdd({ isOpen, onClose, refresh }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        gender: "Male",
        role: "admin",
    });

    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("No token found. Please login again.");
                setIsLoading(false);
                return;
            }


            const payload = {
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.password,
                mobile: formData.mobile || "0000000000",
                gender: formData.gender,
                role: "admin",
            };

            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/users`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("Admin added successfully");
            setFormData({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
                mobile: "",
                gender: "Male",
                role: "admin",
            });

            onClose();
            if (refresh) refresh();
        } catch (error) {
            console.error("Error adding admin:", error.response?.data || error);
            toast.error(error?.response?.data?.message || "Failed to add admin");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-white w-[90%] lg:w-[60%] max-h-[90vh] shadow-2xl overflow-y-auto z-10 animate-fadeIn">
                <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between p-4 rounded-t-lg">
                    <h2 className="text-xl font-bold text-gray-800">Add New Admin</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-red-600 rounded-full transition"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                <form className="p-6 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-gray-400 outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-gray-400 outline-none"
                            required
                        />
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                        <div className="flex">
                            <span className="flex items-center justify-center px-4 border-t border-b border-l rounded-l-md bg-gray-100 text-gray-700">
                                +94
                            </span>
                            <input
                                type="tel"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="77xxxxxxx"
                                className="flex-1 h-[54px] w-full px-4 border-t border-b border-r rounded-r-md focus:outline-none"
                                required
                            />
                        </div>
                    </div>



                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-gray-400 outline-none"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-gray-400 outline-none"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            onClick={onClose}
                            type="button"
                            className="px-5 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2 cursor-pointer bg-black text-white rounded-md shadow-md hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                            ) : (
                                "Save Admin"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
