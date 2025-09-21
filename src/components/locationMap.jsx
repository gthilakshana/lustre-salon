// src/components/LocationMap.jsx
export default function LocationMap({
    lat = 6.9271,     // Default: Colombo latitude
    lng = 79.8612,    // Default: Colombo longitude
    address
}) {
    // Make sure the query is URL safe (replace spaces with +)
    const query = address
        ? encodeURIComponent(address)
        : `${lat},${lng}`; // fallback to coordinates if no address

    return (
        <div className="w-full h-full">
            <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                    }&q=${query}`}
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" // ✅ good practice
            />

            {address && (
                <p className="text-center text-gray-700 mt-4 text-sm md:text-base">
                    📍 {address}
                </p>
            )}
        </div>
    );
}
