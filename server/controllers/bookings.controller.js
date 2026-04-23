import { Booking } from "../models/booking.model.js";
import User from "../models/user.model.js";

// Fetch all bookings for the admin calendar & tables
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    
    // Map them to the format the frontend UI expects currently:
    // { bookingRef, customer, email, flight, date, passengers, amount, status }
    const formattedBookings = bookings.map((b) => {
      const travelDateStr = b.travelDate ? b.travelDate.toISOString().replace('T', ' ').substring(0, 19) : "";
      const bookingDateStr = b.createdAt ? b.createdAt.toISOString().replace('T', ' ').substring(0, 19) : "";

      return {
        _id: b._id,
        id: b.bookingRef,
        bookingRef: b.bookingRef,
        customer: b.customerName,
        email: b.email,
        phone: b.phone,
        flight: b.flightDetails,
        date: travelDateStr,
        createdAt: bookingDateStr,
        passengers: b.passengers,
        amount: b.amount,
        status: b.status,
        searchId: b.searchId,
        priceId: b.priceId,
        fcn: b.fcn || "RETAIL FARE",
        airlinePnr: b.airlinePnr || "N/A",
        gdsPnr: b.gdsPnr || "N/A",
        cancellation: b.cancellation
      };
    });

    return res.status(200).json({
      status: true,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);
    return res.status(500).json({ status: false, message: "Server Error fetching bookings." });
  }
};

// Fetch bookings strictly for the logged-in user
export const getUserBookings = async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) {
      return res.status(400).json({ status: false, message: "User email not found." });
    }

    // Handle potential casing issues and accidental spaces saved previously during booking
    const emailRegex = new RegExp(`^\\s*${userEmail.trim()}\\s*$`, "i");
    const bookings = await Booking.find({ email: emailRegex }).sort({ createdAt: -1 });

    const formattedBookings = bookings.map((b) => ({
      _id: b._id,
      id: b.bookingRef,
      bookingRef: b.bookingRef,
      customer: b.customerName,
      flight: b.flightDetails,
      date: b.travelDate ? b.travelDate.toISOString().split("T")[0] : "",
      amount: b.amount,
      status: b.status,
      searchId: b.searchId,
      priceId: b.priceId,
      createdAt: b.createdAt,
      cancellation: b.cancellation
    }));

    return res.status(200).json({
      status: true,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("GET USER BOOKINGS ERROR:", error);
    return res.status(500).json({ status: false, message: "Server Error fetching user bookings." });
  }
};

