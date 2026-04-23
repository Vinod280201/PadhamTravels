import Logo from "@/assets/logo.png";
import { BiPhoneCall } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { BsFacebook, BsLinkedin } from "react-icons/bs";
import { FaWhatsapp, FaInstagram, FaThreads } from "react-icons/fa6";

export const Footer = () => {
  return (
    <footer className="w-full bg-slate-700 text-white">
      <div className="max-w-7xl mx-auto px-6 py-10 md:px-8">
        {/* grid: 1 column mobile, 2 columns tablet, 4 columns desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {/* Column 1 - Logo + About */}
          <div className="flex flex-col gap-4 lg:ml-8">
            <img
              src={Logo}
              alt="Padham Travels logo"
              className="w-36 h-auto mx-auto md:mx-0"
            />
            <p className="text-sm leading-relaxed text-gray-200">
              Padham Travels is the versatile website empowering you — a
              full-service travel company offering competitive fares and great
              customer support.
            </p>

            <div>
              <p className="flex justify-center sm:block font-medium text-yellow-500 mb-3">
                Follow Us
              </p>
              <div className="flex gap-4 items-center justify-center md:justify-start text-xl text-gray-200">
                <a
                  href="https://whatsapp.com/channel/0029VbBqia1Fi8xiWsa9pv1r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-500 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="https://www.instagram.com/padham_travels?igsh=dHkxbnB0aHdiZHIz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-500 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-500 hover:-translate-y-1 transition-all duration-300"
                >
                  <BsFacebook />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-500 hover:-translate-y-1 transition-all duration-300"
                >
                  <FaThreads />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-500 hover:-translate-y-1 transition-all duration-300"
                >
                  <BsLinkedin />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2 - Get In Touch */}
          <div className="flex flex-col gap-4 md:ml-12 md:mt-10">
            <h2 className="font-bold text-xl text-yellow-500">Get In Touch</h2>
            <div className="flex items-start gap-3">
              <BiPhoneCall size={20} className="mt-1.5 text-yellow-400" />
              <div>
                <a
                  href="tel:+91 99442 29209"
                  className="text-sm hover:text-yellow-400 transition-colors"
                >
                  +91 99442 29209
                </a>
                <p className="text-xs text-gray-300">
                  Call us for bookings & support
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MdEmail size={20} className="mt-1.5 text-yellow-400" />
              <div>
                <a
                  href="mailto:info@padhamtravel.com"
                  className="text-sm hover:text-yellow-400 transition-colors"
                >
                  info@padhamtravel.com
                </a>
                <p className="text-xs text-gray-300">
                  We usually reply within 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* Column 3 - Policies */}
          <div className="flex flex-col gap-3 md:ml-12 md:pl-6 md:mt-10">
            <h2 className="font-bold text-xl text-yellow-500">Policies</h2>
            <nav className="flex flex-col gap-2 text-sm text-gray-200">
              <a
                href="/terms-and-conditions"
                className="hover:text-yellow-400 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="/terms-and-conditions"
                className="hover:text-yellow-400 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-and-conditions"
                className="hover:text-yellow-400 transition-colors"
              >
                Refund Policy
              </a>
            </nav>
          </div>

          {/* Column 4 - Quick Links */}
          <div className="flex flex-col gap-3 md:pl-6 md:mt-10">
            <h2 className="font-bold text-xl text-yellow-500">Quick Links</h2>
            <nav className="flex flex-col gap-2 text-sm text-gray-200">
              <a
                href="/about-us"
                className="hover:text-yellow-400 transition-colors"
              >
                About Us
              </a>
              <a
                href="/about-us#contact"
                className="hover:text-yellow-400 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/flights"
                className="hover:text-yellow-400 transition-colors"
              >
                Flights
              </a>
              <a
                href="/tours-and-packages"
                className="hover:text-yellow-400 transition-colors"
              >
                Tours & Trips
              </a>
            </nav>
          </div>
        </div>

        {/* bottom bar */}
        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-300">
          <p>
            &copy; 2025. All rights reserved by{" "}
            <span className="text-yellow-500 font-medium">Padham Travels</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};
