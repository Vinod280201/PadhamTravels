import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Filter, PlusSquare, CheckSquare, XSquare, Hourglass, MinusSquare, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIRLINE_MAP } from "@/constants/AppConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiGet } from "@/apiClient";

export const ManageBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const clearFilters = location.state?.clearFilters || false;

  const [dbBookings, setDbBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    total: 0,
    confirmed: 0,
    cancelled: 0,
    pending: 0,
    rejected: 0,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getOffsetDateString = (daysOffset) => {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split('T')[0];
  };

  const [filterState, setFilterState] = useState({
    searchBy: 'bookRef',
    searchValue: '',
    fromBookingDate: clearFilters ? '' : getOffsetDateString(-1),
    toBookingDate: clearFilters ? '' : getOffsetDateString(0),
    fromTravelDate: '',
    toTravelDate: '',
    mobile: '',
    email: '',
    status: 'All',
    leadPaxName: ''
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiGet("/bookings");
        const data = await response.json();
        if (data.status && data.bookings) {
          setDbBookings(data.bookings);
        }
      } catch (err) {
        console.error("Failed to fetch bookings", err);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = [...dbBookings];

    if (filterState.searchValue) {
      const searchLower = filterState.searchValue.toLowerCase();
      if (filterState.searchBy === 'bookRef') {
        result = result.filter(b => b.bookingRef?.toLowerCase().includes(searchLower));
      } else if (filterState.searchBy === 'airlinePnr') {
        result = result.filter(b => b.airlinePnr?.toLowerCase().includes(searchLower));
      } else if (filterState.searchBy === 'gdsPnr') {
        result = result.filter(b => b.gdsPnr?.toLowerCase().includes(searchLower));
      } else if (filterState.searchBy === 'airline') {
        result = result.filter(b => {
            const { airline } = getAirlineAndSector(b.flight);
            const mappedAirline = AIRLINE_MAP[airline] || airline;
            return mappedAirline?.toLowerCase().includes(searchLower);
        });
      }
    }

    if (filterState.fromBookingDate) {
      result = result.filter(b => b.createdAt && b.createdAt.substring(0, 10) >= filterState.fromBookingDate);
    }
    if (filterState.toBookingDate) {
      result = result.filter(b => b.createdAt && b.createdAt.substring(0, 10) <= filterState.toBookingDate);
    }
    if (filterState.fromTravelDate) {
      result = result.filter(b => b.date && b.date.substring(0, 10) >= filterState.fromTravelDate);
    }
    if (filterState.toTravelDate) {
      result = result.filter(b => b.date && b.date.substring(0, 10) <= filterState.toTravelDate);
    }
    if (filterState.mobile) {
      result = result.filter(b => b.phone?.includes(filterState.mobile));
    }
    if (filterState.email) {
      result = result.filter(b => b.email?.toLowerCase().includes(filterState.email.toLowerCase()));
    }
    if (filterState.leadPaxName) {
      result = result.filter(b => b.customer?.toLowerCase().includes(filterState.leadPaxName.toLowerCase()));
    }

    // Calculate counts BEFORE applying the status filter
    setStatusCounts({
      total: result.length,
      confirmed: result.filter(b => b.status === "Confirmed").length,
      cancelled: result.filter(b => b.status === "Cancelled").length,
      pending: result.filter(b => b.status === "Pending").length,
      rejected: result.filter(b => b.status === "Failed" || b.status === "Rejected").length,
    });

    if (filterState.status && filterState.status !== 'All') {
      result = result.filter(b => b.status === filterState.status);
    }

    setFilteredBookings(result);
  }, [dbBookings, filterState]);

  const getAirlineAndSector = (flightStr) => {
    if (!flightStr) return { airline: "N/A", sector: "N/A" };
    const parts = flightStr.split(' ');
    let airline = "N/A";
    let sector = "N/A";

    if (parts.length >= 1) {
      const possibleAirline = parts[0].split('-')[0];
      // Distinguish 2-character (or alphanumeric like 6E) airline code from 3-letter airport code
      if (possibleAirline.length === 2 && possibleAirline !== "N/A" || /[0-9]/.test(possibleAirline)) {
         airline = possibleAirline;
      }
    }
    
    // Attempt to parse sector looking for 3 letter codes
    const codes = flightStr.match(/[A-Z]{3}/g);
    if (codes && codes.length >= 2) {
        sector = `${codes[0]}-\n${codes[codes.length-1]}`;
    } else if (parts.length >= 3) {
        // If no strict 3-letter codes found, but it has multiple parts (like "BOM → DEL")
        const first = parts.find(p => p.length >= 3 && p !== "→" && p !== "-" && p !== "->");
        const last = [...parts].reverse().find(p => p.length >= 3 && p !== "→" && p !== "-" && p !== "->");
        if (first && last && first !== last) {
            sector = `${first}-\n${last}`;
        }
    }

    return { airline, sector };
  };

  const { total, confirmed, cancelled, pending, rejected } = statusCounts;

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e1b4b] mb-1">
            Manage Flight Bookings
          </h1>
        </div>
        <Button 
           onClick={() => setIsFilterOpen(!isFilterOpen)} 
           className={`${isFilterOpen ? "bg-[#fe394a] hover:bg-[#e43241]" : "bg-[#2a245c] hover:bg-[#1e1b4b]"} text-white rounded-md px-6 font-bold shadow-sm transition-colors`}
        >
          <Filter className="w-4 h-4 mr-2" />
          FILTER
        </Button>
      </div>

      {/* Filter Section */}
      {isFilterOpen && (
        <Card className="border shadow-sm rounded-md mb-6 bg-[#f4f6fb] outline outline-1 outline-[#e2e8f0]">
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
               <div className="flex items-center bg-white border border-slate-300 rounded overflow-hidden shadow-sm h-[38px] md:col-start-1 md:col-span-1">
                  <span className="text-sm font-bold text-slate-700 px-3 py-2 whitespace-nowrap bg-white border-r border-slate-300">Search By:</span>
                  <select 
                     className="flex-1 px-3 py-2 bg-[#2a245c] text-white text-sm font-semibold focus:outline-none h-full outline-none border-none"
                     style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', cursor: 'pointer' }}
                     value={filterState.searchBy}
                     onChange={(e) => setFilterState({...filterState, searchBy: e.target.value})}
                  >
                     <option value="bookRef" className="bg-[#2a245c]">bookRef</option>
                     <option value="airlinePnr" className="bg-[#2a245c]">airlinePnr</option>
                     <option value="gdsPnr" className="bg-[#2a245c]">gdsPnr</option>
                     <option value="airline" className="bg-[#2a245c]">airline</option>
                  </select>
               </div>
               <div className="md:col-start-3 md:col-span-2">
                  <input 
                     type="text" 
                     placeholder={
                        filterState.searchBy === 'airlinePnr' ? 'Enter Airline PNR' :
                        filterState.searchBy === 'gdsPnr' ? 'Enter GDS PNR' :
                        filterState.searchBy === 'airline' ? 'Enter Airline Code or Name' :
                        'Enter Booking Reference'
                     }
                     className="w-full p-2 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm bg-white h-[38px]"
                     value={filterState.searchValue}
                     onChange={(e) => setFilterState({...filterState, searchValue: e.target.value})}
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">From Booking Date</label>
                  <div className="relative">
                     <input type="date" className="w-full pl-2 pr-8 py-2 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm bg-white cursor-pointer" onClick={(e) => e.target.showPicker && e.target.showPicker()} value={filterState.fromBookingDate} onChange={(e) => setFilterState({...filterState, fromBookingDate: e.target.value})} />
                     {filterState.fromBookingDate && <X className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-red-500 cursor-pointer bg-white" onClick={() => setFilterState({...filterState, fromBookingDate: ''})} title="Clear Date" />}
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">To Booking Date</label>
                  <div className="relative">
                     <input type="date" className="w-full pl-2 pr-8 py-2 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm bg-white cursor-pointer" onClick={(e) => e.target.showPicker && e.target.showPicker()} value={filterState.toBookingDate} onChange={(e) => setFilterState({...filterState, toBookingDate: e.target.value})} />
                     {filterState.toBookingDate && <X className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-red-500 cursor-pointer bg-white" onClick={() => setFilterState({...filterState, toBookingDate: ''})} title="Clear Date" />}
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">From Travel Date</label>
                  <div className="relative">
                     <input type="date" className="w-full pl-2 pr-8 py-2 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm bg-white cursor-pointer" onClick={(e) => e.target.showPicker && e.target.showPicker()} value={filterState.fromTravelDate} onChange={(e) => setFilterState({...filterState, fromTravelDate: e.target.value})} />
                     {filterState.fromTravelDate && <X className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-red-500 cursor-pointer bg-white" onClick={() => setFilterState({...filterState, fromTravelDate: ''})} title="Clear Date" />}
                  </div>
               </div>
               <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">To Travel Date</label>
                  <div className="relative">
                     <input type="date" className="w-full pl-2 pr-8 py-2 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm bg-white cursor-pointer" onClick={(e) => e.target.showPicker && e.target.showPicker()} value={filterState.toTravelDate} onChange={(e) => setFilterState({...filterState, toTravelDate: e.target.value})} />
                     {filterState.toTravelDate && <X className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-red-500 cursor-pointer bg-white" onClick={() => setFilterState({...filterState, toTravelDate: ''})} title="Clear Date" />}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
               <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile</label>
                  <input type="text" placeholder="Enter Mobile Number" className="w-full p-2 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm bg-white" value={filterState.mobile} onChange={(e) => setFilterState({...filterState, mobile: e.target.value})} />
               </div>
               <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                  <input type="text" placeholder="Email ID" className="w-full p-2 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm bg-white" value={filterState.email} onChange={(e) => setFilterState({...filterState, email: e.target.value})} />
               </div>
               <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                  <select className="w-full p-2 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm bg-white" value={filterState.status} onChange={(e) => setFilterState({...filterState, status: e.target.value})}>
                     <option value="All">All</option>
                     <option value="Confirmed">Confirmed</option>
                     <option value="Pending">Pending</option>
                     <option value="Cancelled">Cancelled</option>
                     <option value="Failed">Failed</option>
                     <option value="Rejected">Rejected</option>
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Lead Pax Name</label>
                  <input type="text" placeholder="Lead Pax Name" className="w-full p-2 rounded border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm bg-white" value={filterState.leadPaxName} onChange={(e) => setFilterState({...filterState, leadPaxName: e.target.value})} />
               </div>
               <div className="flex gap-2 h-[38px]">
                  <Button className="flex-1 bg-[#2a245c] hover:bg-[#1e1b4b] text-white text-sm font-semibold h-full" onClick={() => setFilterState({ searchBy: 'bookRef', searchValue: '', fromBookingDate: '', toBookingDate: '', fromTravelDate: '', toTravelDate: '', mobile: '', email: '', status: 'All', leadPaxName: '' })}>Clear</Button>
                  <Button className="flex-1 bg-[#2a245c] hover:bg-[#1e1b4b] text-white text-sm font-semibold h-full">View</Button>
                  <Button className="flex-1 bg-[#2a245c] hover:bg-[#1e1b4b] text-white text-sm font-semibold h-full px-2" onClick={() => alert("Download placeholder")}>Download</Button>
               </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Bar */}
      <Card className="border shadow-sm rounded-md mb-6 bg-white outline outline-1 outline-slate-200">
        <CardContent className="p-4 flex flex-wrap items-center gap-8 text-sm font-bold">
          <div 
            className={`flex items-center cursor-pointer hover:opacity-75 transition-opacity px-2 py-1 rounded-md ${filterState.status === 'All' ? 'bg-slate-100 ring-1 ring-slate-300' : ''} text-[#555]`}
            onClick={() => setFilterState({...filterState, status: 'All'})}
          >
            <PlusSquare className="w-5 h-5 mr-2 text-slate-400" />
            Total {total}
          </div>
          <div 
            className={`flex items-center cursor-pointer hover:opacity-75 transition-opacity px-2 py-1 rounded-md ${filterState.status === 'Confirmed' ? 'bg-emerald-50 ring-1 ring-emerald-300' : ''} text-emerald-600`}
            onClick={() => setFilterState({...filterState, status: 'Confirmed'})}
          >
            <CheckSquare className="w-5 h-5 mr-2 text-emerald-500" />
            Confirmed {confirmed}
          </div>
          <div 
            className={`flex items-center cursor-pointer hover:opacity-75 transition-opacity px-2 py-1 rounded-md ${filterState.status === 'Cancelled' ? 'bg-slate-50 ring-1 ring-slate-300' : ''} text-slate-500`}
            onClick={() => setFilterState({...filterState, status: 'Cancelled'})}
          >
            <XSquare className="w-5 h-5 mr-2 text-slate-400" />
            Cancelled {cancelled}
          </div>
          <div 
            className={`flex items-center cursor-pointer hover:opacity-75 transition-opacity px-2 py-1 rounded-md ${filterState.status === 'Pending' ? 'bg-amber-50 ring-1 ring-amber-300' : ''} text-amber-500`}
            onClick={() => setFilterState({...filterState, status: 'Pending'})}
          >
            <Hourglass className="w-5 h-5 mr-2 text-amber-400" />
            Pending {pending}
          </div>
          <div 
            className={`flex items-center cursor-pointer hover:opacity-75 transition-opacity px-2 py-1 rounded-md ${filterState.status === 'Rejected' || filterState.status === 'Failed' ? 'bg-red-50 ring-1 ring-red-300' : ''} text-red-500`}
            onClick={() => setFilterState({...filterState, status: 'Rejected'})}
          >
            <MinusSquare className="w-5 h-5 mr-2 text-red-400" />
            Rejected {rejected}
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <Table className="min-w-max">
          <TableHeader>
            <TableRow className="bg-white border-b border-slate-200">
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4">BOOKING REF</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4">AIRLINE</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4">SECTOR</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4">TRAVEL DATE</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4">LEAD PAX</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4">AIRLINE PNR</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4">GDS PNR</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4 whitespace-nowrap">RAISE AMENDMENTS</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4">FARE CATEGORY</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4">BOOKING DATE</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4 whitespace-nowrap">BOOKING AMOUNT</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-xs pb-4 whitespace-nowrap">INVOICE AMOUNT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((booking) => {
              const { airline, sector } = getAirlineAndSector(booking.flight);
              const mappedAirline = AIRLINE_MAP[airline] || airline;
              return (
                <TableRow key={booking.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
                  <TableCell className="font-semibold align-top pt-4">
                    <span 
                      className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
                      onClick={() => {
                        if (booking.searchId && booking.priceId) {
                            navigate("/admin/flight-ticket", {
                              state: {
                                searchId: booking.searchId,
                                priceId: booking.priceId,
                                bookRef: booking.bookingRef
                              }
                            });
                        } else {
                            alert("Missing full booking metadata required to fetch detailed ticket.");
                        }
                      }}
                    >
                      {booking.bookingRef}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-700 align-top pt-4">{mappedAirline}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-700 align-top pt-4 whitespace-pre-line">{sector}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-700 align-top pt-4">{booking.date || 'N/A'}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-700 align-top pt-4">
                    {booking.customer}<br/>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-700 align-top pt-4">{booking.airlinePnr}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-700 align-top pt-4">{booking.gdsPnr}</TableCell>
                  <TableCell className="text-sm font-medium align-top pt-4">
                    <span className="text-slate-600 underline cursor-pointer hover:text-slate-800">
                      Amendment
                    </span>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-700 align-top pt-4">{booking.fcn}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-700 align-top pt-4">{booking.createdAt || 'N/A'}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-700 align-top pt-4">{booking.amount}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-700 align-top pt-4">{booking.amount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ManageBookings;
