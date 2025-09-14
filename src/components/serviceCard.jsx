import { useNavigate } from "react-router-dom";

export default function ServiceCard({ image, name, title, price, comingSoon }) {
    const navigate = useNavigate();

    const displayName = name || title;

    const handleClick = () => {
        if (!comingSoon) {

            navigate("/dateAndTimeSelect", { state: { employee: name, title, price } });
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`relative border shadow-sm p-4 flex flex-col items-center text-center hover:shadow-lg transition ${comingSoon ? "cursor-not-allowed" : "cursor-pointer"
                }`}
        >
            {comingSoon && (
                <div className="absolute top-[-10px] items-center">
                    <div className="bg-red-700 text-white text-xs font-semibold px-6 py-1 shadow-md rounded-md">
                        Coming Soon
                    </div>
                </div>
            )}

            <div className="w-48 h-48 flex items-center justify-center overflow-hidden">
                <img
                    src={image}
                    alt={displayName}
                    className={`object-cover mt-3 w-full h-full ${comingSoon ? "opacity-50" : ""}`}
                />
            </div>

            <h3
                className={`mt-4 text-base font-semibold ${comingSoon ? "text-gray-400" : "text-black"
                    }`}
            >
                {displayName}
            </h3>

            {price && <p className="text-sm text-gray-600 mt-1">{price}</p>}
        </div>
    );
}
