import axios from "axios";

let tokenId = null;

// This allows other files to check if we have a token
export const getCachedToken = () => {
  return tokenId;
};

// This is what the error is complaining about - it must be exported!
export const clearTokenCache = () => {
  tokenId = null;
  console.log("🗑️ Agency Token Cache cleared.");
};

export const getAgencyToken = async (email, password, companyCode) => {
  try {
    // If we already have a valid token, return it
    if (tokenId) {
      return tokenId;
    }

    const payload = {
      // Use provided creds OR fallback to .env values for automatic sync
      email: email || process.env.AGENCY_TEST_EMAIL,
      password: password || process.env.AGENCY_TEST_PASSWORD,
      companyCode: companyCode || process.env.COMPANY_CODE,
    };

    const response = await axios.post(
      "http://apidev.webandapi.com/user/login",
      payload,
    );

    if (response.data?.tokenId) {
      tokenId = response.data.tokenId;
      return tokenId;
    }
    throw new Error("Invalid response from Agency API");
  } catch (error) {
    console.error("Agency Login Service Error:", error.message);
    throw error;
  }
};

