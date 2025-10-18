import { motion } from "framer-motion";

export default function Brand() {
  const logos = [
    "/brands/Jeval.png",
    "/brands/Keune.png",
    "/brands/Loreal.png",
    "/brands/Sothys.png",
    "/brands/Tresemme.png",
    "/brands/Wella.png",
  ];

  return (
    <section className="relative bg-white py-10 px-4 w-full h-[150px] md:h-[180px] overflow-hidden flex items-center">

      {/* Gradient fade edges */}
      <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-gray-50 " />
      <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-gray-50 " />

      {/* Animated scroll */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
      >
        <div className="flex gap-12 animate-smoothScroll items-center">
          {[...logos, ...logos].map((logo, idx) => (
            <img
              key={idx}
              src={logo}
              alt="Brand Logo"
              className="h-24 w-40 md:h-30 md:w-45 object-contain opacity-60 filter grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-500"
            />
          ))}
        </div>
      </motion.div>

      <style jsx>{`
        .animate-smoothScroll {
          display: flex;
          width: max-content;
          animation: smoothScroll 60s linear infinite;
        }

        @keyframes smoothScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
