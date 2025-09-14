import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Pricing() {
    const [activeTab, setActiveTab] = useState("haircuts");


    const pricingData = {
        haircuts: [
            { title: "Ladies’ long Haircuts", price: "8000.00 LKR" },
            { title: "Bob cuts & pixie cuts", price: "9500.00 LKR" },
            { title: "Ladies hair trim", price: "3000.00 LKR" },
            { title: "Gents' Hair cuts (by Master Surith)", price: "2800.00 LKR" },
            { title: "Gents' Haircuts (by assistant)", price: "1900.00 LKR" },
            { title: "Beard Trimming", price: "1000.00 LKR" },
            { title: "Beard shaving", price: "1200.00 LKR" },
            { title: "Ladies' Temporary Hair settings", price: "3500.00 LKR" },
            { title: "Gents' temporary hair settings (by assistant)", price: "1500.00 LKR" },
            { title: "Beard color", price: "1000.00 LKR" },
        ],
        color: [
            { title: "Master Surith’s Expert Hair Coloring", price: "30000.00 LKR" },
            { title: "Senior Assistants’ Hair Coloring", price: "12000.00 LKR" },
            { title: "Gents’ Hair Coloring Services", price: "5000.00 LKR" },
            { title: "Ladies’ Full Hair Root Touch-Ups", price: "7000.00 LKR" },
            { title: "Gents’ Root Touch-Up", price: "3500.00 LKR" },
            { title: "Ladies crown hair root touch up", price: "5000.00 LKR" },
            { title: "Ladies’ Hair Fringe Touch-Up", price: "3000.00 LKR" },
            { title: "Fashion Hair Color Lines", price: "3000.00 LKR" },
        ],
        chemical: [
            { title: "Ladies' Hair Rebounding", price: "14000.00 LKR" },
            { title: "Ladies’ Crown Rebonding", price: "9500.00 LKR" },
            { title: "Ladies Hair Fringe Rebounding", price: "8000.00 LKR" },
            { title: "Ladies hair straightening services", price: "12000.00 LKR" },
            { title: "Ladies' Hair crown straightening", price: "9000.00 LKR" },
            { title: "Ladies’ Hair Fringe Straightening", price: "7500.00 LKR" },
            { title: "Ladies' hair relaxing", price: "10000.00 LKR" },
            { title: "Ladies' hair crown relaxing", price: "8000.00 LKR" },
            { title: "Fringe relaxing", price: "7000.00 LKR" },
            { title: "Gents' hair perming", price: "15000.00 LKR" },
        ],
        extensions: [
            { title: "Itip Method Hair Extensions (New fixing)", price: "0.00 LKR" },
            { title: "Brazilian knot method Hair extensions (New fixing)", price: "0.00 LKR" },
            { title: "Itip hair extensions maintenance (removing, repairing and fixing)", price: "0.00 LKR" },
            { title: "Brazilian Knot Extensions Maintenance", price: "0.00 LKR" },
        ],
    };


    const tabs = [
        { id: "haircuts", label: "Haircuts & Styling" },
        { id: "color", label: "Hair Color Services" },
        { id: "chemical", label: "Ladies hair chemical services" },
        { id: "extensions", label: "Hair extension services" },
    ];

    return (
        <section id="pricing" className="bg-black text-white py-16 px-6 md:px-20">

            <motion.h1
                className="text-4xl font-bold text-center mb-10 uppercase"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                Our Pricing
            </motion.h1>


            <div className="flex justify-center flex-wrap gap-3 mb-10">
                {tabs.map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-2 font-medium transition ${activeTab === tab.id
                            ? "bg-white text-black"
                            : "bg-gray-800 text-white hover:bg-gray-700"
                            }`}
                    >
                        {tab.label}
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    {pricingData[activeTab].map((item, i) => (
                        <motion.div
                            key={i}
                            className="flex justify-between border-b border-gray-700 pb-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.4 }}
                        >
                            <span>{item.title}</span>
                            <span className="font-semibold">{item.price}</span>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>

            <div className="text-center mt-10">
                <motion.a
                    href="#"
                    className="text-sm font-medium text-gray-400 hover:text-white transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    See all prices
                </motion.a>
            </div>
        </section>
    );
}
