import { BiPhoneCall } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { BsFacebook, BsLinkedin } from "react-icons/bs";
import { FaWhatsapp, FaInstagram, FaThreads } from "react-icons/fa6";

export const TopBarContactUs = () => {
  return (
    // hide on small devices, show from md and up:
    <div className="hidden lg:block overflow-x-hidden text-slate-800">
      <div className="grid grid-cols-2 gap-2">
        {/* Left Side: Contact Info */}
        <div className="flex justify-center h-14 items-center">
          {/* Phone Link */}
          <a
            href="tel:+919944229209"
            className="flex items-center group hover:text-yellow-500 transition-colors duration-300"
            title="Call Us"
          >
            <BiPhoneCall
              size={20}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <p className="text-sm ml-1.5 font-medium">+91 99442 29209</p>
          </a>

          {/* Email Link */}
          <a
            href="mailto:info@padhamtravel.com"
            className="flex items-center ml-6 group hover:text-yellow-500 transition-colors duration-300"
            title="Email Us"
          >
            <MdEmail
              size={20}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <p className="text-sm ml-1.5 font-medium">info@padhamtravel.com</p>
          </a>
        </div>

        {/* Right Side: Social Icons */}
        <div className="flex justify-center ml-8 items-center h-14 gap-5">
          <a
            href="https://whatsapp.com/channel/0029VbBqia1Fi8xiWsa9pv1r"
            target="_blank"
            rel="noopener noreferrer"
            // WhatsApp Brand Green
            className="hover:text-green-500 hover:-translate-y-1 transition-all duration-300"
          >
            <FaWhatsapp size={20} />
          </a>
          <a
            href="https://www.instagram.com/padham_travels?igsh=dHkxbnB0aHdiZHIz"
            target="_blank"
            rel="noopener noreferrer"
            // Instagram Brand Pink
            className="hover:text-pink-600 hover:-translate-y-1 transition-all duration-300"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            // Facebook Brand Blue
            className="hover:text-blue-600 hover:-translate-y-1 transition-all duration-300"
          >
            <BsFacebook size={20} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            // Threads Brand Black
            className="hover:text-black hover:-translate-y-1 transition-all duration-300"
          >
            <FaThreads size={20} />
          </a>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            // LinkedIn Brand Blue
            className="hover:text-blue-700 hover:-translate-y-1 transition-all duration-300"
          >
            <BsLinkedin size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};
