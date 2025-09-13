export default function Calendar({ selectedDate, setSelectedDate }) {
    return (
        <div className="bg-gray-50 p-6 rounded-xl shadow-md w-full">
            <h3 className="font-semibold mb-4">Select Date</h3>
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
        </div>
    );
}