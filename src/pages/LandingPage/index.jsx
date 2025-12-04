import { BrandsScroller } from "../../components/BrandsScroller"
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"
import { HeaderNav } from "../../components/HeaderNav"
import { Services } from "../../components/Services"
import { TopBarContactUs } from "../../components/TopBarContactUs"
import { ToursAndTrips } from "../../components/ToursAndTrips"

export const LandingPage = () => {
    return (
        <div className="w-full h-screen box-border">
            <TopBarContactUs />
            {/* show nav only on small devices and keep it outside Header */}
            <div className="block lg:hidden">
                <HeaderNav />
            </div>
            <Header />
            <Services />
            <ToursAndTrips />
            <BrandsScroller />
            <Footer />
        </div>
    )
}