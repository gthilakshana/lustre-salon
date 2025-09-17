import { useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import axios from "axios";
import toast from "react-hot-toast";
import AdminServiceAdd from "./adminServiceAdd";
import AdminServiceUpdate from "./adminServiceUpdate";

// Delete confirm modal
function ServiceDeleteConfirm({ serviceID, close, confirmDelete, loading }) {
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
                    Are you sure you want to delete service ID:{" "}
                    <span className="font-bold">{serviceID}</span>?
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
                        onClick={() => confirmDelete(serviceID)}
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

export default function AdminService() {
    const [services, setServices] = useState([]);
    const [search, setSearch] = useState("");
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [serviceToUpdate, setServiceToUpdate] = useState(null);
    const [statusFilter, setStatusFilter] = useState("All");

    // Fetch services
    const fetchServices = async () => {
        try {
            setFetching(true);
            const res = await axios.get(import.meta.env.VITE_API_URL + "/api/services");
            setServices(res.data);
        } catch (err) {
            console.error("Failed to fetch services:", err);
            toast.error("Failed to load services");
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Delete service
    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/services/${id}`);
            toast.success("Service deleted successfully");
            setServices(services.filter((s) => s._id !== id));
            setIsDeleteConfirmVisible(false);
        } catch (err) {
            console.error("Delete error:", err);
            toast.error("Failed to delete service");
        } finally {
            setLoading(false);
        }
    };




    // Search filter
    const filteredServices = services.filter((s) => {
        const matchesSearch =
            (s.serviceName || "").toLowerCase().includes(search.toLowerCase()) ||
            (s.subName || "").toLowerCase().includes(search.toLowerCase()) ||
            (s.price || "").toString().includes(search.toLowerCase()) ||
            (s.description || "").toLowerCase().includes(search.toLowerCase());

        const matchesStatus = statusFilter === "All" ? true : s.status === statusFilter;

        return matchesSearch && matchesStatus;
    });


    return (
        <div className="w-full min-h-screen bg-white p-6 relative">
            {isDeleteConfirmVisible && (
                <ServiceDeleteConfirm
                    serviceID={serviceToDelete}
                    close={() => setIsDeleteConfirmVisible(false)}
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

            {fetching && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-50">
                    <span className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                </div>
            )}

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800 uppercase">Services</h1>
                <span className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-2xl">
                    {filteredServices.length} Services
                </span>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search services..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-3 border rounded-md focus:ring-1 focus:ring-gray-400 outline-none"
                />
            </div>


            {/** Toggle button filter by status - start */}
            <div className="flex gap-3 mb-4">
                {["All", "Active", "Inactive", "Pending"].map((status) => {
                    let bgColor = "";
                    let textColor = "text-white";

                    if (statusFilter === status) {
                        switch (status) {
                            case "All":
                                bgColor = "bg-black";
                                break;
                            case "Active":
                                bgColor = "bg-green-600";
                                break;
                            case "Inactive":
                                bgColor = "bg-red-600";
                                break;
                            case "Pending":
                                bgColor = "bg-yellow-500";
                                textColor = "text-black";
                                break;
                        }
                    } else {
                        bgColor = "bg-gray-200 hover:bg-gray-300";
                        textColor = "text-gray-700";
                    }

                    return (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2  font-sm transition ${bgColor} ${textColor}`}
                        >
                            {status}
                        </button>
                    );
                })}
            </div>
            {/** Toggle button filter by status - end */}






            <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] text-left border rounded-lg overflow-hidden">
                    <thead className="bg-gray-900 text-white">
                        <tr>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Category</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Service Name</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Price</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Description</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Status</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredServices.length > 0 ? (
                            filteredServices.map((s) => (
                                <tr key={s._id} className="hover:bg-blue-50 transition">
                                    <td className="px-4 py-3 text-gray-800 font-medium">{s.serviceName}</td>
                                    <td className="px-4 py-3 text-gray-800 font-medium">{s.subName}</td>
                                    <td className="px-4 py-3 text-gray-700">Rs. {s.price}</td>
                                    <td className="px-4 py-3 text-gray-700">{s.description}</td>
                                    <td
                                        className={`px-4 py-3 font-medium text-center ${s.status === "Active"
                                            ? "text-green-600"
                                            : s.status === "Inactive"
                                                ? "text-red-600"
                                                : "text-yellow-600"
                                            }`}
                                    >
                                        {s.status}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-3">
                                            <RiDeleteBin6Line
                                                className="cursor-pointer rounded-lg p-2 text-gray-500 ring-1 ring-gray-300 hover:bg-red-100 hover:text-red-600 transition"
                                                size={34}
                                                onClick={() => {
                                                    setServiceToDelete(s._id);
                                                    setIsDeleteConfirmVisible(true);
                                                }}
                                            />
                                            <FiEdit
                                                className="cursor-pointer rounded-lg p-2 text-gray-500 ring-1 ring-gray-300 hover:bg-blue-100 hover:text-blue-600 transition"
                                                size={34}
                                                onClick={() => {
                                                    setServiceToUpdate(s);
                                                    setIsUpdateOpen(true);
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                                    No services to display.
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

            <AdminServiceAdd
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                refresh={fetchServices}
            />
        </div>
    );
}
