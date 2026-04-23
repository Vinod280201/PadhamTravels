import fs from 'fs';

const filePath = 'd:/Vinod/Padham Travels/New Project/Padham_Travels/server/controllers/flights.controller.js';
let content = fs.readFileSync(filePath, 'utf8');

const newBookFlight = `export const bookFlight = async (req, res) => {
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
      \`\${process.env.FLIGHT_TEST_API_URL}/air/book/book\`,
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
           customerName = \`\${adt.title || ''} \${adt.firstName || ''} \${adt.lastName || ''}\`.trim();
        }
        
        if (details.contact) {
           phone = \`\${details.contact.isd || ''} \${details.contact.mobile}\`.trim();
           email = (details.contact.email || email).trim().toLowerCase();
        }
        paxCount = paxKeys.length;
      }

      const finalBookRef = bookData.bookRef || bookData.ref || bookData.bookingId || bookData.pnr || \`REF_\${Date.now()}\`;

      // --- ULTRA-ROBUST FINANCIAL EXTRACTION ---
      let extractedAmount = bodyFare || bookData.totalFare?.TF || bookData.totalFare?.totalFare || bookData.TF || bookData.amount || 0;
      let extractedCommission = bodyCommission || bookData.comsn?.totalCmsn || bookData.totalFare?.CMSN || bookData.commissionAmount || 0;

      const paxWise = bookData.paxWiseFare || (bookData.itineraries?.[0]?.paxWiseFare);

      if ((!extractedAmount || parseFloat(extractedAmount) === 0) && paxWise) {
         let tempAmt = 0;
         Object.keys(paxWise).forEach(pType => {
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
        amount: String(extractedAmount),
        commissionAmount: Number(extractedCommission),
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
          const userExists = await User.findOne({ email: new RegExp(\`^\\\\s*\${email}\\\\s*$\`, "i"), role: "user" }).lean();
          if (userExists && extractedCommission > 0) {
              await WalletTransaction.create({
                  amount: extractedCommission,
                  type: "CREDIT",
                  description: \`Commission earned from user booking by \${customerName} (\${email})\`,
                  bookingRef: newBooking.bookingRef
              });
              console.log(\`✅ Commission credited to Admin Wallet: \${extractedCommission}\`);
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
      data: bookData
    });

  } catch (error) {
    console.error("FLIGHTS BOOK ERROR:", error.response?.data || error.message);
    return res.status(500).json({
      status: false,
      message: "Failed to book flight.",
    });
  }
};`;

// Use a regex to replace the entire export const bookFlight function
const functionRegex = /export const bookFlight = async \(req, res\) => \{[\s\S]*?\n\};/;
content = content.replace(functionRegex, newBookFlight);

fs.writeFileSync(filePath, content);
console.log("✅ Backend bookFlight controller cleaned and overwritten successfully");
