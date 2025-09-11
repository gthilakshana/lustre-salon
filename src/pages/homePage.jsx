import { useEffect, useState, useRef } from "react";
import { ClipLoader } from "react-spinners";
import { FaArrowUp } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";
import Services from "../components/services";
import Product from "../components/product";
import Pricing from "../components/pricing";
import Reviews from "../components/reviews";
import Team from "../components/team";
import HomeView from "../components/homeView";

export default function HomePage() {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [loadingSections, setLoadingSections] = useState(true);
    const lastScrollY = useRef(0);

    // Scroll button logic
    useEffect(() => {
        const handleScroll = () => setShowScrollButton(window.scrollY > 200);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Loading spinner
    useEffect(() => {
        const timer = setTimeout(() => setLoadingSections(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Scroll to hash
    useEffect(() => {
        const scrollToHash = () => {
            const hash = window.location.hash.substring(1);
            if (hash) {
                const section = document.getElementById(hash);
                if (section) section.scrollIntoView({ behavior: "smooth" });
            }
        };
        scrollToHash();
        window.addEventListener("hashchange", scrollToHash);
        return () => window.removeEventListener("hashchange", scrollToHash);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "#home");
    };

    return (
        <div className="min-h-screen w-full flex flex-col">
            <Header />

            {loadingSections ? (
                <div className="flex-1 flex items-center justify-center bg-white">
                    <ClipLoader color="#000000" loading={loadingSections} size={55} />
                </div>
            ) : (
                <main className="flex-1 mt-20">
                    <section id="home">
                        <HomeView />
                    </section>
                    <section id="pricing">
                        <Pricing />
                    </section>
                    <section id="services">
                        <Services />
                    </section>
                    <section id="products">
                        <Product />
                    </section>
                    <section id="team">
                        <Team />
                    </section>
                    <section id="reviews">
                        <Reviews />
                    </section>
                    <Footer />
                </main>
            )}

            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 z-50 cursor-pointer bg-black hover:bg-gray-900 text-white p-3 shadow-lg transition"
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </button>
            )}
        </div>
    );
}
