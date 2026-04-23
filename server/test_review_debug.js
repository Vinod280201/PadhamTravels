import axios from "axios";
import dotenv from "dotenv";
import { getAgencyToken } from "./services/agencyService.js";

dotenv.config();

async function testReview() {
  const tokenId = await getAgencyToken();
  const searchPayload = {
    origin: "BOM",
    destination: "DEL",
    dDate: "2026-04-10",
    adt: 1,
    chd: 0,
    inf: 0,
    cabin: "Economy",
    tokenId: tokenId,
    companyCode: process.env.COMPANY_CODE,
  };

  console.log("Searching flights...");
  const searchRes = await axios.post(`${process.env.FLIGHT_TEST_API_URL}/air/search/fare`, searchPayload);
  const flights = searchRes.data.results;
  
  // Find first flight index
  const journeyKey = Object.keys(flights)[0];
  const flightKey = Object.keys(flights[journeyKey])[0];
  
  console.log(`Reviewing flight: ${flightKey} at index ${flightKey}`);
  
  const reviewPayload = {
    pollingId: searchRes.data.pollingId,
    index: flightKey,
    tokenId: tokenId,
    companyCode: process.env.COMPANY_CODE,
  };

  const reviewRes = await axios.post(`${process.env.FLIGHT_TEST_API_URL}/air/price/price`, reviewPayload);
  console.log("PRICE_REVIEW_DATA:", JSON.stringify(reviewRes.data, null, 2));
  
  process.exit(0);
}

testReview().catch(err => {
    console.error(err);
    process.exit(1);
});
