import dotenv from "dotenv";
import axios from "axios";
// Importing the utility to get the Token Id from your Agency Login
import { getAgencyToken, clearTokenCache } from "../services/agencyService.js";
import { Booking } from "../models/booking.model.js";
import User from "../models/user.model.js";
import { WalletTransaction } from "../models/walletTransaction.model.js";

dotenv.config();

export const searchFlights = async (req, res) => {
  try {
    const {
      from, // Origin airport code (e.g., "DEL")
      to, // Destination airport code (e.g., "BOM")
      departDate, // "YYYY-MM-DD"
      returnDate, // Optional for roundtrip
      adults = 1,
      children = 0,
      infants = 0,
      tripType = "oneway", // "oneway" | "roundtrip"
      travelClass = "Economy",
    } = req.query;

    // 1. Basic Validation
    if (!from || !to || !departDate) {
      return res.status(400).json({
        status: false,
        message: "Origin, destination, and departDate are required.",
      });
    }

    // 2. Fetch the secure Token Id from your backend service
    const tokenId = await getAgencyToken();

    // 3. Construct the request body for the Flight API
    // Ensure cabin matches API expectations (Capitalized)
    const formatCabin = (cabin) => {
      if (!cabin) return "Economy";
      const lower = cabin.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    };

    const requestBody = {
      origin: from.toUpperCase(),
      destination: to.toUpperCase(),
      dDate: departDate,
      adt: Number(adults),
      chd: Number(children),
      inf: Number(infants),
      cabin: formatCabin(travelClass),
      tokenId: tokenId,
      companyCode: process.env.COMPANY_CODE, // From your .env file
    };

    // If it's a roundtrip, add the return date
    if (tripType === "roundtrip" && returnDate) {
      requestBody.rDate = returnDate;
    }

    console.log("Calling Flight API with:", requestBody);

    // 4. Make the call to the Test API endpoint
    const response = await axios.post(
      `${process.env.FLIGHT_TEST_API_URL}/air/search/fare`,
      requestBody,
    );

    const flightData = response.data;

    // 5. Check if the API returned results successfully
    if (flightData.resCode !== "200") {
      return res.status(400).json({
        status: false,
        message: flightData.resMessage || "API Error",
        data: flightData,
      });
    }

    // Transform results object to an array for the frontend
    let flightsList = [];
    if (flightData.results && typeof flightData.results === 'object') {
        // The API returns: results: { "BOMDELDATE": { "FLIGHT_ID_1": { OD:..., fares:... }, "FLIGHT_ID_2": {...} } }
        Object.entries(flightData.results).forEach(([journeyKey, journeyFlights]) => {
            if (typeof journeyFlights === 'object' && journeyFlights !== null) {
                Object.entries(journeyFlights).forEach(([flightKey, flightDetails]) => {
                    // Only add if it looks like a valid flight object (has OD and fares)
                    if (flightDetails && flightDetails.OD && flightDetails.fares) {
                        flightsList.push({
                            flightId: flightKey, // Use the specific flight ID
                            journeyId: journeyKey, // Keep track of the grouping key
                            ...flightDetails
                        });
                    }
                });
            }
        });
    }

    return res.status(200).json({
      status: true,
      flights: flightsList, // Return properly flattened array
      isFlights: flightData.isFlights,
      pollingId: flightData.pollingId,
    });
  } catch (error) {
    console.error(
      "FLIGHTS SEARCH ERROR:",
      error.response?.data || error.message,
    );
    return res.status(500).json({
      status: false,
      message: "Failed to fetch flights from the provider.",
    });
  }
};

