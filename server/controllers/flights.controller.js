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
