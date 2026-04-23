import axios from "axios";
import dotenv from "dotenv";
import { getAgencyToken } from "./services/agencyService.js";

dotenv.config();

async function debugAirIndiaReview() {
  const tokenId = await getAgencyToken();
  const searchPayload = {
    origin: "BOM",
    destination: "DEL",
    dDate: "2026-04-15",
    adt: 1,
    chd: 0,
    inf: 0,
    cabin: "Economy",
    tokenId: tokenId,
    companyCode: process.env.COMPANY_CODE,
  };

  console.log("Searching Air India flights...");
  const searchRes = await axios.post(`${process.env.FLIGHT_TEST_API_URL}/air/search/fare`, searchPayload);
  const flights = searchRes.data.results;
  
  // Find Air India flight
  const journeyKey = Object.keys(flights)[0];
  const flightsInJourney = flights[journeyKey];
  const airIndiaKey = Object.keys(flightsInJourney).find(k => k.includes("AI") || k.includes("IX"));
  
  if (!airIndiaKey) {
      console.log("No Air India flight found in search results.");
      process.exit(0);
  }

  console.log(`Reviewing Air India flight: ${airIndiaKey}`);
  
  const reviewPayload = {
    pollingId: searchRes.data.pollingId,
    index: airIndiaKey,
    tokenId: tokenId,
    companyCode: process.env.COMPANY_CODE,
  };

  const reviewRes = await axios.post(`${process.env.FLIGHT_TEST_API_URL}/air/price/price`, reviewPayload);
  console.log("AIR_INDIA_REVIEW_DATA:", JSON.stringify(reviewRes.data, null, 2));
  
  process.exit(0);
}

debugAirIndiaReview().catch(err => {
    console.error(err);
    process.exit(1);
});
