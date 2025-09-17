import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";


function MessageDeleteConfirm({ messageID, close, onDelete }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-center px-4">
            <div className="bg-white shadow-2xl relative max-w-sm w-full p-6 flex flex-col items-center gap-6 rounded-md">
                <button
                    onClick={close}
                    className="absolute -top-5 -right-5 w-10 h-10 bg-red-600 rounded-full text-white flex justify-center items-center shadow-lg hover:bg-white hover:text-red-600 transition"
                >
                    <FaTimes />
                </button>

                <FaExclamationTriangle className="text-yellow-500 text-4xl" />

                <p className="text-center text-gray-800 font-semibold text-lg">
                    Are you sure you want to delete message ID:{" "}
                    <span className="font-bold">{messageID}</span>?
                </p>

                <div className="flex gap-4 mt-2">
                    <button
                        onClick={close}
                        className="px-4 py-2 w-[100px] bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onDelete(messageID);
                            close();
                        }}
                        className="px-4 py-2 w-[100px] bg-red-600 text-white font-medium hover:bg-red-700 transition rounded-md"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminMessage() {
    const [messages, setMessages] = useState([]);
    const [search, setSearch] = useState("");
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [loading, setLoading] = useState(true);


    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/messages");
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
            toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);


    const handleDelete = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/messages/${id}`);
            toast.success("Message deleted successfully");
            setMessages(messages.filter((m) => m._id !== id));
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete message");
        }
    };

    const filteredMessages = messages.filter(
        (m) =>
            (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (m.email || "").toLowerCase().includes(search.toLowerCase()) ||
            (m.subject || "").toLowerCase().includes(search.toLowerCase()) ||
            (m.message || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full min-h-screen bg-white p-6">
            {isDeleteConfirmVisible && (
                <MessageDeleteConfirm
                    messageID={messageToDelete}
                    close={() => setIsDeleteConfirmVisible(false)}
                    onDelete={handleDelete}
                />
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 uppercase">Messages</h1>
                <span className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-2xl">
                    {filteredMessages.length} Messages
                </span>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search messages..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-3 border rounded-md focus:ring-1 focus:ring-gray-400 outline-none"
                />
            </div>


            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <span className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
                    <table className="w-full min-w-[800px] text-left">
                        <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Contact Number</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredMessages.length > 0 ? (
                                filteredMessages.map((m) => (
                                    <tr key={m._id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-3 font-medium text-red-700 bg-red-100 rounded-l-md text-center">
                                            <span className="block text-xs font-normal text-red-800">Date:</span>
                                            <span className="block">
                                                {new Date(m.createdAt).toLocaleDateString("en-GB", {
                                                    timeZone: "Asia/Colombo",
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "2-digit",
                                                })}
                                            </span>
                                            <br />
                                            <span className="block text-xs font-normal text-red-800 mt-1">Time:</span>
                                            <span className="block">
                                                {new Date(m.createdAt).toLocaleTimeString("en-US", {
                                                    timeZone: "Asia/Colombo",
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                    hour12: true,
                                                })}
                                            </span>
                                        </td>

                                        <td className="px-6 py-3 text-gray-800 font-medium">{m.name}</td>
                                        <td className="px-6 py-3 text-gray-700">{m.email}</td>
                                        <td className="px-6 py-3 text-gray-700">{m.contactNumber}</td>
                                        <td className="px-6 py-3 text-gray-700">{m.subject}</td>
                                        <td className="px-6 py-3 text-gray-700">{m.message}</td>
                                        <td className="px-6 py-3 text-center">
                                            <button
                                                onClick={() => {
                                                    setMessageToDelete(m._id);
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
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No messages to display.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
