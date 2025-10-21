import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import { ShowToast, LustreToaster } from "../../components/lustreToaster";

// Delete confirmation modal
function CustomerDeleteConfirm({ customerID, close, confirmDelete, loading }) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-center items-center px-4">
            <div className="bg-white shadow-xl max-w-sm w-full p-5 rounded-md animate-fadeIn relative">
                <button
                    onClick={close}
                    disabled={loading}
                    className="absolute -top-4 -right-4 w-8 h-8 bg-red-600 text-white rounded-full hover:bg-white hover:text-red-600 border border-red-600 flex items-center justify-center transition disabled:opacity-50"
                >
                    ✕
                </button>

                <FaExclamationTriangle className="text-yellow-500 text-4xl mx-auto" />
                <p className="text-center text-sm text-gray-700 mb-4">
                    Are you sure you want to delete customer:
                    <span className="block font-semibold mt-1 text-gray-900">{customerID}</span>
                </p>

                <div className="flex justify-center gap-3">
                    <button
                        onClick={close}
                        disabled={loading}
                        className="px-4 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => confirmDelete(customerID)}
                        disabled={loading}
                        className="px-4 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
                        ) : (
                            "Delete"
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
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const fetchCustomers = async () => {
        try {
            setFetching(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
            const userList = res.data.filter(u => u.role === "user");
            setCustomers(userList);
        } catch (err) {
            console.error(err);
            ShowToast(
                "error",
                "Failed to load customers",
                "Please try again or contact support."
            );
        } finally {
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
            ShowToast("success", "Customer deleted");
            setCustomers(prev => prev.filter(c => c._id !== id));
            setConfirmVisible(false);
        } catch {
            ShowToast("error", "Delete failed", "Please try again or contact support.");
        } finally {
            setLoading(false);
        }
    };

    const filtered = customers.filter(c =>
        (c.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.mobileNumber || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.status || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full  text-sm relative ">
            {confirmVisible && (
                <CustomerDeleteConfirm
                    customerID={customerToDelete}
                    close={() => setConfirmVisible(false)}
                    confirmDelete={handleDelete}
                    loading={loading}
                />
            )}
            {fetching && (
                <div className="fixed inset-0 flex flex-col md:left-1/5 items-center justify-center bg-white/70 z-50">
                    <span className="w-8 h-8 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></span>
                    <span className="mt-2 text-gray-700 text-sm font-medium">Loading Customers...</span>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-bold text-gray-800 uppercase">Customers</h1>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                        {filtered.length} records
                    </span>
                    {/* Refresh Button */}
                    <button
                        onClick={fetchCustomers}
                        disabled={fetching}
                        className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    >
                        {fetching ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by name, email, mobile or status..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="px-3 py-2 border rounded-md w-full md:w-1/2 focus:ring-1 focus:ring-gray-400"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-md text-xs">
                <table className="w-full min-w-full text-left">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            {["Name", "Email", "Mobile", "Gender", "Role", "Status", "Actions"].map(h => (
                                <th key={h} className="px-3 py-2 uppercase text-xs">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(c => (
                            <tr key={c._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                                <td className="px-3 py-2 font-medium">{c.fullName}</td>
                                <td className="px-3 py-2">{c.email}</td>
                                <td className="px-3 py-2">+1 {c.mobileNumber}</td>
                                <td className="px-3 py-2">{c.gender}</td>
                                <td className="px-3 py-2">
                                    <span className="px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">{c.role}</span>
                                </td>
                                <td className="px-3 py-2">
                                    <span className={`px-2 py-1 rounded-full text-xs ${c.status === "blocked" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-3 py-2 flex  text-center">
                                    <RiDeleteBin6Line
                                        size={20}
                                        className="cursor-pointer text-gray-500 hover:text-red-600 transition"
                                        onClick={() => {
                                            setCustomerToDelete(c._id);
                                            setConfirmVisible(true);
                                        }}
                                    />
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-3 py-8 text-center text-gray-500">
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
