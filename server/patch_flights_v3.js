import fs from 'fs';

const filePath = 'd:/Vinod/Padham Travels/New Project/Padham_Travels/server/controllers/flights.controller.js';
let content = fs.readFileSync(filePath, 'utf8');

// Use a more flexible regex to handle indentation differences
content = content.replace(
    /const extractedCommission = bodyCommission \|\| bookData\.totalFare\?\.CMSN \|\| bookData\.priceResponse\?\.commissionAmount \|\| bookData\.commissionAmount \|\| 0;/g,
    'let extractedCommission = bodyCommission || bookData.totalFare?.CMSN || bookData.priceResponse?.commissionAmount || bookData.commissionAmount || 0;\n\n         // Enhanced fallback: Aggregate from paxWiseFare if total was missing\n         if (extractedCommission === 0 && bookData.paxWiseFare) {\n           Object.keys(bookData.paxWiseFare).forEach(pType => {\n             const pComm = bookData.paxWiseFare[pType]?.comsn?.totalCmsn || 0;\n             extractedCommission += parseFloat(pComm);\n           });\n         }'
);

fs.writeFileSync(filePath, content);
console.log("✅ Backend commission logic patched successfully");
