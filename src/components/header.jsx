import { User as UserIcon } from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header({ currentUser }) {
    const sections = ["home", "pricing", "services", "products"]; // team & reviews removed
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(currentUser || null);

    useEffect(() => {
        if (!currentUser) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) setUser(JSON.parse(storedUser));
        }
    }, [currentUser]);

    const handleScroll = (id) => {
        if (location.pathname === `/${id}` || (id === "home" && location.pathname === "/")) {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            navigate(id === "home" ? "/" : `/${id}`);
        }
    };

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
                            className="hover:text-red-600 cursor-pointer"
                        >
                            HOME
                        </button>

                        <button
                            onClick={() => navigate("/about")}
                            className="hover:text-red-600 cursor-pointer"
                        >
                            ABOUT
                        </button>

                        {sections.slice(1).map((sec) => (
                            <button
                                key={sec}
                                onClick={() => handleScroll(sec)}
                                className="hover:text-red-600 cursor-pointer"
                            >
                                {sec.toUpperCase()}
                            </button>
                        ))}

                        <button
                            onClick={() => navigate("/contact")}
                            className="hover:text-red-600 cursor-pointer"
                        >
                            CONTACT
                        </button>
                    </nav>
                </div>

                <div className="flex items-center space-x-3">
                    <Link
                        to="/appointment"
                        className="border border-white px-4 py-2 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-500"
                    >
                        BOOK NOW
                    </Link>

                    {user && user.fullName && user.role === "user" ? (
                        <span
                            onClick={() => navigate("/user")}
                            className="cursor-pointer text-white font-semibold flex items-center space-x-2 truncate max-w-[150px]"
                            title={user.fullName}
                        >
                            <UserIcon size={20} />
                            <span>{user.fullName.charAt(0).toUpperCase()}</span>
                        </span>
                    ) : (
                        <Link
                            to="/login"
                            className="border border-white p-2 cursor-pointer hover:bg-white hover:text-black transition-colors duration-500 inline-flex items-center justify-center"
                        >
                            <UserIcon size={20} />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
