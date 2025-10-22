import React from "react";

export default function RevenueCard({ label, value, icon: Icon, bgColor }) {
    return (
        <div className={`p-5 shadow-md rounded-xl ${bgColor} text-gray-700 hover:shadow-lg transition-all duration-300`}>
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-white/70 rounded-lg">
                    <Icon className="text-base" />
                </div>
                <h3 className="font-semibold text-sm uppercase tracking-wide">{label}</h3>
            </div>
            <p className="text-3xl font-bold tracking-tight">
                ${value?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
        </div>
    );
}
