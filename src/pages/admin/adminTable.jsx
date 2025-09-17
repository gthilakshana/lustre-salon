import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import AdminAdd from "./adminAdd";
import AdminUpdate from "./adminUpdate";
import axios from "axios";
import toast from "react-hot-toast";


function AdminDeleteConfirm({ adminID, close, confirmDelete, loading }) {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-center px-4">
            <div className="bg-white shadow-2xl relative max-w-sm w-full p-6 flex flex-col items-center gap-6 rounded-md animate-fadeIn">
                <button
                    onClick={close}
                    disabled={loading}
                    className="absolute -top-5 -right-5 w-10 h-10 bg-red-600 rounded-full text-white flex justify-center items-center shadow-lg hover:bg-white hover:text-red-500 transition disabled:opacity-50"
                >
                    <FaTimes />
                </button>

                <FaExclamationTriangle className="text-yellow-500 text-4xl" />
                <p className="text-center text-gray-800 font-semibold text-lg">
                    Are you sure you want to delete admin ID:{" "}
                    <span className="font-bold">{adminID}</span>?
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
                        onClick={() => confirmDelete(adminID)}
                        disabled={loading}
                        className="px-4 py-2 w-[100px] bg-red-600 text-white font-medium hover:bg-red-700 transition rounded-md flex items-center justify-center disabled:opacity-50"
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

export default function AdminTable() {
    const [search, setSearch] = useState("");
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [adminToUpdate, setAdminToUpdate] = useState(null);

    const currentUserRole = localStorage.getItem("role");

    const fetchAdmins = async () => {
        try {
            setFetching(true);
            const start = Date.now();

            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/users");
            const adminUsers = res.data.filter((u) => u.role === "admin");
            setAdmins(adminUsers);


            const elapsed = Date.now() - start;
            if (elapsed < 1000) {
                setTimeout(() => setFetching(false), 2000 - elapsed);
            } else {
                setFetching(false);
            }
        } catch (err) {
            console.error("Failed to fetch admins:", err);
            toast.error("Failed to load admins");
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`);
            toast.success("Admin deleted successfully");
            setAdmins(admins.filter((a) => a._id !== id));
            setIsDeleteConfirmVisible(false);
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete admin");
        } finally {
            setLoading(false);
        }
    };

    const filteredAdmins = admins.filter(
        (c) =>
            (c.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
            (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
            (c.mobileNumber || "").toLowerCase().includes(search.toLowerCase()) ||
            (c.gender || "").toLowerCase().includes(search.toLowerCase()) ||
            (c.status || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="w-full min-h-screen bg-white p-6 relative">
            {isDeleteConfirmVisible && (
                <AdminDeleteConfirm
                    adminID={adminToDelete}
                    close={() => setIsDeleteConfirmVisible(false)}
                    confirmDelete={handleDelete}
                    loading={loading}
                />
            )}

            {isUpdateOpen && adminToUpdate && (
                <AdminUpdate
                    isOpen={isUpdateOpen}
                    onClose={() => setIsUpdateOpen(false)}
                    admin={adminToUpdate}
                    refresh={fetchAdmins}
                    loading={loading}
                />
            )}


            {fetching && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
                    <span className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 uppercase">Admins</h1>
                <span className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-2xl">
                    {filteredAdmins.length} Admins
                </span>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search admins..."
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
                            <th className="px-4 py-3 text-xs font-sm uppercase">Gender</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Role</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Status</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase text-center">Actions</th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredAdmins.length > 0 ? (
                            filteredAdmins.map((c) => (
                                <tr key={c._id} className="hover:bg-blue-50 transition">
                                    <td className="px-4 py-3 font-sm uppercase text-gray-800">
                                        {c.fullName}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{c.email}</td>
                                    <td className="px-4 py-3 text-gray-700">
                                        +94 {c.mobileNumber}
                                    </td>

                                    <td className="px-4 py-3 text-gray-700">{c.gender}</td>

                                    <td className="px-4 py-3">
                                        <span className="px-2.5 py-1 rounded-md text-xs font-sm bg-gray-100 text-gray-700">
                                            {c.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2.5 py-1 rounded-md text-xs font-sm ${c.status === "active"
                                                ? "bg-blue-300 text-gray-700"
                                                : "bg-red-300 text-red-700"
                                                }`}
                                        >
                                            {c.status}
                                        </span>
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <RiDeleteBin6Line
                                                className="cursor-pointer rounded-lg p-2 text-gray-500 ring-1 ring-gray-300 hover:bg-red-100 hover:text-red-600 transition"
                                                size={34}
                                                onClick={() => {
                                                    setAdminToDelete(c._id);
                                                    setIsDeleteConfirmVisible(true);
                                                }}
                                            />
                                            {currentUserRole === "admin" && (
                                                <FiEdit
                                                    className="cursor-pointer rounded-lg p-2 text-gray-500 ring-1 ring-gray-300 hover:bg-blue-100 hover:text-blue-600 transition"
                                                    size={34}
                                                    onClick={() => {
                                                        setAdminToUpdate(c);
                                                        setIsUpdateOpen(true);
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-gray-500">
                                    No admins to display.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <button
                onClick={() => setIsAddOpen(true)}
                className="fixed right-[50px] bottom-[50px] text-5xl text-black hover:text-gray-800 cursor-pointer transition-colors duration-200"
            >
                <CiCirclePlus />
            </button>

            <AdminAdd
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                refresh={fetchAdmins}


            />


        </div>
    );
}
