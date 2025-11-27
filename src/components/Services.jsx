import React from 'react'
import CoinImage from '../assets/coin.png'
import DiscountImage from '../assets/discount.png'
import SupportImage from '../assets/support.png'
import ThumpsUpImage from '../assets/thumps up.png'
import IndianRupeeImage from '../assets/rupee.png'

export const Services = () => {
    
  return (
    <div className='h-[80%] ml-25 pt-35 px-25'>
        <div className="grid grid-cols-3 gap-5 h-[80%]">
            <div className='col-span-1'>
                <p className='text-xs'>B E S T &nbsp; &nbsp;C H O I C E</p>
                <p className='text-3xl mt-1'>
                    Why Should <br /> You Use 
                    <span className='text-[#3781c5] font-medium'> Our <br /> Services</span>
                </p>
                <div className='mt-18'>
                    <div className='flex w-13 h-13 bg-[#dce8f6] rounded-full justify-center items-center'>
                        <img src={CoinImage} className='w-6 h-6'/>
                    </div>
                    <p className='text-gray-800 text-lg font-medium mt-2'>Price Beating Guarantee</p>
                    <div className='w-[200px]'>
                        <p className='text-gray-400 text-sm mt-1'>
                            Our goal is to provide with the best
                            travel experience possible from
                            start to finish with best price
                        </p>
                    </div>
                </div>
            </div>

            <div className='col-span-1'>
                <div>
                    <div className='flex w-13 h-13 bg-[#dce8f6] rounded-full justify-center items-center'>
                        <img src={DiscountImage} className='w-8 h-8'/>
                    </div>
                    <p className='text-gray-800 text-lg font-medium mt-2'>Special Offers</p>
                    <div className='w-[200px]'>
                        <p className='text-gray-400 text-sm mt-1'>
                            We do offer promotional deals, Simply contact us and get the advantage
                        </p>
                    </div>
                </div>
                <div className='mt-12'> 
                    <div className='flex w-13 h-13 bg-[#dce8f6] rounded-full justify-center items-center'>
                        <img src={SupportImage} className='w-6 h-6'/>
                    </div>
                    <p className='text-gray-800 text-lg font-medium mt-2'>Customer Service 24/7</p>
                    <div className='w-[200px]'>
                        <p className='text-gray-400 text-sm mt-1'>Our goal is to provide with the best
                            travel experience possible from
                            start to finish with best price
                        </p>
                    </div>
                </div>
            </div>

            <div className='col-span-1'>
                <div>
                    <div className='flex w-13 h-13 bg-[#dce8f6] rounded-full justify-center items-center'>
                        <img src={ThumpsUpImage} className='w-5 h-5'/>
                    </div>
                    <p className='text-gray-800 text-lg font-medium mt-2'>Satisfaction</p>
                    <div className='w-[200px]'>
                        <p className='text-gray-400 text-sm mt-1'>
                            We always try our best to give people more than what they expect to get
                        </p>
                    </div>
                </div>
                <div className='mt-12'> 
                    <div className='flex w-13 h-13 bg-[#dce8f6] rounded-full justify-center items-center'>
                        <img src={IndianRupeeImage} className='w-8 h-8'/>
                    </div>
                    <p className='text-gray-800 text-lg font-medium mt-2'>Low Budget</p>
                    <div className='w-[200px]'>
                        <p className='text-gray-400 text-sm mt-1'>
                            Our goal is to provide with the best
                            travel experience possible from
                            start to finish
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
