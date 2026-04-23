import fs from 'fs';

const filePath = 'd:/Vinod/Padham Travels/New Project/Padham_Travels/server/controllers/flights.controller.js';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the older fallback with the ultra-robust one
const searchPattern = /\/\/ Enhanced fallback: Aggregate from paxWiseFare if total was missing\s+if \(extractedCommission === 0 && bookData\.paxWiseFare\) \{[\s\S]*?\}\s+?\}/;

const robustFallback = `// --- Ultra-Robust Failsafe for Financial Data ---
        // 1. Commission Failsafe
        if ((!extractedCommission || parseFloat(extractedCommission) === 0)) {
           // Check bookData top levels
           extractedCommission = bookData.totalFare?.CMSN || bookData.commissionAmount || 0;
           
           // Check paxWiseFare aggregation
           const paxWise = bookData.paxWiseFare || (bookData.itineraries?.[0]?.paxWiseFare);
           if ((!extractedCommission || parseFloat(extractedCommission) === 0) && paxWise) {
              Object.keys(paxWise).forEach(pType => {
                 const pComm = paxWise[pType]?.comsn?.totalCmsn || paxWise[pType]?.totalCmsn || 0;
                 extractedCommission += parseFloat(pComm);
              });
           }
        }

        // 2. Total Fare Failsafe
        if ((!extractedAmount || parseFloat(extractedAmount) === 0)) {
           extractedAmount = bookData.totalFare?.TF || bookData.totalFare?.totalFare || bookData.TF || bookData.amount || 0;
           
           const paxWise = bookData.paxWiseFare || (bookData.itineraries?.[0]?.paxWiseFare);
           if ((!extractedAmount || parseFloat(extractedAmount) === 0) && paxWise) {
              Object.keys(paxWise).forEach(pType => {
                 const pTF = paxWise[pType]?.fare?.TF || paxWise[pType]?.TF || 0;
                 extractedAmount += parseFloat(pTF);
              });
           }
        }
     }`;

content = content.replace(searchPattern, robustFallback);

fs.writeFileSync(filePath, content);
console.log("✅ Backend ultra-robust commission logic patched successfully");
