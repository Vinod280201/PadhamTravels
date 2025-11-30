import { BiPhoneCall } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { BsFacebook, BsLinkedin } from "react-icons/bs";
import { FaWhatsapp, FaInstagram, FaThreads } from "react-icons/fa6";

export const TopBarContactUs = () => {
  return (
     // hide on small devices, show from md and up:
      <div className="hidden lg:block">
        <div className="grid grid-cols-2 gap-2">
            <div className='flex justify-center h-14'>
                <div className='flex items-center'>
                    <BiPhoneCall size={20}/>
                    <p className='text-sm ml-1.5'>+91 99442 29209</p>
                    <MdEmail size={20} className='ml-6'/>
                    <p className='text-sm ml-1.5'>padhamtravel@gmail.com</p>
                </div>
            </div>
            <div className='flex justify-center ml-8 items-center h-14'>
                    <a href="https://whatsapp.com/channel/0029VbBqia1Fi8xiWsa9pv1r" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
                        <FaWhatsapp  size={20}/>
                    </a> 
                    <a href="https://www.instagram.com/padham_travels?igsh=dHkxbnB0aHdiZHIz" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
                        <FaInstagram size={20} className='ml-5'/>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
                        <BsFacebook size={20} className='ml-5'/>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
                        <FaThreads size={20} className='ml-5'/>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500">
                        <BsLinkedin size={20} className='ml-5'/>
                    </a>    
            </div>
        </div>
    </div>
  );
}