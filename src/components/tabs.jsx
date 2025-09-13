export default function Tabs({ tabs, activeTab, setActiveTab }) {
    return (
        <div className="flex justify-center flex-wrap gap-3 mb-6">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-2 w-[200px] h-[50px]  font-medium transition uppercase cursor-pointer ${activeTab === tab.id
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
