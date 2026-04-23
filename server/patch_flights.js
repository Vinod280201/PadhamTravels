import fs from 'fs';

const filePath = 'd:/Vinod/Padham Travels/New Project/Padham_Travels/server/controllers/flights.controller.js';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the hardcoded amount
content = content.replace(
    /amount: "Available via API", \/\/ Best effort, since amount isn't in this direct endpoint response/g,
    'amount: extractedAmount.toString(),'
);

// Add the extraction logic
content = content.replace(
    /const finalBookRef = bookData\.bookRef \|\| bookData\.ref \|\| bookData\.bookingId \|\| bookData\.pnr \|\| `REF_\${Date\.now\(\)}`;/g,
    'const finalBookRef = bookData.bookRef || bookData.ref || bookData.bookingId || bookData.pnr || `REF_${Date.now()}`;\n\n        // Extract Total Fare and Commission\n        const extractedAmount = bookData.totalFare?.TF || bookData.totalFare?.totalFare || bookData.TF || bookData.amount || 0;\n        const extractedCommission = bookData.totalFare?.CMSN || bookData.priceResponse?.commissionAmount || bookData.commissionAmount || 0;'
);

// Standardize rawBookingData
content = content.replace(
    /rawBookingData: bookData/g,
    'rawBookingData: { ...bookData, commissionAmount: (bookData.totalFare?.CMSN || bookData.commissionAmount || 0) }'
);

// Update commission logic
content = content.replace(
    /const commAmount = bookData\.priceResponse\?\.commissionAmount \|\| bookData\.commissionAmount \|\| 0;/g,
    'const commAmount = bookData.totalFare?.CMSN || bookData.priceResponse?.commissionAmount || bookData.commissionAmount || 0;'
);

fs.writeFileSync(filePath, content);
console.log("✅ File patched successfully");
