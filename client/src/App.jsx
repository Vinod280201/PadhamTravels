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
import AdminLayout from "./pages/AdminPages/AdminLayout";
import ToursDisplay from "./pages/ToursAndPackages/ToursDisplay";
import AboutUs from "./pages/AboutUsPage";
import TermsAndConditions from "./pages/TermsAndConditions";
import { HomePage } from "./pages/HomePage";

function App() {
  return (
    <div>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            {/* /admin */}
            <Route index element={<AdminDashboard />} />
            {/* /admin/dashboard */}
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* /admin/book-flights */}
            <Route path="book-flights" element={<BookFlights />} />
            {/* /admin/manage-bookings */}
            <Route path="manage-bookings" element={<ManageBookings />} />
            {/* /admin/manage-tours */}
            <Route path="manage-tours" element={<ManageTours />} />
            {/* /admin/booking-calendar */}
            <Route path="booking-calendar" element={<BookingCalendar />} />
          </Route>
          <Route
            path="/flights"
            element={
              <RequireAuth>
                <FlightsSearchPage />
              </RequireAuth>
            }
          />
          <Route
            path="/flights/search-results"
            element={
              <RequireAuth>
                <FlightsSearchResultsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/tours-and-packages"
            element={
              <RequireAuth>
                <ToursDisplay />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
