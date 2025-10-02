
export default function LocationMap({
    lat = 6.9271,
    lng = 79.8612,
    address
}) {

    const query = address
        ? encodeURIComponent(address)
        : `${lat},${lng}`;

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
                referrerPolicy="no-referrer-when-downgrade"
            />

            {address && (
                <p className="text-center text-gray-700 mt-4 text-sm md:text-base">
                    📍 {address}
                </p>
            )}
        </div>
    );
}
