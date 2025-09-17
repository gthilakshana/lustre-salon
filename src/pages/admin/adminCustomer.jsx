import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

function CustomerDeleteConfirm({ customerID, close, onDelete, loading }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-center px-4">
            <div className="bg-white shadow-2xl relative max-w-sm w-full p-6 flex flex-col items-center gap-6 rounded-md">
                <button
                    onClick={close}
                    disabled={loading}
                    className="absolute -top-5 -right-5 w-10 h-10 bg-red-600 rounded-full text-white flex justify-center items-center shadow-lg hover:bg-white hover:text-red-600 transition disabled:opacity-50"
                >
                    <FaTimes />
                </button>

                <FaExclamationTriangle className="text-yellow-500 text-4xl" />

                <p className="text-center text-gray-800 font-semibold text-lg">
                    Are you sure you want to delete customer ID:{" "}
                    <span className="font-bold">{customerID}</span>?
                </p>

                <div className="flex gap-4 mt-2">
                    <button
                        onClick={close}
                        disabled={loading}
                        className="px-4 py-2 w-[100px] bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition rounded-md disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onDelete(customerID)}
                        disabled={loading}
                        className="px-4 py-2 w-[100px] bg-red-600 text-white font-medium hover:bg-red-700 transition rounded-md flex justify-center items-center disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            "Yes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminCustomer() {
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState("");
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchCustomers = async () => {
        try {
            setFetching(true);
            const start = Date.now();

            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/users");
            const userList = res.data.filter((u) => u.role === "user");
            setCustomers(userList);


            const elapsed = Date.now() - start;
            if (elapsed < 2000) {
                setTimeout(() => setFetching(false), 2000 - elapsed);
            } else {
                setFetching(false);
            }
        } catch (err) {
            console.error("Failed to fetch customers:", err);
            toast.error("Failed to load customers");
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`);
            toast.success("Customer deleted successfully");
            setCustomers(customers.filter((c) => c._id !== id));
            setIsDeleteConfirmVisible(false);
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete customer");
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(
        (c) =>
            (c.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
            (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
            (c.mobile || "").toLowerCase().includes(search.toLowerCase()) ||
            (c.status || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full min-h-screen bg-white p-6 relative">
            {isDeleteConfirmVisible && (
                <CustomerDeleteConfirm
                    customerID={customerToDelete}
                    close={() => setIsDeleteConfirmVisible(false)}
                    onDelete={handleDelete}
                    loading={loading}
                />
            )}


            {fetching && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
                    <span className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 uppercase">Customers</h1>
                <span className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-2xl">
                    {filteredCustomers.length} Customers
                </span>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-3 border rounded-md focus:ring-1 focus:ring-gray-400 outline-none"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left border rounded-lg overflow-hidden">
                    <thead className="bg-gray-900 text-white">
                        <tr>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Name</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Email</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Mobile Number</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Role</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Status</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((c) => (
                                <tr key={c._id} className="hover:bg-blue-50 transition">
                                    <td className="px-4 py-3 font-sm uppercase text-gray-800">
                                        {c.fullName}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{c.email}</td>
                                    <td className="px-4 py-3 text-gray-700">+94 {c.mobileNumber}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2.5 py-1 rounded-md text-xs font-sm bg-gray-100 text-gray-700">
                                            {c.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-sm ${c.status === "blocked"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-blue-100 text-green-700"
                                                }`}
                                        >
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => {
                                                setCustomerToDelete(c._id);
                                                setIsDeleteConfirmVisible(true);
                                            }}
                                            className="inline-flex items-center gap-2 px-3 py-1 text-sm cursor-pointer text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition"
                                        >
                                            <RiDeleteBin6Line /> Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                    No customers to display.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
