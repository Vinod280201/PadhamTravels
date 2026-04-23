import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { AdminDashboard } from "./pages/AdminPages/AdminDashboard.jsx";
import { Toaster } from "sonner";
import { RequireAuth } from "./routes/RequireAuth.jsx";
import { FlightsSearchPage } from "./pages/FlightBookingPage/FlightsSearchPage";
import { FlightsSearchResultsPage } from "./pages/FlightBookingPage/FlightsSearchResultsPage";
import ManageBookings from "./pages/AdminPages/ManageBookings";
import BookingCalendar from "./pages/AdminPages/BookingCalendar";
import ManageTours from "./pages/AdminPages/ManageTours";
import { BookFlights } from "./pages/AdminPages/BookFlights";
import { FlightBookingDetails } from "./pages/AdminPages/FlightBookingDetails";
import { FlightTicketPage } from "./pages/AdminPages/FlightTicketPage";
import ManageWallet from "./pages/AdminPages/ManageWallet";
import AdminLayout from "./pages/AdminPages/AdminLayout";
import ToursDisplay from "./pages/ToursAndPackages/ToursDisplay";
import AboutUs from "./pages/AboutUsPage";
import TermsAndConditions from "./pages/TermsAndConditions";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { ManageDeals } from "./pages/AdminPages/ManageDeals";
import { RequestManager } from "./pages/AdminPages/RequestManager";
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* --- PUBLIC ROUTES (Accessible by everyone) --- */}
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />

          {/* MOVING THESE TO PUBLIC (Recommended for Travel Apps) */}
          <Route path="/flights" element={<FlightsSearchPage />} />
          <Route
            path="/flights/search-results"
            element={<FlightsSearchResultsPage />}
          />
          <Route path="/book-flight-details" element={<FlightBookingDetails />} />
          <Route path="/flight-ticket" element={<FlightTicketPage />} />
          <Route path="/tours-and-packages" element={<ToursDisplay />} />

          {/* --- PROTECTED ROUTES (User must be logged in) --- */}
          {/* We wrap these in a Layout Route to apply RequireAuth to all children */}

          <Route element={<RequireAuth />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin Section */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="book-flights" element={<BookFlights />} />
              <Route path="book-flight-details" element={<FlightBookingDetails />} />
              <Route path="flight-ticket" element={<FlightTicketPage />} />
              <Route path="manage-bookings" element={<ManageBookings />} />
              <Route path="manage-deals" element={<ManageDeals />} />
              <Route path="manage-tours" element={<ManageTours />} />
              <Route path="manage-wallet" element={<ManageWallet />} />
              <Route path="booking-calendar" element={<BookingCalendar />} />
              <Route path="manage-requests" element={<RequestManager />} />
            </Route>
          </Route>

          {/* --- 404 NOT FOUND --- */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
