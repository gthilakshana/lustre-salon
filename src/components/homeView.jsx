import Brand from "./brand";

export default function HomeView() {
    return (
        <div>
            <section className="relative w-full h-screen overflow-hidden">

                <video
                    className="absolute inset-0 w-full h-full object-cover z-0"
                    src="/salon-video.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                />


                <div className="absolute inset-0 bg-black/40 z-10 flex items-center">
                    <div className="max-w-4xl px-6 md:px-16">
                        <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                            Experience the Elegance of <br /> LusTre Salon
                        </h1>
                        <p className="text-gray-200 text-base md:text-lg mt-4 max-w-2xl drop-shadow">
                            Where Expert Care Meets Luxurious Services for a Transformative
                            Beauty Experience in Sri Lanka.
                        </p>
                    </div>
                </div>
            </section>


            <Brand />
        </div>
    );
}
