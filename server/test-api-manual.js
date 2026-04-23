import axios from "axios";

// Hardcoded for testing script - use .env in real app
const API_URL = "http://apidev.webandapi.com";
const AGENCY_EMAIL = "testapi@test.com";
const AGENCY_PASSWORD = "Apitest@2025";
const COMPANY_CODE = "EMT";

async function runTest() {
  try {
    // 1. Login
    console.log("Logging in...");
    const loginRes = await axios.post(`${API_URL}/user/login`, {
      email: AGENCY_EMAIL,
      password: AGENCY_PASSWORD,
      companyCode: COMPANY_CODE,
    });

    const tokenId = loginRes.data.tokenId;
    console.log("Got Token:", tokenId);

    // 2. Search
    console.log("Searching Flights...");
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dDate = futureDate.toISOString().split('T')[0];

    const searchBody = {
      origin: "DEL",
      destination: "BOM",
      dDate: dDate,
      adt: 1,
      chd: 0,
      inf: 0,
      cabin: "Economy",
      tokenId: tokenId,
      companyCode: COMPANY_CODE,
    };

    const searchRes = await axios.post(
      `${API_URL}/air/search/fare`,
      searchBody
    );

    console.log("Search Response Status:", searchRes.status);
    console.log("Search Response Code:", searchRes.data.resCode);
    
    if (searchRes.data.resCode === "200") {
        console.log("Full Response Keys:", Object.keys(searchRes.data));
         // Print just one result to see structure
         if (Array.isArray(searchRes.data.results)) {
            console.log("Results is an array. Length:", searchRes.data.results.length);
            console.log("Sample Result:", JSON.stringify(searchRes.data.results[0], null, 2));
         } else {
            console.log("Results is an object keys:", Object.keys(searchRes.data.results));
             const firstKey = Object.keys(searchRes.data.results)[0];
             console.log("Sample Result:", JSON.stringify(searchRes.data.results[firstKey], null, 2));
         }

    } else {
        console.log("Search Failed:", searchRes.data);
    }

  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
}

runTest();