export const reviewFlight = async (req, res) => {
  try {
    // Both are passed from the frontend for the specific selected flight
    const { pollingId, index } = req.body;
    
    if (!pollingId || !index) {
      return res.status(400).json({ status: false, message: "pollingId and index are required" });
    }

    const tokenId = await getAgencyToken();

    // 1. Request price details for review
    const reviewPayload = {
      pollingId,
      index, // Make sure index is a string
      tokenId,
      companyCode: process.env.COMPANY_CODE,
    };

    console.log("Calling Flight Price Review API with:", reviewPayload);

    const priceResponse = await axios.post(
      `${process.env.FLIGHT_TEST_API_URL}/air/price/price`,
      reviewPayload
    );

    const priceData = priceResponse.data;

    // Check if review returned success
    if (priceData.resCode !== "200") {
        return res.status(400).json({
            status: false,
            message: priceData.resMessage || "Failed to fetch price review",
            data: priceData,
        });
    }

    // Now we have searchId and priceId required to fetch the final detailed layout
    const { searchId, priceId } = priceData;
    
    // 2. Fetch full rules and detailed flight layout
    const fetchPayload = {
      tokenId,
      companyCode: process.env.COMPANY_CODE,
      searchId,
      priceId
    };
    
    console.log("Calling Flight Fetch Price Review API with:", fetchPayload);
    
    const fetchResponse = await axios.post(
      `${process.env.FLIGHT_TEST_API_URL}/air/fetch/price`,
      fetchPayload
    );
    
    const flightDetailsData = fetchResponse.data;
    
    // Sometimes the fetch endpoint may not return resCode immediately but return the nested object directly.
    if (flightDetailsData.resCode && flightDetailsData.resCode !== "200" && flightDetailsData.resCode !== "") {
        return res.status(400).json({
            status: false,
            message: flightDetailsData.resMessage || "Failed to fetch full flight details structure",
            data: flightDetailsData,
        });
    }

    return res.status(200).json({
      status: true,
      priceSummary: priceData,          // Contains latest total 'TF', 'ntf', etc
      flightDetails: flightDetailsData  // Contains passport mandates, baggage rules, full struct
    });
  } catch (error) {
    console.error("FLIGHTS REVIEW ERROR:", error.response?.data || error.message);
    return res.status(500).json({
      status: false,
      message: "Failed to review flight.",
    });
  }
};

