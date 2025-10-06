import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import { ShowToast } from "../../components/lustreToaster";

// Loader Component
function PageLoader() {
    return (
        <div className="fixed inset-0 flex flex-col md:left-1/5 items-center justify-center bg-white/70 z-50">
            <span className="w-8 h-8 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></span>
            <span className="mt-2 text-gray-700 text-sm font-medium">Loading Massages...</span>
        </div>
    );
}

// Delete confirmation modal
function MessageDeleteConfirm({ messageID, close, confirmDelete, loading }) {
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
                    Are you sure you want to delete message:
                    <span className="block font-semibold mt-1 text-gray-900">{messageID}</span>
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
                        onClick={() => confirmDelete(messageID)}
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

export default function AdminMessage() {
    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);

    // Fetch messages
    const fetchMessages = async () => {
        try {
            setFetching(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/messages`);
            setMessages(res.data);
        } catch (err) {
            console.error(err);
            ShowToast("error", "Failed to load messages", "Please try again or contact support.");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/messages/${id}`);
            ShowToast("success", "Message deleted");
            setMessages(prev => prev.filter(m => m._id !== id));
            setConfirmVisible(false);
        } catch {
            ShowToast("error", "Delete failed", "Please try again or contact support.");
        } finally {
            setLoading(false);
        }
    };

    const filtered = messages.filter(m =>
        (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (m.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (m.subject || "").toLowerCase().includes(search.toLowerCase()) ||
        (m.message || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full text-sm relative">
            {confirmVisible && (
                <MessageDeleteConfirm
                    messageID={messageToDelete}
                    close={() => setConfirmVisible(false)}
                    confirmDelete={handleDelete}
                    loading={loading}
                />
            )}

            {fetching && <PageLoader />}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-bold text-gray-800 uppercase">Messages</h1>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                        {filtered.length} records
                    </span>
                    <button
                        onClick={fetchMessages}
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
                    placeholder="Search by name, email, subject, or message..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="px-3 py-2 border rounded-md w-full md:w-1/2 focus:ring-1 focus:ring-gray-400"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-md">
                <table className="w-full  text-left">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            {["Date", "Name", "Email", "Contact", "Subject", "Message", "Actions"].map(h => (
                                <th key={h} className="px-3 py-2 uppercase text-xs">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(m => (
                            <tr key={m._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                                <td className="px-3 py-2">
                                    {new Date(m.createdAt).toLocaleDateString()} <br />
                                    {new Date(m.createdAt).toLocaleTimeString()}
                                </td>
                                <td className="px-3 py-2">{m.name}</td>
                                <td className="px-3 py-2">{m.email}</td>
                                <td className="px-3 py-2">{m.contactNumber || "-"}</td>
                                <td className="px-3 py-2">{m.subject}</td>
                                <td className="px-3 py-2">{m.message}</td>
                                <td className="px-3 py-2 text-center">
                                    <RiDeleteBin6Line
                                        size={20}
                                        className="cursor-pointer text-gray-500 hover:text-red-600 transition"
                                        onClick={() => {
                                            setMessageToDelete(m._id);
                                            setConfirmVisible(true);
                                        }}
                                    />
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                                    No messages found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
