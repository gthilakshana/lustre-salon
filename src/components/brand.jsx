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
    <section className="relative bg-white py-4 px-4 w-full h-[120px] sm:h-[150px] md:h-[180px] overflow-hidden flex items-center">


      <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />


      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
        className="w-full"
      >
        <div className="flex gap-4 sm:gap-8 animate-smoothScroll items-center">
          {[...logos, ...logos].map((logo, idx) => (
            <div key={idx} className="flex-shrink-0">
              <img
                src={logo}
                alt="Brand Logo"
                className="h-12 w-24 sm:h-20 sm:w-40 md:h-32 md:w-48 object-contain opacity-60 filter grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-500"
              />
            </div>
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