export const bookFlight = async (req, res) => {
  try {
    const { searchId, priceId, pmode, details, travelDate, flightDetails, departureTime, arrivalTime, fcn, totalFare: bodyFare, commissionAmount: bodyCommission } = req.body;

    if (!searchId || !priceId || !pmode || !details) {
      return res.status(400).json({ status: false, message: "Missing required booking details (searchId, priceId, pmode, details)" });
    }

    const tokenId = await getAgencyToken();

    const bookPayload = {
      tokenId,
      companyCode: process.env.COMPANY_CODE,
      searchId,
      priceId,
      pmode: pmode || "cp",
      details
    };

    console.log("Calling Flight Book API with payload:", JSON.stringify(bookPayload));

    const bookResponse = await axios.post(
      `${process.env.FLIGHT_TEST_API_URL}/air/book/book`,
      bookPayload
    );

    const bookData = bookResponse.data;
    console.log("✈️ [BACKEND] Flight Book API Response:", JSON.stringify(bookData, null, 2));

    if (bookData.resCode !== "200") {
      return res.status(400).json({
        status: false,
        message: bookData.resMessage || "Booking failed",
        data: bookData,
      });
    }

    const finalBookRef = bookData.bookRef || bookData.ref || bookData.bookingId || bookData.pnr || `REF_${Date.now()}`;

    try {
      // Save to Database
      let customerName = "Passenger";
      let email = "N/A";
      let phone = "N/A";
      let paxCount = 1;

      let parsedTravelDate = new Date();
      if (travelDate) {
          const [year, month, day] = travelDate.split('-');
          parsedTravelDate = new Date(year, month - 1, day);
          parsedTravelDate.setMinutes(parsedTravelDate.getMinutes() - parsedTravelDate.getTimezoneOffset());
      }

      if (details && details.pax) {
        const paxKeys = Object.keys(details.pax);
        const firstAdt = paxKeys.find(k => k.startsWith('adt'));
        if (firstAdt) {
           const adt = details.pax[firstAdt];
           customerName = `${adt.title || ''} ${adt.firstName || ''} ${adt.lastName || ''}`.trim();
        }
        
        if (details.contact) {
           phone = `${details.contact.isd || ''} ${details.contact.mobile}`.trim();
           email = (details.contact.email || email).trim().toLowerCase();
        }
        paxCount = paxKeys.length;
      }



      // --- ULTRA-ROBUST FINANCIAL EXTRACTION ---
      let extractedAmount = bodyFare || bookData.totalFare?.TF || bookData.totalFare?.totalFare || bookData.TF || bookData.amount || 0;
      let extractedCommission = bodyCommission || bookData.comsn?.totalCmsn || bookData.totalFare?.CMSN || bookData.commissionAmount || 0;

      const paxWise = bookData.paxWiseFare || (bookData.itineraries?.[0]?.paxWiseFare);

      if ((!extractedAmount || parseFloat(extractedAmount) === 0) && paxWise) {
         let tempAmt = 0;
         Object.keys(paxWise).forEach(pType => {
            const typeCount = paxCount || 1; // Simplified for backend as it's a single passenger total usually
            const pTF = paxWise[pType]?.fare?.TF || paxWise[pType]?.TF || 0;
            tempAmt += parseFloat(pTF);
         });
         if (tempAmt > 0) extractedAmount = tempAmt;
      }

      if ((!extractedCommission || parseFloat(extractedCommission) === 0 || typeof extractedCommission === 'object') && paxWise) {
         let tempComm = 0;
         Object.keys(paxWise).forEach(pType => {
            const pComm = paxWise[pType]?.comsn?.totalCmsn || paxWise[pType]?.totalCmsn || 0;
            tempComm += parseFloat(pComm);
         });
         if (tempComm > 0) extractedCommission = tempComm;
      }
      
      if (extractedCommission > 0) extractedCommission = Math.round(extractedCommission * 100) / 100;

      const newBooking = new Booking({
        bookingRef: finalBookRef,
        customerName,
        email,
        phone,
        flightDetails: flightDetails || "Flight Booking via API",
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        travelDate: parsedTravelDate,
        bookingDate: new Date(),
        passengers: paxCount,
        amount: String(extractedAmount),
        commissionAmount: Number(extractedCommission),
        searchId,
        priceId,
        rawBookingData: {
          ...bookData,
          totalFareArg: bodyFare,
          commissionAmountArg: bodyCommission
        },
        fcn: fcn || "SAVER (REGULAR)",
        status: "Confirmed"
      });

      await newBooking.save();
      console.log("✅ Booking saved to database:", newBooking.bookingRef);

      // Wallet logic
      try {
          const userExists = await User.findOne({ email: new RegExp(`^\\s*${email}\\s*$`, "i"), role: "user" }).lean();
          if (userExists && extractedCommission > 0) {
              await WalletTransaction.create({
                  amount: extractedCommission,
                  type: "CREDIT",
                  description: `Commission earned from user booking by ${customerName} (${email})`,
                  bookingRef: newBooking.bookingRef
              });
              console.log(`✅ Commission credited to Admin Wallet: ${extractedCommission}`);
          }
      } catch (walletErr) {
          console.error("⚠️ Failed to credit Admin Wallet:", walletErr);
      }
      
    } catch (saveError) {
      console.error("⚠️ Failed to save booking to local DB:", saveError);
    }

    return res.status(200).json({
      status: true,
      message: "Booking successful",
      data: bookData,
      bookRef: finalBookRef // Explicitly return the normalized reference
    });

  } catch (error) {
    console.error("FLIGHTS BOOK ERROR:", error.response?.data || error.message);
    return res.status(500).json({
      status: false,
      message: "Failed to book flight.",
    });
  }
};

