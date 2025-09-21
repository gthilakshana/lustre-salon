import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import AdminAdd from "./adminAdd";
import AdminUpdate from "./adminUpdate";
import axios from "axios";
import { ShowToast, LustreToaster } from "../../components/lustreToaster";

function AdminDeleteConfirm({ adminID, close, confirmDelete, loading }) {
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
                <FaExclamationTriangle className="text-yellow-500 text-3xl mx-auto mb-3" />
                <p className="text-center text-sm text-gray-700 mb-4">
                    Are you sure you want to delete admin ID:
                    <span className="block font-semibold mt-1 text-gray-900">{adminID}</span>
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
                        onClick={() => confirmDelete(adminID)}
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






    // Fetch admins
    const fetchAdmins = async () => {
        try {
            setFetching(true);
            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/users");
            setAdmins(res.data.filter((u) => u.role === "admin"));
        } catch (err) {
            console.error(err);
            ShowToast(
                "error",
                "Failed to load admins",
                err.response?.data?.message || "Please try again or contact support."
            );
        } finally {
            setFetching(false);
        }
    };



    useEffect(() => {
        fetchAdmins();
    }, []);

    // Delete admin
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`);
            ShowToast("success", "Admin deleted successfully");
            setAdmins(admins.filter((a) => a._id !== id));
            setIsDeleteConfirmVisible(false);
        } catch (err) {
            console.error(err);
            ShowToast(
                "error",
                "Failed to delete admin",
                err.response?.data?.message || "Please try again or contact support."
            );
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
        <div className="w-full min-h-screen bg-white p-4 text-sm relative">
            {/* Delete Modal */}
            {isDeleteConfirmVisible && (
                <AdminDeleteConfirm
                    adminID={adminToDelete}
                    close={() => setIsDeleteConfirmVisible(false)}
                    confirmDelete={handleDelete}
                    loading={loading}
                />
            )}

            {/* Update Modal */}
            {isUpdateOpen && adminToUpdate && (
                <AdminUpdate
                    isOpen={isUpdateOpen}
                    onClose={() => setIsUpdateOpen(false)}
                    admin={adminToUpdate}
                    refresh={fetchAdmins}
                    loading={loading}
                />
            )}

            {/* Loader */}
            {fetching && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 z-50">
                    <span className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                </div>
            )}

            {/* Header */}

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-bold text-gray-800 uppercase">Admins</h1>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                        {filteredAdmins.length} records
                    </span>
                    <button
                        onClick={fetchAdmins}
                        disabled={fetching}
                        className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition disabled:opacity-50"
                    >
                        {fetching ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>


            {/* Search */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <input
                    type="text"
                    placeholder="Search admins..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-3 py-2 border rounded-md w-full md:w-1/2 focus:ring-1 focus:ring-gray-400"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-md">
                <table className="w-full min-w-[900px] text-left">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            {["Name", "Email", "Mobile", "Gender", "Role", "Status", "Actions"].map(
                                (h) => (
                                    <th key={h} className="px-3 py-2 uppercase text-xs">
                                        {h}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdmins.length > 0 ? (
                            filteredAdmins.map((c) => (
                                <tr
                                    key={c._id}
                                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <td className="px-3 py-2">{c.fullName}</td>
                                    <td className="px-3 py-2">{c.email}</td>
                                    <td className="px-3 py-2">+94 {c.mobileNumber}</td>
                                    <td className="px-3 py-2">{c.gender}</td>
                                    <td className="px-3 py-2">
                                        <span className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700">
                                            {c.role}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2">
                                        <span
                                            className={`px-2 py-1 text-xs rounded-md ${c.status === "active"
                                                ? "bg-green-100 text-gray-700"
                                                : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-2 text-center flex items-center justify-start gap-1">

                                        <RiDeleteBin6Line
                                            size={20}
                                            className="cursor-pointer text-gray-500 hover:text-red-600 transition"
                                            onClick={() => {
                                                setAdminToDelete(c._id);
                                                setIsDeleteConfirmVisible(true);
                                            }}
                                        />

                                        <FiEdit
                                            size={20}
                                            className="cursor-pointer text-gray-500 hover:text-blue-600 transition"
                                            onClick={() => {
                                                setAdminToUpdate(c);
                                                setIsUpdateOpen(true);
                                            }}
                                        />




                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                                    No admins found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Button */}
            <button
                onClick={() => setIsAddOpen(true)}
                className="fixed right-[50px] bottom-[50px] text-4xl text-black hover:text-gray-800 cursor-pointer transition"
            >
                <CiCirclePlus />
            </button>

            {/* Add Modal */}
            <AdminAdd isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} refresh={fetchAdmins} />
        </div>
    );
}
