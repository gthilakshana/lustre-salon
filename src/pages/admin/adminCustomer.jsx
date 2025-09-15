import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

function CustomerDeleteConfirm({ customerID, close, onDelete }) {
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
                    Are you sure you want to delete customer ID:{" "}
                    <span className="font-bold">{customerID}</span>?
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
                            onDelete(customerID);
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

export default function AdminCustomer() {
    const [customers, setCustomers] = useState([
        {
            _id: "1",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            role: "user",
            status: "active",
        },
        {
            _id: "2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@example.com",
            role: "user",
            status: "blocked",
        },
        {
            _id: "3",
            firstName: "Michael",
            lastName: "Brown",
            email: "michael@example.com",
            role: "user",
            status: "active",
        },
    ]);

    const [search, setSearch] = useState("");
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState(null);

    const filteredCustomers = customers.filter(
        (c) =>
            (c.firstName + " " + c.lastName)
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.status || "").toLowerCase().includes(search.toLowerCase())
    );

    function handleDelete(id) {
        setCustomers(customers.filter((c) => c._id !== id));
    }

    return (
        <div className="w-full min-h-screen bg-white p-6">
            {isDeleteConfirmVisible && (
                <CustomerDeleteConfirm
                    customerID={customerToDelete}
                    close={() => setIsDeleteConfirmVisible(false)}
                    onDelete={handleDelete}
                />
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
                            <th className="px-4 py-3 text-xs font-sm uppercase">ID</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Name</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Email</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Role</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase">Status</th>
                            <th className="px-4 py-3 text-xs font-sm uppercase text-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((c) => (
                                <tr
                                    key={c._id}
                                    className="hover:bg-blue-50 transition"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-600">{c._id}</td>
                                    <td className="px-4 py-3 font-sm uppercase text-gray-800">
                                        {c.firstName} {c.lastName}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{c.email}</td>
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
                                <td
                                    colSpan={6}
                                    className="px-4 py-12 text-center text-gray-500"
                                >
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
