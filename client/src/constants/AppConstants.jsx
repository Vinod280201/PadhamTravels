import KashmirImage from "../assets/kashmir.jpg";
import HimachalImage from "../assets/himachal.avif";
import KeralaImage from "../assets/kerala.jpg";
import RajasthanImage from "../assets/Rajasthan.jpg";
import ManaliImage from "../assets/manali.jpg";
import GoaImage from "../assets/goa.jpg";
import MumbaiImage from "../assets/mumbai.jpg";
import AgraImage from "../assets/agra.jpg";

// Home page tours & packages data
export const TOURS_AND_PACKAGES = [
  {
    id: 1,
    title: "Explore the Kashmir",
    amount: "Rs.4999",
    image: KashmirImage,
    isPopular: true,
  },
  {
    id: 2,
    title: "Explore the Himachal",
    amount: "Rs.4999",
    image: HimachalImage,
    isPopular: true,
  },
  {
    id: 3,
    title: "Explore the Kerala",
    amount: "Rs.4999",
    image: KeralaImage,
    isPopular: true,
  },
  {
    id: 4,
    title: "Explore the Rajasthan",
    amount: "Rs.4999",
    image: RajasthanImage,
    isPopular: true,
  },
  {
    id: 5,
    title: "Explore the Manali",
    amount: "Rs.4999",
    image: ManaliImage,
    isPopular: true,
  },
  {
    id: 6,
    title: "Explore the Goa",
    amount: "Rs.4999",
    image: GoaImage,
    isPopular: false,
  },
  {
    id: 7,
    title: "Explore the Mumbai",
    amount: "Rs.4999",
    image: MumbaiImage,
    isPopular: false,
  },
  {
    id: 8,
    title: "Explore the Agra",
    amount: "Rs.4999",
    image: AgraImage,
    isPopular: true,
  },
];

// Admin → Manage Bookings table data
export const BOOKINGS = [
  {
    id: "BK-1001",
    bookingRef: "PDM2501001",
    customer: "Rajesh Kumar",
    email: "rajesh.k@email.com",
    flight: "AI-202 DEL → BLR",
    date: "2025-12-03",
    passengers: 2,
    amount: "₹8,400",
    status: "Confirmed",
  },
  {
    id: "BK-1002",
    bookingRef: "PDM2501002",
    customer: "Priya Sharma",
    email: "priya.s@email.com",
    flight: "6E-456 BOM → GOI",
    date: "2025-12-08",
    passengers: 1,
    amount: "₹2,800",
    status: "Pending",
  },
  {
    id: "BK-1003",
    bookingRef: "PDM2501003",
    customer: "Amit Patel",
    email: "amit.p@email.com",
    flight: "SG-789 HYD → CCU",
    date: "2025-12-12",
    passengers: 3,
    amount: "₹15,600",
    status: "Confirmed",
  },
  {
    id: "BK-1004",
    bookingRef: "PDM2501004",
    customer: "Sneha Reddy",
    email: "sneha.r@email.com",
    flight: "UK-321 DEL → DXB",
    date: "2025-12-18",
    passengers: 2,
    amount: "₹15,600",
    status: "Confirmed",
  },
  {
    id: "BK-1005",
    bookingRef: "PDM2501005",
    customer: "Vikram Singh",
    email: "vikram.s@email.com",
    flight: "AI-105 BLR → SIN",
    date: "2025-12-18",
    passengers: 1,
    amount: "₹6,500",
    status: "Cancelled",
  },
  {
    id: "BK-1006",
    bookingRef: "PDM2501006",
    customer: "Anjali Desai",
    email: "anjali.d@email.com",
    flight: "6E-234 DEL → GOA",
    date: "2025-12-18",
    passengers: 4,
    amount: "₹12,000",
    status: "Confirmed",
  },
  {
    id: "BK-1007",
    bookingRef: "PDM2501007",
    customer: "Rahul Verma",
    email: "rahul.v@email.com",
    flight: "AI-567 BOM → LON",
    date: "2025-12-22",
    passengers: 2,
    amount: "₹82,000",
    status: "Pending",
  },
  {
    id: "BK-1008",
    bookingRef: "PDM2501008",
    customer: "Kavita Nair",
    email: "kavita.n@email.com",
    flight: "SG-890 MAA → DXB",
    date: "2025-12-25",
    passengers: 3,
    amount: "₹24,300",
    status: "Confirmed",
  },
];

const CONSTANTS = {
  TOURS_AND_PACKAGES,
  BOOKINGS,
};

export const AIRLINE_MAP = {
  "AI": "Air India",
  "6E": "IndiGo",
  "SG": "SpiceJet",
  "UK": "Vistara",
  "I5": "AIX Connect",
  "IX": "Air India Express",
  "QP": "Akasa Air",
  "G8": "Go First",
  "2T": "TruJet",
  "9I": "Alliance Air",
  // Add common international airlines if needed
  "EK": "Emirates",
  "QR": "Qatar Airways",
  "EY": "Etihad Airways",
  "SQ": "Singapore Airlines",
  "CX": "Cathay Pacific",
  "BA": "British Airways",
  "LH": "Lufthansa",
  "AF": "Air France",
  "MH": "Malaysia Airlines",
  "TG": "Thai Airways"
};

export const AIRPORT_MAP = {
  "DEL": "Indira Gandhi Int'l, New Delhi",
  "BOM": "Chhatrapati Shivaji Maharaj Int'l, Mumbai",
  "BLR": "Kempegowda Int'l, Bengaluru",
  "HYD": "Rajiv Gandhi Int'l, Hyderabad",
  "MAA": "Chennai Int'l, Chennai",
  "CCU": "Netaji Subhash Chandra Bose Int'l, Kolkata",
  "AMD": "Sardar Vallabhbhai Patel Int'l, Ahmedabad",
  "COK": "Cochin Int'l, Kochi",
  "PNQ": "Pune Airport, Pune",
  "GOI": "Dabolim Airport, Goa",
  "GOX": "Manohar Int'l, Goa",
  "NMI": "Navi Mumbai Int'l, Navi Mumbai",
  "DXB": "Dubai Int'l, Dubai",
  "BHO": "Raja Bhoj Airport, Bhopal",
  "LKO": "Chaudhary Charan Singh Int'l, Lucknow",
  "JAI": "Jaipur Int'l, Jaipur",
  "PAT": "Jay Prakash Narayan Airport, Patna",
  "TRV": "Trivandrum Int'l, Thiruvananthapuram",
  "VNS": "Lal Bahadur Shastri Int'l, Varanasi",
  "GAU": "Lokpriya Gopinath Bordoloi Int'l, Guwahati",
  "IXB": "Bagdogra Int'l, Siliguri",
  "IXC": "Shaheed Bhagat Singh Int'l, Chandigarh"
};

export default CONSTANTS;
