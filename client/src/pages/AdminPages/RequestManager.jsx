import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "@/apiClient";
import { toast } from "sonner";
import { 
  FaRegClock, 
  FaUser, 
  FaPlane, 
  FaMoneyBillWave, 
  FaInfoCircle, 
  FaCheckCircle,
  FaArrowRight,
  FaWhatsapp,
  FaEdit,
  FaCheckCircle as FaCheck,
  FaTimesCircle
} from "react-icons/fa";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// Configuration for External Provider Contact
const MARUTI_TRAVELS_WHATSAPP = "+9199999999999";

export const RequestManager = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteData, setQuoteData] = useState({
    refundAmount: "",
    cancellationFee: "",
    adminNotes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: "",
    newFlightNo: "",
    newTime: "",
    rescheduleFee: "",
    newPnr: ""
  });

  const [editingPnrId, setEditingPnrId] = useState(null);
  const [tempPnrValue, setTempPnrValue] = useState("");
  const [savingPnrId, setSavingPnrId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await apiGet("/bookings");
      const data = await response.json();
      if (data.status) {
        // Filter bookings that have a cancellation or reschedule status
        const activeRequests = data.bookings.filter(b => (b.cancellation && b.cancellation.status) || (b.reschedule && b.reschedule.status));
        setBookings(activeRequests);
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAcceptModal = (booking) => {
    setSelectedBooking(booking);
    setQuoteData({
      refundAmount: booking.cancellation.refundAmount || "",
      cancellationFee: booking.cancellation.cancellationFee || "",
      adminNotes: booking.cancellation.adminNotes || ""
    });
    setIsQuoteModalOpen(true);
  };

  const handleProcessCancellation = async (action) => {
    if (action === 'accept' && (!quoteData.refundAmount || !quoteData.cancellationFee)) {
      toast.error("Please enter both refund amount and cancellation fee");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiPost(`/bookings/admin/process-cancellation/${selectedBooking._id}`, { action, ...quoteData });
      const data = await response.json();
      if (data.status) {
        toast.success("Cancellation completed successfully");
        setIsQuoteModalOpen(false);
        fetchCancellations();
      } else {
        toast.error(data.message || "Failed to process cancellation");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectAction = async (booking) => {
    if (!window.confirm("Are you sure you want to reject this cancellation request?")) return;
    try {
      const response = await apiPost(`/bookings/admin/process-cancellation/${booking._id}`, { action: "reject" });
      const data = await response.json();
      if (data.status) {
        toast.success("Cancellation request declined.");
        fetchRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error rejecting cancellation");
    }
  };

  const handlePnrSave = async (id) => {
    if (!tempPnrValue.trim()) return;
    setSavingPnrId(id);
    try {
      const response = await apiPost(`/bookings/admin/update-pnr/${id}`, { pnr: tempPnrValue });
      const data = await response.json();
      if (data.status) {
        toast.success("Airline PNR saved successfully");
        setEditingPnrId(null);
        fetchCancellations();
      } else {
        toast.error(data.message || "Failed to save PNR");
      }
    } catch {
      toast.error("An error occurred while saving PNR");
    } finally {
      setSavingPnrId(null);
    }
  };

  const handleOpenRescheduleModal = (booking) => {
    setSelectedBooking(booking);
    setRescheduleData({
      newDate: booking.reschedule?.preferredDate || "",
      newFlightNo: "",
      newTime: "",
      newPnr: "",
      rescheduleFee: ""
    });
    setIsRescheduleModalOpen(true);
  };

  const handleProcessReschedule = async (action) => {
    if (action === 'accept' && (!rescheduleData.newDate || !rescheduleData.newFlightNo || !rescheduleData.newTime)) {
      toast.error("Please fill in New Date, New Flight No, and Time");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await apiPost(`/bookings/admin/process-reschedule/${selectedBooking._id}`, { action, ...rescheduleData });
      const data = await response.json();
      if (data.status) {
        toast.success(action === 'accept' ? "Reschedule updated successfully" : "Reschedule rejected.");
        setIsRescheduleModalOpen(false);
        fetchRequests();
      } else {
        toast.error(data.message || "Failed to process reschedule");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectRescheduleAction = async (booking) => {
    if (!window.confirm("Are you sure you want to reject this reschedule request?")) return;
    try {
      const response = await apiPost(`/bookings/admin/process-reschedule/${booking._id}`, { action: "reject" });
      const data = await response.json();
      if (data.status) {
        toast.success("Reschedule request declined.");
        fetchRequests();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error rejecting reschedule");
    }
  };

  const handleContactProvider = (booking) => {
    const isReschedule = !!booking.reschedule?.status;
    let label = "Booking Ref";
    let value = booking.bookingRef || "N/A";

    if (booking.airlinePnr && booking.airlinePnr !== "N/A" && booking.airlinePnr.trim() !== "") {
      label = "Airline PNR";
      value = booking.airlinePnr;
    }

    let travelDate = "N/A";
    if (booking.date) {
      const d = new Date(booking.date);
      if (!isNaN(d)) {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        travelDate = `${day}-${month}-${year}`;
      } else {
        travelDate = booking.date;
      }
    }

    let message;
    if (isReschedule) {
      message = `Hello Maruti Travels, I am requesting a reschedule for Padham Travels.\n\n${label}: ${value}\nPassenger: ${booking.customer}\nRoute: ${booking.flight}\nCurrent Date: ${travelDate}\nCustomer Preferred Date: ${booking.reschedule?.preferredDate || "TBA"}\n\nPlease check availability and amendment charges.`;
    } else {
      message = `Hello Maruti Travels, I am requesting a cancellation quote for Padham Travels. \n\n${label}: ${value}\nPassenger: ${booking.customer}\nRoute: ${booking.flight}\nTravel Date: ${travelDate}\n\nPlease provide the refundable amount.`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${MARUTI_TRAVELS_WHATSAPP}?text=${encodedMessage}`;
    
    window.open(whatsappLink, "_blank");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-200">Pending Quote</span>;
      case 'quoted':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200">Quoted</span>;
      case 'confirmed':
        return <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-200">Confirmed by User</span>;
      case 'completed':
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-red-200">Cancelled</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1e1b4b] mb-1 flex items-center gap-3">
            <FaRegClock className="text-orange-500" /> Request Manager
          </h1>
          <p className="text-slate-500 text-sm">Manage flight cancellation and reschedule requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-bold text-[#1e1b4b]">BOOKING REF</TableHead>
              <TableHead className="font-bold text-[#1e1b4b]">CUSTOMER</TableHead>
              <TableHead className="font-bold text-[#1e1b4b]">FLIGHT DETAILS</TableHead>
              <TableHead className="font-bold text-[#1e1b4b]">REQUEST TYPE</TableHead>
              <TableHead className="font-bold text-[#1e1b4b]">REQUEST DATE</TableHead>
              <TableHead className="font-bold text-[#1e1b4b]">STATUS</TableHead>
              <TableHead className="font-bold text-[#1e1b4b] text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                   <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-500 font-medium">Loading requests...</p>
                   </div>
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-500 italic">
                  No active cancellation requests found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="font-bold text-blue-600 space-y-1">
                       <div>{booking.bookingRef}</div>
                       <div className="text-[10px] font-normal mt-1 w-full max-w-[120px]">
                         {editingPnrId === booking._id ? (
                           <div className="flex items-center gap-1 bg-white border border-blue-300 rounded p-0.5 shadow-sm">
                             <Input
                               value={tempPnrValue}
                               onChange={(e) => setTempPnrValue(e.target.value)}
                               placeholder="e.g. XYZ123"
                               className="h-5 w-16 px-1 text-[10px] uppercase border-0 focus-visible:ring-0 shadow-none bg-transparent"
                               autoFocus
                             />
                             <button
                               onClick={() => handlePnrSave(booking._id)}
                               disabled={savingPnrId === booking._id}
                               className="text-green-600 hover:text-green-700 bg-green-50 rounded-sm p-0.5"
                               title="Save PNR"
                             >
                               {savingPnrId === booking._id ? "..." : <FaCheck />}
                             </button>
                             <button onClick={() => setEditingPnrId(null)} className="text-slate-400 hover:text-red-500 bg-slate-50 rounded-sm p-0.5">
                               <FaTimesCircle />
                             </button>
                           </div>
                         ) : (
                           <div className="flex items-center gap-1 group w-max">
                             <span className="text-slate-500 font-semibold tracking-wider">PNR:</span>
                             <span className={booking.airlinePnr && booking.airlinePnr !== 'N/A' ? 'text-slate-800 font-bold bg-slate-200 px-1 rounded' : 'text-slate-400 italic'}>
                               {booking.airlinePnr && booking.airlinePnr !== 'N/A' ? booking.airlinePnr : 'N/A'}
                             </span>
                             <button
                               onClick={() => {
                                 setEditingPnrId(booking._id);
                                 setTempPnrValue(booking.airlinePnr && booking.airlinePnr !== 'N/A' ? booking.airlinePnr : '');
                               }}
                               className="text-slate-300 group-hover:text-blue-500 transition-colors ml-1 p-0.5 hover:bg-blue-50 rounded"
                               title="Edit Airline PNR"
                             >
                               <FaEdit className="text-xs" />
                             </button>
                           </div>
                         )}
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700 flex items-center gap-1"><FaUser className="text-[10px] text-slate-400" /> {booking.customer}</span>
                      <span className="text-[10px] text-slate-500">{booking.email}</span>
                      <span className="text-sm font-black text-slate-800 mt-1">
                        {(booking.phone || booking.billing?.phone) 
                          ? (String(booking.phone || booking.billing?.phone).trim().startsWith('+') 
                              ? String(booking.phone || booking.billing?.phone).trim() 
                              : '+' + String(booking.phone || booking.billing?.phone).trim()
                            ) 
                          : "No Phone"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#242c5c] flex items-center gap-1"><FaPlane className="text-blue-500" /> {booking.flight}</span>
                      <span className="text-[10px] text-slate-500">Travel: {booking.date}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.reschedule?.status ? (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-blue-200">RESCHEDULE</span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-red-200">CANCEL</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {booking.reschedule?.status 
                      ? (booking.reschedule.requestDate ? new Date(booking.reschedule.requestDate).toLocaleDateString() : 'N/A')
                      : (booking.cancellation.requestDate ? new Date(booking.cancellation.requestDate).toLocaleDateString() : 'N/A')
                    }
                  </TableCell>
                  <TableCell>{getStatusBadge(booking.reschedule?.status ? booking.reschedule.status : booking.cancellation.status)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                       {(booking.cancellation?.status === 'pending' || booking.reschedule?.status === 'pending') ? (
                         <div className="flex gap-2">
                           <Button 
                             size="sm" 
                             onClick={() => handleContactProvider(booking)}
                             className="bg-[#25D366] hover:bg-[#1ebd5e] text-white font-bold text-xs flex items-center gap-1 hidden xl:flex"
                           >
                             <FaWhatsapp className="text-sm" /> WA
                           </Button>
                           <Button 
                             size="sm" 
                             onClick={() => booking.reschedule?.status ? handleOpenRescheduleModal(booking) : handleOpenAcceptModal(booking)}
                             className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs"
                           >
                             {booking.reschedule?.status ? 'Update & Reschedule' : 'Accept Cancellation'}
                           </Button>
                           <Button 
                             size="sm" 
                             variant="destructive"
                             onClick={() => booking.reschedule?.status ? handleRejectRescheduleAction(booking) : handleRejectAction(booking)}
                             className="text-xs font-bold"
                           >
                             Reject
                           </Button>
                         </div>
                       ) : (
                         <span className="text-xs text-slate-500 italic">Processed</span>
                       )}
                       {booking.cancellation.status === 'completed' && (
                         <span className="text-green-600 text-xs font-bold flex items-center justify-end gap-1"><FaCheckCircle /> Cancelled</span>
                       )}
                       {booking.cancellation.status === 'declined' && (
                         <span className="text-slate-400 text-xs font-bold flex items-center justify-end gap-1"><FaTimesCircle /> Declined</span>
                       )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Quote Dialog */}
      <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-[#242c5c] flex items-center gap-2">
              <FaMoneyBillWave className="text-green-500" /> Process Refund
            </DialogTitle>
            <DialogDescription>
              Enter the final refund amount and cancellation fee to process cancellation for <strong>{selectedBooking?.bookingRef}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Refund Amount (₹)</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 5000"
                  value={quoteData.refundAmount}
                  onChange={(e) => setQuoteData({...quoteData, refundAmount: e.target.value})}
                  className="bg-slate-50 border-slate-300 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Cancellation Fee (₹)</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 500"
                  value={quoteData.cancellationFee}
                  onChange={(e) => setQuoteData({...quoteData, cancellationFee: e.target.value})}
                  className="bg-slate-50 border-slate-300 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1"><FaInfoCircle /> Admin Notes (Internal)</label>
               <Textarea 
                 placeholder="e.g. Maruti Travels shared ₹5000 refund on WhatsApp..."
                 value={quoteData.adminNotes}
                 onChange={(e) => setQuoteData({...quoteData, adminNotes: e.target.value})}
                 className="min-h-[100px] border-slate-300 focus:ring-blue-500"
               />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
               <h5 className="text-[10px] font-bold text-blue-800 uppercase mb-2">Refund Summary</h5>
               <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">Total Refund:</span>
                  <span className="text-lg font-black text-green-600">₹{quoteData.refundAmount || 0}</span>
               </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQuoteModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-[#242c5c] hover:bg-blue-900 text-white font-bold"
              onClick={() => handleProcessCancellation('accept')}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm & Cancel Ticket"}
              {!isSubmitting && <FaCheckCircle className="ml-2 text-xs" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Processing Dialog */}
      <Dialog open={isRescheduleModalOpen} onOpenChange={setIsRescheduleModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-blue-700 flex items-center gap-2">
              <FaCheckCircle className="text-blue-500" /> Process Reschedule
            </DialogTitle>
            <DialogDescription>
              Enter the new flight details for <strong>{selectedBooking?.bookingRef}</strong>.
              <br /><span className="text-xs text-blue-600 font-semibold italic">Customer originally requested: {selectedBooking?.reschedule?.preferredDate} - {selectedBooking?.reschedule?.reason}</span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">New Flight Date</label>
                <Input 
                  type="date"
                  value={rescheduleData.newDate}
                  onChange={(e) => setRescheduleData({...rescheduleData, newDate: e.target.value})}
                  className="bg-slate-50 border-slate-300 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">New Flight No.</label>
                <Input 
                  type="text" 
                  placeholder="e.g. AI-999 DEL -> BLR"
                  value={rescheduleData.newFlightNo}
                  onChange={(e) => setRescheduleData({...rescheduleData, newFlightNo: e.target.value})}
                  className="bg-slate-50 border-slate-300 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">New Departure Time</label>
                <Input 
                  type="time"
                  value={rescheduleData.newTime}
                  onChange={(e) => setRescheduleData({...rescheduleData, newTime: e.target.value})}
                  className="bg-slate-50 border-slate-300 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Reschedule Fee (₹)</label>
                <Input 
                  type="number" 
                  placeholder="e.g. 1500"
                  value={rescheduleData.rescheduleFee}
                  onChange={(e) => setRescheduleData({...rescheduleData, rescheduleFee: e.target.value})}
                  className="bg-slate-50 border-slate-300 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-700 uppercase">New Airline PNR (Optional)</label>
               <Input 
                 type="text" 
                 placeholder="Leave blank to keep existing"
                 value={rescheduleData.newPnr}
                 onChange={(e) => setRescheduleData({...rescheduleData, newPnr: e.target.value.toUpperCase()})}
                 className="bg-slate-50 border-slate-300 focus:ring-blue-500 uppercase"
               />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRescheduleModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
              onClick={() => handleProcessReschedule('accept')}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Confirm & Update"}
              {!isSubmitting && <FaCheckCircle className="ml-2 text-xs" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
