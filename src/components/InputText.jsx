
export const InputText = ({image, placeholder, label, extrastyle}) => { 
   return (
    <div>
        <div className={`flex border border-gray-400 rounded-sm px-2 py-2 ${extrastyle}`}>
            <div className='border-r border-r-gray-400 px-3'>
            {image}
            </div>
            <input 
                className='h-5 mt-0.5 outline-none border-none focus:outline-none focus:ring-0 text-sm w-full'
                placeholder={placeholder} 
            />
            <p className='text-sm font-medium text-yellow-600 text-center'>{label}</p>
        </div>
        




{/*

<div className='flex border border-gray-300 rounded-sm px-2 py-2 mt-4'>
            <div className='border-r border-r-gray-300 px-3'>
            <GiAirplaneArrival size={25}/>
            </div>
            <input placeholder='Enter City/Airport' className='h-5 mt-0.5 outline-none border-none focus:outline-none focus:ring-0 text-sm w-full' />
            <p className='text-sm text-gray-600 mt-0.5 mr-1 ml-2.5'>Arrivals</p>
        </div>
        <div className='flex border border-gray-300 rounded-sm px-3 py-2 mt-4'>
            <div className='border-r border-r-gray-300 px-3'>
            <BsCalendar2Week size={23}/>
            </div>
            <input placeholder='Enter Date' className='h-5 mt-0.5 outline-none border-none focus:outline-none focus:ring-0 text-sm w-full' />
            <p className='text-sm text-gray-600 mt-0.5 mr-1 ml-2.5'>Calendar</p>
        </div>
        <div className='flex border border-gray-300 rounded-sm px-3 py-2 mt-4'>
            <div className='border-r border-r-gray-300 px-3'>
            <GiAirplaneArrival size={25}/>
            </div>
            <input placeholder='Enter City/Airport' className='h-5 mt-0.5 outline-none border-none focus:outline-none focus:ring-0 text-sm w-full' />
            <p className='text-sm text-gray-600 mt-0.5 mr-1 ml-2.5'>Travellers</p>
        </div>
        <div className='flex border border-gray-300 rounded-sm px-3 py-2 mt-4'>
            <div className='border-r border-r-gray-300 px-3'>
            <MdFlightClass size={25}/>
            </div>
            <input placeholder='Select Class' className='h-5 mt-0.5 outline-none border-none focus:outline-none focus:ring-0 text-sm w-full' />
            <p className='text-sm text-gray-600 mt-0.5 mr-1 ml-2.5'>Class</p>
        </div>
        */}
    </div>
  )
}
