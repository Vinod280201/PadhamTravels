import fs from 'fs';

const filePath = 'd:/Vinod/Padham Travels/New Project/Padham_Travels/server/controllers/flights.controller.js';
const lines = fs.readFileSync(filePath, 'utf8').split('\n');

// Segment 1: Start to line 310 (1-indexed)
const head = lines.slice(0, 310);

// Fix the corrupted line 311:
// Currently: const userExists = await User.findOne({ email: new RegExp(`^\\s*${email}\\s*import dotenv from "dotenv";
const fixedLine311 = '          const userExists = await User.findOne({ email: new RegExp(`^\\\\s*\${email}\\\\s*$`, "i"), role: "user" }).lean();';

// Segment 2: Skip the duplication (311 to 507) and the broken tail (508)
// Lines 311 to 508 in the file (indices 310 to 507) are the corruption.
const tail = lines.slice(508); // Start from line 509 (index 508)

const finalContent = [...head, fixedLine311, ...tail].join('\n');

fs.writeFileSync(filePath, finalContent);
console.log("✅ flights.controller.js de-corrupted and restored successfully");
