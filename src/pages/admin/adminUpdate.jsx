import { useEffect, useState } from "react";
import axios from "axios";
import { ShowToast, LustreToaster } from "../../components/lustreToaster";
import { FaTimes } from "react-icons/fa";

export default function AdminUpdate({ isOpen, onClose, admin, refresh }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [status, setStatus] = useState("active");
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (admin) {
            setFullName(admin.fullName || "");
            setEmail(admin.email || "");
            setMobileNumber(admin.mobileNumber || "");
            setStatus(admin.status || "active");
        }
    }, [admin]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            ShowToast(
                "error",
                "Session expired",
                "Please login again."
            );
            return;
        }

        try {
            setLoading(true);

            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/users/${admin._id}`,
                { fullName, email, mobileNumber, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            ShowToast(
                "success",
                "Admin updated successfully"
            );
            onClose();


            if (typeof refresh === "function") refresh();
        } catch (err) {
            console.error(err);
            ShowToast(
                "error",
                "Failed to update admin",
                err.response?.data?.message || "Please try again or contact support."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white w-[90%] md:w-[45%] max-h-[80vh] overflow-y-auto shadow-xl ">


                <div className="sticky top-0 bg-white border-b flex items-center justify-between p-5 z-10">
                    <h2 className="text-lg font-semibold text-black">Update Admin</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-red-600  rounded-full">
                        <FaTimes size={18} />
                    </button>
                </div>


                <form className="p-6 space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-200 outline-none"
                                placeholder="Admin Name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-200 outline-none"
                            />
                        </div>


                        {/* Mobile Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                            <div className="flex">
                                <span className="flex items-center justify-center px-4 border-t border-b border-l rounded-l-md bg-gray-100 text-gray-700">
                                    +1
                                </span>
                                <input
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    placeholder="### ### ####"

                                    className="flex-1 h-[54px] w-full px-4 border-t border-b border-r rounded-r-md focus:outline-none"
                                    required
                                />
                            </div>
                        </div>



                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className={`w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-gray-200 outline-none
                                ${status === "active" ? "bg-gray-100" : ""} 
                                ${status === "blocked" ? "bg-red-100" : ""}`}
                            >
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>


                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-black cursor-pointer text-white px-6 py-2 rounded-lg shadow hover:bg-gray-800 transition disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Update Admin"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
