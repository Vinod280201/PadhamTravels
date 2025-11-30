import Indigo from '../assets/indigo.png'
import SpiceJet from '../assets/spicejet.jpeg'
import AirIndia from '../assets/airindia.jpeg'
import AirIndiaExpress from '../assets/airIndiaExpress.jpeg'
import Vistara from '../assets/vistara.jpeg'


export const BrandsScroller = () => {
    const images = [
        Indigo, 
        SpiceJet,
        AirIndia,
        AirIndiaExpress,
        Vistara,
    ];
    // Duplicate the array for the seamless loop
    const scrollImages = [...images, ...images]; 

  return (
    <div className='px-20 mt-50'>
        <div className="flex w-full overflow-hidden gap-10 py-4">
      
            {/* The key is the custom utility class applied here: 
             className="... animate-infinite-scroll"
            */}
            <div className="flex animate-infinite-scroll">
                {scrollImages.map((src, index) => (
                <img 
                    key={src + index}
                    className="w-50 h-25 mr-8"
                    src={src}
                    alt={`Scrolling image ${index}`}
                />
                ))}
            </div>
      
        </div>
    </div>
  )
}
