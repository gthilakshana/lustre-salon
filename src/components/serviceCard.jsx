import { useNavigate } from "react-router-dom";

export default function ServiceCard({ image, name, title, price, comingSoon }) {
    const navigate = useNavigate();

    const displayName = name || title;
    const handleClick = () => {
        if (comingSoon) return;

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            navigate("/dateAndTimeSelect", { state: { employee: name, title, price } });
        } else {
            navigate("/login");
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
                relative border rounded-lg shadow-sm p-3 sm:p-4 flex flex-col items-center text-center
                hover:shadow-md transition-all duration-300
                ${comingSoon ? "cursor-not-allowed" : "cursor-pointer"}
            `}
        >
            {comingSoon && (
                <div className="absolute -top-2 flex justify-center w-full">
                    <div className="bg-red-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 shadow-md rounded-md">
                        Coming Soon
                    </div>
                </div>
            )}

            {/* Image */}
            <div className="w-32 h-32 sm:w-44 sm:h-44 md:w-48 md:h-48 flex items-center justify-center overflow-hidden rounded-md mt-2">
                <img
                    src={image}
                    alt={displayName}
                    className={`object-cover w-full h-full rounded-md ${comingSoon ? "opacity-50" : ""}`}
                />
            </div>

            {/* Name */}
            <h3 className={`mt-3 text-sm sm:text-base md:text-lg font-semibold ${comingSoon ? "text-gray-400" : "text-black"}`}>
                {displayName}
            </h3>

            {/* Price */}
            {price && (
                <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1">
                    {price}
                </p>
            )}
        </div>
    );
}
