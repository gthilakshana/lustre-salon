import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function Header() {
    const sections = ["home", "pricing", "services", "products"];
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
                    <nav className="hidden md:flex space-x-10 font-semibold text-sm ">
                        <button
                            onClick={() => handleScroll("home")}
                            className={`hover:text-red-600 cursor-pointer `}
                        >
                            HOME
                        </button>

                        <button
                            onClick={() => navigate("/about")}
                            className={`hover:text-red-600 cursor-pointer`}
                        >
                            ABOUT
                        </button>

                        {sections.slice(1).map((sec) => (
                            <button
                                key={sec}
                                onClick={() => handleScroll(sec)}
                                className={`hover:text-red-600 cursor-pointer`}
                            >
                                {sec.toUpperCase()}
                            </button>
                        ))}

                        <button
                            onClick={() => navigate("/contact")}
                            className={`hover:text-red-600 cursor-pointer`}
                        >
                            CONTACT
                        </button>
                    </nav>
                </div>

                <div className="flex items-center space-x-3">
                    <Link
                        to="/appointment"
                        className="border border-white px-4 py-2 cursor-pointer 
               hover:bg-red-500 hover:text-white 
               active:border-red-500 
               transition-colors duration-500"
                    >
                        BOOK NOW
                    </Link>

                    <Link
                        to="/login"
                        className="border border-white p-2 cursor-pointer 
               hover:bg-white hover:text-black 
               active:border-red-500 
               transition-colors duration-500 inline-flex items-center justify-center"
                    >
                        <User size={20} />
                    </Link>
                </div>


            </div>
        </header>
    );
}