// Fetch real-time dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // 1. Total Customers
    const totalCustomers = await User.countDocuments({ role: "user" });

    // 2. Fetch all registered user details for the Customer List Modal
    const registeredUsers = await User.find({ role: "user" }, { name: 1, firstName: 1, lastName: 1, email: 1, phone: 1, createdAt: 1 }).sort({ createdAt: -1 }).lean();
    
    // Format them for the frontend
    const customerDetails = registeredUsers.map(u => ({
      id: u._id,
      name: u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || "User",
      email: u.email || "",
      phone: u.phone || "N/A",
      joinedDate: u.createdAt ? u.createdAt.toISOString().split("T")[0] : ""
    }));

    const userEmails = registeredUsers.map(user => {
      // Normalize email for comparison by lowercase + trim
      return user.email ? user.email.toLowerCase().trim() : "";
    }).filter(e => e);

    // For simplicity and performance, since MongoDB allows case-insensitive collation or regex:
    const userEmailRegexs = userEmails.map(email => new RegExp(`^\\s*${email}\\s*$`, "i"));

    // 3. User Bookings Count
    const userBookingsCount = await Booking.countDocuments({ email: { $in: userEmailRegexs } });

    // 4. Total Bookings Count
    const totalBookingsCount = await Booking.countDocuments();

    // Admin Bookings Count
    const adminBookingsCount = totalBookingsCount - userBookingsCount;

    // 5. Recent Admin Bookings
    const recentAdminBookingsDocs = await Booking.find({ email: { $nin: userEmailRegexs } })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const formattedRecentBookings = recentAdminBookingsDocs.map((b) => {
      const travelDateStr = b.travelDate ? b.travelDate.toISOString().replace('T', ' ').substring(0, 19) : "";
      return {
        _id: b._id,
        id: b.bookingRef,
        customer: b.customerName,
        flight: b.flightDetails,
        date: travelDateStr,
        amount: b.amount,
        status: b.status,
      };
    });

    // 6. Revenue & Commission Details
    const commissionBookings = await Booking.find({ $or: [{ commissionAmount: { $gt: 0 } }, { "rawBookingData.commissionAmount": { $gt: 0 } }] })
      .sort({ createdAt: -1 })
      .select("bookingRef customerName flightDetails createdAt commissionAmount rawBookingData email amount")
      .lean();

    const commissionDetails = commissionBookings.map(b => ({
      _id: b._id,
      bookingRef: b.bookingRef,
      customerName: b.customerName,
      flight: b.flightDetails,
      date: b.createdAt ? b.createdAt.toISOString().replace('T', ' ').substring(0, 19) : "",
      amount: b.amount || 0,
      commissionAmount: b.commissionAmount || b.rawBookingData?.commissionAmount || 0,
      bookedByAdmin: !userEmailRegexs.some(regex => regex.test(b.email))
    }));

    const totalRevenue = commissionDetails.reduce((sum, item) => sum + item.commissionAmount, 0);

    // 7. Active Cancellations Count
    const activeCancellationsCount = await Booking.countDocuments({ 
      "cancellation.status": { $in: ["pending", "quoted", "confirmed"] } 
    });

    // 8. Active Reschedules Count
    const activeReschedulesCount = await Booking.countDocuments({
      "reschedule.status": "pending"
    });

    return res.status(200).json({
      status: true,
      stats: {
        totalBookings: totalBookingsCount,
        adminBookingsCount,
        userBookingsCount,
        totalCustomers,
        totalRevenue,
        activeCancellationsCount,
        activeReschedulesCount
      },
      recentAdminBookings: formattedRecentBookings,
      commissionDetails,
      customerDetails
    });

  } catch (error) {
    console.error("GET DASHBOARD STATS ERROR:", error);
    return res.status(500).json({ status: false, message: "Server Error fetching dashboard stats." });
  }
};

// --- CANCELLATION WORKFLOW ---

// 1. Customer initiates request
export const requestCancellation = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ status: false, message: "Booking not found." });
    }

    // Update cancellation status
    booking.cancellation = {
      ...booking.cancellation,
      status: "pending",
      reason: reason,
      requestDate: new Date()
    };
    
    // Also update main status to reflect cancellation in progress if needed, 
    // but the user requirement says "change status to pending" which usually refers to cancellation status.
    // We'll keep the main booking status as "Confirmed" until it's fully cancelled.

    await booking.save();

    return res.status(200).json({
      status: true,
      message: "Cancellation request submitted successfully.",
      cancellation: booking.cancellation
    });
  } catch (error) {
    console.error("REQUEST CANCELLATION ERROR:", error);
    return res.status(500).json({ status: false, message: "Server Error requesting cancellation." });
  }
};

// 2. Admin processes the cancellation manual negotiation
export const adminProcessCancellation = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, refundAmount, cancellationFee, adminNotes } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ status: false, message: "Booking not found." });
    }

    if (action === "accept") {
      booking.cancellation = {
        ...booking.cancellation,
        status: "completed",
        refundAmount: Number(refundAmount) || 0,
        cancellationFee: Number(cancellationFee) || 0,
        adminNotes: adminNotes,
      };
      booking.status = "Cancelled"; // Update the main status to officially trigger cancelled workflows
    } else if (action === "reject") {
      booking.cancellation = {
        ...booking.cancellation,
        status: "declined",
        adminNotes: "Cancellation request was manually declined by Padham Travels Admin."
      };
      // Booking status stays "Confirmed"
    } else {
      return res.status(400).json({ status: false, message: "Invalid action."});
    }

    await booking.save();

    return res.status(200).json({
      status: true,
      message: action === "accept" ? "Cancellation completed successfully." : "Cancellation request declined.",
      cancellation: booking.cancellation
    });
  } catch (error) {
    console.error("PROCESS CANCELLATION ERROR:", error);
    return res.status(500).json({ status: false, message: "Server Error processing cancellation." });
  }
};

