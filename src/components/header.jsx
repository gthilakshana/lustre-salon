import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function Header() {
    const sections = ["home", "pricing", "services", "products", "reviews"];
    const [activeSection, setActiveSection] = useState("home");

    const navigate = useNavigate();
    const location = useLocation();

    const handleScroll = (id) => {
        if (location.pathname !== "/") {
            navigate("/#" + id);
        } else {
            const section = document.getElementById(id);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
                setActiveSection(id);
                window.history.pushState(null, "", `#${id}`);
            }
        }
    };

    useEffect(() => {
        if (location.pathname !== "/") return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { threshold: 0.6 }
        );

        sections.forEach((id) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => {
            sections.forEach((id) => {
                const section = document.getElementById(id);
                if (section) observer.unobserve(section);
            });
        };
    }, [location.pathname]);

    return (
        <header className="fixed top-0 w-full z-50 bg-black text-white">
            <div className="w-full mx-auto flex items-center justify-between px-8 py-1">
                <div className="flex justify-start">
                    <Link to="/">
                        <img
                            src="/LUSTRE.png"
                            alt="Salon Logo"
                            className="h-16 md:h-22 w-[200px] object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                        />
                    </Link>
                </div>

                <div className="flex-grow flex justify-center">
                    <nav className="hidden md:flex space-x-10 font-semibold text-sm">
                        <button
                            onClick={() => handleScroll("home")}
                            className={`hover:text-red-600 `}
                        >
                            HOME
                        </button>

                        <button
                            onClick={() => navigate("/about")}
                            className={`hover:text-red-600 `}
                        >
                            ABOUT
                        </button>

                        {sections.slice(1).map((sec) => (
                            <button
                                key={sec}
                                onClick={() => handleScroll(sec)}
                                className={`hover:text-red-600 `}
                            >
                                {sec.toUpperCase()}
                            </button>
                        ))}

                        <button
                            onClick={() => navigate("/contact")}
                            className={`hover:text-red-600 `}
                        >
                            CONTACT
                        </button>
                    </nav>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="border border-white px-4 py-2 cursor-pointer hover:bg-white hover:text-black transition">
                        BOOK NOW
                    </button>
                    <button className="border border-white p-2 cursor-pointer hover:bg-white hover:text-black transition">
                        <User size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
}
