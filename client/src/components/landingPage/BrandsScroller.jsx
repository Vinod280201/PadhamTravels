import Indigo from "@/assets/indigo.png";
import SpiceJet from "@/assets/spicejet.jpeg";
import AirIndia from "@/assets/airindia.jpeg";
import AirIndiaExpress from "@/assets/airIndiaExpress.jpeg";
import Vistara from "@/assets/vistara.jpeg";

export const BrandsScroller = () => {
  const images = [Indigo, SpiceJet, AirIndia, AirIndiaExpress, Vistara];
  // Duplicate the array for the seamless loop
  const scrollImages = [...images, ...images];

  return (
    <div className="mx-6 md:mx-12 px-4 md:px-10 mt-35 md:mt-40 lg:mt-45 border-t border-gray-500 border-b overflow-x-hidden">
      <div className="flex w-full overflow-hidden gap-10 py-4">
        {/* The key is the custom utility class applied here: 
             className="... animate-infinite-scroll"
            */}
        <div className="flex animate-infinite-scroll">
          {scrollImages.map((src, index) => (
            <img
              key={src + index}
              className="w-30 h-15 mr-2 md:w-40 md:h-20 md:mr-5 lg:w-50 lg:h-25 lg:mr-8"
              src={src}
              alt={`Scrolling image ${index}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
