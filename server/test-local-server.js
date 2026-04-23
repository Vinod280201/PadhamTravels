import axios from "axios";

const API_URL = "http://localhost:3000/api/flights/search";

async function testLocalServer() {
  try {
    console.log("Testing local server endpoint:", API_URL);
    const params = {
      from: "DEL",
      to: "BOM",
      departDate: "2026-02-21",
      adults: 1,
      travelClass: "Economy"
    };
    
    const response = await axios.get(API_URL, { params });
    console.log("Response Status:", response.status);
    console.log("Response Data Keys:", Object.keys(response.data));
    
    if (response.data.flights && response.data.flights.length > 0) {
        const firstFlight = response.data.flights[0];
        console.log("First Flight Keys:", Object.keys(firstFlight));
        console.log("First Flight Sample:", JSON.stringify(firstFlight, null, 2));
    } else {
        console.log("No flights found in response.");
    }
  } catch (error) {
    if (error.response) {
      console.error("Error Response Status:", error.response.status);
      console.error("Error Response Data:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }
  }
}

testLocalServer();
