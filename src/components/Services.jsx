import CoinImage from '../assets/coin.png'
import DiscountImage from '../assets/discount.png'
import SupportImage from '../assets/support.png'
import ThumpsUpImage from '../assets/thumps up.png'
import IndianRupeeImage from '../assets/rupee.png'

export const Services = () => {
  return (
    <div className="max-w-full mt-30 md:mt-20 mb-5 lg:px-25 py-8 px-8 md:px-8 ">

      {/* grid: 2 columns on small/medium, 3 on large */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:ml-30 gap-6 md:gap-8">
        
        {/* section header */}
        <div className="flex flex-col gap-3">
            <div className="mt-10 md:mt-0 md:mb-8 lg:mb-10">
                <p className="text-xs md:text-sm tracking-widest whitespace-nowrap">B E S T &nbsp; &nbsp;C H O I C E</p>
                <h2 className="text-2xl md:text-3xl lg:text-4xl mt-1 font-semibold">
                    Why Should <br /> You Use
                    <span className="text-[#3781c5] font-medium"> Our <br /> Services</span>
                </h2>
            </div>
        </div>

        {/* Card 1 */}
        <div className="flex flex-col gap-3">
            <div className="flex w-12 h-12 md:w-14 md:h-14 bg-[#dce8f6] rounded-full justify-center items-center">
                <img src={CoinImage} alt="Price guarantee" className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <p className="text-gray-800 text-base md:text-lg font-medium">Price Beating Guarantee</p>
            <div className='lg:w-[250px]'>
                <p className="text-gray-400 text-sm md:text-sm leading-relaxed">
                    Our goal is to provide the best travel experience from start to finish at the best price.
                </p>
            </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col gap-3">
          <div className="flex w-12 h-12 md:w-14 md:h-14 bg-[#dce8f6] rounded-full justify-center items-center">
            <img src={DiscountImage} alt="Special offers" className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <p className="text-gray-800 text-base md:text-lg font-medium">Special Offers</p>
          <div className='lg:w-[250px]'>
            <p className="text-gray-400 text-sm md:text-sm leading-relaxed">
                We offer promotional deals - just contact us to get exclusive discounts.
            </p>
        </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col gap-3">
          <div className="flex w-12 h-12 md:w-14 md:h-14 bg-[#dce8f6] rounded-full justify-center items-center">
            <img src={SupportImage} alt="Support" className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <p className="text-gray-800 text-base md:text-lg font-medium">Customer Service 24/7</p>
          <div className='lg:w-[250px]'>
            <p className="text-gray-400 text-sm md:text-sm leading-relaxed">
                We're available round-the-clock to help you at every step of your journey.
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col gap-3">
          <div className="flex w-12 h-12 md:w-14 md:h-14 bg-[#dce8f6] rounded-full justify-center items-center">
            <img src={ThumpsUpImage} alt="Satisfaction" className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <p className="text-gray-800 text-base md:text-lg font-medium">Satisfaction</p>
          <div className='lg:w-[250px]'>
            <p className="text-gray-400 text-sm md:text-sm leading-relaxed">
            We strive to exceed expectations and deliver a delightful travel experience.
            </p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="flex flex-col gap-3">
          <div className="flex w-12 h-12 md:w-14 md:h-14 bg-[#dce8f6] rounded-full justify-center items-center">
            <img src={IndianRupeeImage} alt="Low budget" className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <p className="text-gray-800 text-base md:text-lg font-medium">Low Budget</p>
          <div className='lg:w-[250px]'>
            <p className="text-gray-400 text-sm md:text-sm leading-relaxed">
            Affordable options so you can travel the way you want without breaking the bank.
          </p>
          </div>
        </div>
      </div>
    </div>
  )
}