export const fetchFlightTicket = async (req, res) => {
  try {
    const { searchId, priceId, bookRef } = req.body;

    if (!searchId || !priceId || !bookRef || String(bookRef) === "undefined") {
      return res.status(400).json({ status: false, message: "Invalid or missing booking reference code" });
    }

    // Try finding it in our local database first to ensure we have a fallback for metadata
    let localBooking = null;
    try {
      localBooking = await Booking.findOne({ bookingRef: bookRef });
    } catch (e) {
      console.error("Local booking fetch failed", e);
    }

    const tokenId = await getAgencyToken();

    const fetchPayload = {
      tokenId,
      companyCode: process.env.COMPANY_CODE,
      searchId,
      priceId,
      bookRef
    };

    console.log("Calling Flight Fetch Book API with payload:", JSON.stringify(fetchPayload));

    const fetchResponse = await axios.post(
      `${process.env.FLIGHT_TEST_API_URL}/air/fetch/book`,
      fetchPayload
    );

    const ticketData = fetchResponse.data;
    console.log("========== 5-Fetch-Booking Response Data ==========");
    console.dir(ticketData, { depth: null, colors: true });
    console.log("===================================================");
    // Based on Postman sample, a successful fetch returns resCode "200" or similar
    if (ticketData.resCode && ticketData.resCode !== "200") {
      // Return 200 anyway so the frontend can receive and use localData as a fallback
      // instead of hitting the global catch block
      return res.status(200).json({
        status: false,
        message: ticketData.resMessage || "Failed to fetch booking details from provider, using local record",
        data: ticketData,
        localData: localBooking
      });
    }

    // Attempt to parse out PNRs and save them to the local database to fix missing PNRs in list views
    try {
        if (localBooking && ticketData && ticketData.trip) {
            let airlinePnr = "N/A";
            let gdsPnr = "N/A";
            
            // Extract PNR from passenger data if available
            const paxData = ticketData.trip.paxData || ticketData.paxData || {};
            for (const key in paxData) {
                const p = paxData[key];
                if (p.airlinePnr) airlinePnr = p.airlinePnr;
                if (p.gdsPnr) gdsPnr = p.gdsPnr;
                if (airlinePnr !== "N/A" || gdsPnr !== "N/A") break;
            }

            // Fallback: check bookDetail structure
            if (airlinePnr === "N/A" && ticketData.trip.bookDetail) {
                if (ticketData.trip.bookDetail.airlinePnr) airlinePnr = ticketData.trip.bookDetail.airlinePnr;
                if (ticketData.trip.bookDetail.gdsPnr) gdsPnr = ticketData.trip.bookDetail.gdsPnr;
            }

            // Sync to local DB mapping if found
            let needsUpdate = false;
            if (airlinePnr !== "N/A" && localBooking.airlinePnr !== airlinePnr) {
                localBooking.airlinePnr = airlinePnr;
                needsUpdate = true;
            }
            if (gdsPnr !== "N/A" && localBooking.gdsPnr !== gdsPnr) {
                localBooking.gdsPnr = gdsPnr;
                needsUpdate = true;
            }

            if (needsUpdate) {
                await localBooking.save();
                console.log("✅ Synced local booking with live PNRs:", { airlinePnr, gdsPnr });
            }
        }
    } catch (e) {
        console.error("Failed to sync local booking with PNRs", e);
    }

    return res.status(200).json({
      status: true,
      message: "Ticket fetched successfully",
      ticket: ticketData,
      localData: localBooking
    });

  } catch (error) {
    console.error("FLIGHTS FETCH BOOK ERROR:", error.response?.data || error.message);
    
    // Also try to send localData in the catch block if something else failed (like Axios timeout)
    const { bookRef } = req.body;
    let localBooking = null;
    try {
      if (bookRef) localBooking = await Booking.findOne({ bookingRef: bookRef });
    } catch(e) {}

    return res.status(200).json({
      status: false,
      message: "API error. Using local database fallback.",
      localData: localBooking
    });
  }
};

