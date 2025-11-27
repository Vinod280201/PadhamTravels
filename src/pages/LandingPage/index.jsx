import { BrandsScroller } from "../../components/BrandsScroller"
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"
import { Services } from "../../components/Services"
import { TopBarContactUs } from "../../components/TopBarContactUs"
import { ToursAndTrips } from "../../components/ToursAndTrips"

export const LandingPage = () => {
    return (
        <div className="w-screen h-screen">
            <TopBarContactUs />
            <Header />
            <Services />
            <ToursAndTrips />
            <BrandsScroller />
            <Footer />
        </div>
    )
}