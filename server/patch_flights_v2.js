import fs from 'fs';

const filePath = 'd:/Vinod/Padham Travels/New Project/Padham_Travels/server/controllers/flights.controller.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update the destructuring at the top of bookFlight
content = content.replace(
    /const { searchId, priceId, pmode, details, travelDate, flightDetails, departureTime, arrivalTime, fcn } = req\.body;/g,
    'const { searchId, priceId, pmode, details, travelDate, flightDetails, departureTime, arrivalTime, fcn, totalFare: bodyFare, commissionAmount: bodyCommission } = req.body;'
);

// 2. Refine the extraction logic to use bodyFare and bodyCommission as primary/fallback sources
content = content.replace(
    /const extractedAmount = bookData\.totalFare\?\.TF \|\| bookData\.totalFare\?\.totalFare \|\| bookData\.TF \|\| bookData\.amount \|\| 0;/g,
    'const extractedAmount = bodyFare || bookData.totalFare?.TF || bookData.totalFare?.totalFare || bookData.TF || bookData.amount || 0;'
);

content = content.replace(
    /const extractedCommission = bookData\.totalFare\?\.CMSN \|\| bookData\.priceResponse\?\.commissionAmount \|\| bookData\.commissionAmount \|\| 0;/g,
    'const extractedCommission = bodyCommission || bookData.totalFare?.CMSN || bookData.priceResponse?.commissionAmount || bookData.commissionAmount || 0;'
);

fs.writeFileSync(filePath, content);
console.log("✅ File patched successfully with body-fallbacks");
