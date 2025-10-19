import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import axios from "axios";
import { ShowToast } from "../../components/lustreToaster";
import AdminServiceAdd from "./adminServiceAdd";
import AdminServiceUpdate from "./adminServiceUpdate";

// Loader Component
function PageLoader() {
    return (
        <div className="fixed inset-0 flex flex-col md:left-1/5 items-center justify-center bg-white/70 z-50">
            <span className="w-8 h-8 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></span>
            <span className="mt-2 text-gray-700 text-sm font-medium">Loading Services...</span>
        </div>
    );
}

// Delete confirm modal
function ServiceDeleteConfirm({ serviceID, close, confirmDelete, loading }) {
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
                <p className="text-center text-sm text-gray-700 mb-4">
                    Are you sure you want to delete service:
                    <span className="block font-semibold mt-1 text-gray-900">{serviceID}</span>
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
                        onClick={() => confirmDelete(serviceID)}
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

export default function AdminService() {
    const [services, setServices] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [serviceToUpdate, setServiceToUpdate] = useState(null);


    const formatCurrency = (amount) => {

        if (amount === null || amount === undefined || amount === "") {
            return "-";
        }

        const numberAmount = Number(amount);
        if (isNaN(numberAmount)) {
            return "-";
        }

        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',

            minimumFractionDigits: 2,
        }).format(numberAmount);
    };
    // -----------------------------------------------------------


    const fetchServices = async () => {
        try {
            setFetching(true);
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/services`);
            setServices(res.data);
        } catch (err) {
            console.error(err);
            ShowToast("error", "Failed to load services", "Please try again or contact support.");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);


    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/services/${id}`);
            ShowToast("success", "Service deleted");
            setServices(prev => prev.filter(s => s._id !== id));
            setConfirmVisible(false);
        } catch {
            ShowToast("error", "Delete failed", "Please try again or contact support.");
        } finally {
            setLoading(false);
        }
    };

    // Filtered services
    const filtered = services.filter(s => {
        const term = search.toLowerCase();
        const matchSearch =
            (s.serviceName || "").toLowerCase().includes(term) ||
            (s.subName || "").toLowerCase().includes(term) ||
            (s.description || "").toLowerCase().includes(term);
        const matchStatus = statusFilter === "All" || s.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const statusColor = (status) =>
        status === "Active" ? "text-green-600" :
            status === "Inactive" ? "text-red-600" : "text-yellow-600";

    return (
        <div className="w-full  text-sm relative">
            {confirmVisible && (
                <ServiceDeleteConfirm
                    serviceID={serviceToDelete}
                    close={() => setConfirmVisible(false)}
                    confirmDelete={handleDelete}
                    loading={loading}
                />
            )}

            {isUpdateOpen && serviceToUpdate && (
                <AdminServiceUpdate
                    isOpen={isUpdateOpen}
                    onClose={() => setIsUpdateOpen(false)}
                    service={serviceToUpdate}
                    refresh={fetchServices}
                />
            )}

            {fetching && <PageLoader />}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-bold text-gray-800 uppercase">Services</h1>
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-red-500 text-white rounded-full">
                        {filtered.length} records
                    </span>
                    <button
                        onClick={fetchServices}
                        disabled={fetching}
                        className="px-3 py-1.5 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                    >
                        {fetching ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by name, category, description..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="px-3 py-2 border rounded-md w-full md:w-1/2 focus:ring-1 focus:ring-gray-400"
                />
                <div className="flex gap-2 flex-wrap">
                    {["All", "Active", "Inactive", "Pending"].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-md border text-xs font-medium transition
                                ${statusFilter === status
                                    ? status === "Active"
                                        ? "bg-green-600 text-white"
                                        : status === "Inactive"
                                            ? "bg-red-600 text-white"
                                            : "bg-yellow-500 text-black"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-md text-xs">
                <table className="w-full  text-left">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            {["Category", "Service Name", "Price", "Description", "Status", "Actions"].map(h => (
                                <th key={h} className="px-3 py-2 uppercase text-xs">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? filtered.map(s => (
                            <tr key={s._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                                <td className="px-3 py-2">{s.subName || "-"}</td>
                                <td className="px-3 py-2">{s.serviceName || "-"}</td>
                                <td className="px-3 py-2 font-mono">{formatCurrency(s.price)}</td>
                                <td className="px-3 py-2">{s.description || "-"}</td>
                                <td className={`px-3 py-2 font-medium ${statusColor(s.status)}`}>{s.status || "-"}</td>
                                <td className="px-3 py-2 text-center flex items-center justify-center gap-1">
                                    <RiDeleteBin6Line
                                        size={20}
                                        className="cursor-pointer text-gray-500 hover:text-red-600 transition"
                                        onClick={() => {
                                            setServiceToDelete(s._id);
                                            setConfirmVisible(true);
                                        }}
                                    />
                                    <FiEdit
                                        size={20}
                                        className="cursor-pointer text-gray-500 hover:text-blue-600 transition"
                                        onClick={() => {
                                            setServiceToUpdate(s);
                                            setIsUpdateOpen(true);
                                        }}
                                    />
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className="px-3 py-8 text-center text-gray-500">
                                    No services found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Button */}
            <button
                onClick={() => setIsAddOpen(true)}
                className="fixed right-[50px] bottom-[50px] flex items-center justify-center w-12 h-12 rounded-full bg-black text-white text-4xl shadow-lg hover:bg-white hover:text-black transition"
            >
                <CiCirclePlus />
            </button>

            <AdminServiceAdd
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                refresh={fetchServices}
            />
        </div>
    );
}