/* serp API code is commented out as we are now using a flight TEST API from client. The old code is kept here for reference and can be removed later if not needed.
import dotenv from "dotenv";
import { getJson } from "serpapi";

dotenv.config();

export const searchFlights = async (req, res) => {
  try {
    const {
      from, // e.g. "MAA" or "Chennai"
      to, // e.g. "DXB" or "Dubai"
      departDate, // "2025-01-20"
      returnDate, // optional for round trip
      adults = 1,
      currency = "INR",
      tripType = "oneway", // "oneway" | "roundtrip"
      travelClass,
      children = 0,
      infants = 0,
      stops, // "1"=nonstop, "2"=1 stop or fewer, etc.
      airline, // single airline code or name
    } = req.query;

    const benefits = Array.isArray(req.query.benefits)
      ? req.query.benefits
      : req.query.benefits
      ? [req.query.benefits]
      : [];

    console.log("search params:", {
      from,
      to,
      departDate,
      returnDate,
      tripType,
      travelClass,
      adults,
      children,
      infants,
      benefits,
      stops,
      airline,
    });

    if (!from || !to || !departDate) {
      return res.status(400).json({
        status: false,
        message: "from, to, and departDate are required",
      });
    }

    // Map UI tripType to SerpApi numeric type
    // 1 = round trip, 2 = one way
    let serpType = 2; // default one way
    if (tripType === "roundtrip") {
      serpType = 1;
    }

    // For round trip, we must have returnDate
    if (serpType === 1 && !returnDate) {
      return res.status(400).json({
        status: false,
        message: "returnDate is required for round trip searches",
      });
    }

    const params = {
      engine: "google_flights",
      api_key: process.env.SERPAPI_API_KEY,
      departure_id: from,
      arrival_id: to,
      outbound_date: departDate,
      currency,
      adults: Number(adults),
      type: serpType, // 1-oneway or 2-round trip
    };

    if (serpType === 1) {
      params.return_date = returnDate;
    }

    // SerpApi stops filter (0 any, 1 nonstop, 2 1 stop or fewer, 3 2 stops or fewer)
    if (stops) {
      params.stops = Number(stops);
    }

    // Airline filter: use include_airlines with IATA code if provided
    if (airline) {
      // Expect airline as 2‑letter code like "AI", "6E", "BA"
      params.include_airlines = airline;
    }

    //log what you are actually sending to SerpApi
    console.log("SerpApi params:", params);

    // Call SerpApi
    const data = await getJson(params);

    // Pick only what you need for frontend (keep it small)
    const bestFlights = data.best_flights || [];
    const otherFlights = data.other_flights || [];

    // ========= FETCH BOOKING OPTIONS WITH booking_token ========= but its not working as we dont have access
    // pick a flight to get booking options for (example: first best flight)
    //const firstBest = bestFlights[0];
    //const bookingToken = firstBest?.booking_token;

    //let bookingOptions = [];
    // let selectedFlights = [];
    // let baggagePrices = null;

    //if (bookingToken) {
    // SerpApi booking options API
    // const bookingParams = {
    //   engine: "google_flights_booking_options",
    //   api_key: process.env.SERPAPI_API_KEY,
    //   booking_token: bookingToken,
    // };

    // const bookingData = await getJson(bookingParams);

    // bookingOptions = bookingData.booking_options || [];
    //  selectedFlights = bookingData.selected_flights || [];
    // baggagePrices = bookingData.baggage_prices || null;
    // Shape per SerpApi docs: booking_options / selected_flights / baggage_prices[file:1]
    // }

    // ========= RETURN FLIGHTS + BOOKING OPTIONS TO FRONTEND =========
    return res.status(200).json({
      status: true,
      bestFlights,
      otherFlights,
      // bookingOptions,
      // selectedFlights,
      // baggagePrices,
    });
  } catch (error) {
    console.error("FLIGHTS SEARCH ERROR:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch flights",
    });
  }
};
*/
