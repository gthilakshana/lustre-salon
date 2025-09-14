import { useEffect, useState } from "react";
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


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
        window.history.replaceState(null, "", "#home");
    }, []);


    useEffect(() => {
        const handleScroll = () => setShowScrollButton(window.scrollY > 200);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


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
        <>
            <Header />

            <div className="min-h-screen w-full flex flex-col overflow-hidden">
                <main className="flex-1 mt-16 md:mt-22">
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

                {showScrollButton && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-0 right-6 z-50 cursor-pointer bg-black hover:bg-gray-900 text-white p-3 shadow-lg transition"
                        aria-label="Scroll to top"
                    >
                        <FaArrowUp />
                    </button>
                )}
            </div>
        </>
    );
}
