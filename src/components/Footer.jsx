import Logo from '../assets/logo.png';
import { BiPhoneCall } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { BsFacebook, BsLinkedin } from "react-icons/bs";
import { FaWhatsapp, FaInstagram, FaThreads } from "react-icons/fa6";

export const Footer = () => {
  return (
    <div className='px-40 p-10 mt-15 bg-slate-700'>
        <div className='grid grid-cols-4 gap-2 text-white ml-20'>
            <div>
                <img src= {Logo} alt='Logo' className='w-30 h-23 mb-4 ml-7'/>
                <p className='text-sm'>
                    Padham Travels is the versatile <br /> website emporing you full-service 
                    <br /> airline offering reduce fares
                </p>
                <p className='mt-10 font-medium text-yellow-500'>Follow Us</p>
                <div className='flex h-14 mt-2'>
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

            <div className='ml-5'>
                <h2 className='mt-15 font-bold text-2xl text-yellow-500'>Get In Touch</h2>
                <div className='flex mt-5'>
                    <BiPhoneCall size={20} className='mt-0.5'/>
                    <p className='ml-1.5'>+91 99442 29209</p>
                </div>
                <div className='flex mt-2'>
                    <MdEmail size={20} className='mt-1'/> 
                    <p className='ml-2'>padhamtravel@gmail.com</p>
                </div>
            </div>
            <div className='ml-12'>
                <h2 className='mt-15 font-bold text-2xl text-yellow-500'>Policies</h2>
                    <a href="#" className='block mt-4 '>Terms of Service</a>
                    <a href="#" className='block mt-2 '>Privacy Policy</a>
                    <a href="#" className='block mt-2 '>Refund Policy</a>
            </div>
            <div>
                <h2 className='mt-15 font-bold text-2xl text-yellow-500'>Quick Links</h2>
                    <a href="#" className='block mt-4 '>About Us</a>
                    <a href="#" className='block mt-2 '>Contact Us</a>
                    <a href="#" className='block mt-2 '>Flights</a>
                    <a href="#" className='block mt-2 '>Tours & Trips</a>
            </div>
        </div>
        <div className='border-t border-gray-400 mt-5 pt-4 text-white text-center'>
            <p className='text-sm'>&copy; 2025. All rights reserved by <span className='text-yellow-500 font-medium'> Padham Travels.</span></p>
        </div>
    </div>
  )
}