// 5. Admin updates the airline PNR directly
export const adminUpdatePnr = async (req, res) => {
  try {
    const { id } = req.params;
    const { pnr } = req.body;

    if (!pnr || pnr.trim() === "") {
      return res.status(400).json({ status: false, message: "PNR cannot be empty." });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ status: false, message: "Booking not found." });
    }

    booking.airlinePnr = pnr.trim().toUpperCase();
    await booking.save();

    return res.status(200).json({
      status: true,
      message: "Airline PNR updated successfully.",
      airlinePnr: booking.airlinePnr
    });
  } catch (error) {
    console.error("ADMIN UPDATE PNR ERROR:", error);
    return res.status(500).json({ status: false, message: "Server Error updating PNR." });
  }
};

// --- RESCHEDULING WORKFLOW ---

// 6. User submits a request for a reschedule
export const requestReschedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { preferredDate, reason } = req.body;

    if (!preferredDate || !reason) {
      return res.status(400).json({ status: false, message: "Preferred date and reason are required." });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ status: false, message: "Booking not found." });
    }

    // Check if cancellation is already pending
    if (booking.cancellation && booking.cancellation.status === "pending") {
      return res.status(400).json({ status: false, message: "A cancellation request is already pending. You cannot reschedule while cancelling." });
    }

    booking.reschedule = {
      ...booking.reschedule,
      status: "pending",
      preferredDate: preferredDate,
      reason: reason,
      requestDate: new Date()
    };
    
    await booking.save();

    return res.status(200).json({
      status: true,
      message: "Reschedule request submitted successfully.",
      reschedule: booking.reschedule
    });
  } catch (error) {
    console.error("REQUEST RESCHEDULE ERROR:", error);
    return res.status(500).json({ status: false, message: "Server Error requesting reschedule." });
  }
};

// 7. Admin processes the reschedule request
export const adminProcessReschedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, newDate, newFlightNo, newTime, rescheduleFee, newPnr } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ status: false, message: "Booking not found." });
    }

    if (action === "accept") {
      if (!newDate || !newFlightNo || !newTime) {
         return res.status(400).json({ status: false, message: "New Date, Flight Number, and Time are required to accept a reschedule." });
      }

      booking.reschedule = {
        ...booking.reschedule,
        status: "processed",
        rescheduleFee: Number(rescheduleFee) || 0,
        newFlightDetails: {
          flightNumber: newFlightNo,
          departureTime: newTime,
          arrivalTime: "TBA", // Could prompt for this if needed, simplified for now
          pnr: newPnr || booking.airlinePnr
        },
        processDate: new Date()
      };

      // Overwrite the root booking parameters as requested by the user
      booking.travelDate = new Date(newDate);
      booking.flightDetails = newFlightNo; // Updating the flight text reference
      booking.departureTime = newTime;
      if (newPnr) booking.airlinePnr = newPnr;

    } else if (action === "reject") {
      booking.reschedule = {
        ...booking.reschedule,
        status: "declined",
        adminNotes: "Reschedule request was manually declined by Padham Travels Admin."
      };
    } else {
      return res.status(400).json({ status: false, message: "Invalid action."});
    }

    await booking.save();

    return res.status(200).json({
      status: true,
      message: action === "accept" ? "Reschedule completed successfully." : "Reschedule request declined.",
      reschedule: booking.reschedule
    });
  } catch (error) {
    console.error("PROCESS RESCHEDULE ERROR:", error);
    return res.status(500).json({ status: false, message: "Server Error processing reschedule." });
  }
};
