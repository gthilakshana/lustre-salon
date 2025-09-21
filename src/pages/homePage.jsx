import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import Header from "../components/header";
import Footer from "../components/footer";
import Services from "../components/services";
import Product from "../components/product";
import Pricing from "../components/pricing";
import Reviews from "../components/reviews";
import Team from "../components/team";
import HomeView from "../components/homeView";

export default function HomePage({ section }) {
    const [showScrollButton, setShowScrollButton] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const handleScroll = () => setShowScrollButton(window.scrollY > 200);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    useEffect(() => {
        const id = section || "home";
        const el = document.getElementById(id);
        if (el) {
            setTimeout(() => {
                el.scrollIntoView({ behavior: "smooth" });
            }, 50);
        }
    }, [section]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        navigate("/");
    };


    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        navigate(id === "home" ? "/" : `/${id}`);
    };

    return (
        <>
            <Header scrollToSection={scrollToSection} />

            <div className="min-h-screen w-full flex flex-col overflow-hidden">
                <main className="flex-1 mt-16 md:mt-22">
                    <section id="home"><HomeView /></section>
                    <section id="pricing"><Pricing /></section>
                    <section id="services"><Services /></section>
                    <section id="products"><Product /></section>
                    <section id="team"><Team /></section>
                    <section id="reviews"><Reviews /></section>
                </main>

                <Footer />

                {showScrollButton && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-0 right-6 z-50 cursor-pointer bg-black hover:bg-gray-900 text-white p-3  shadow-lg transition"
                        aria-label="Scroll to top"
                    >
                        <FaArrowUp />
                    </button>
                )}
            </div>
        </>
    );
}
