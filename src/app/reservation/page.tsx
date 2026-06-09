import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import ReservationClient from "./ReservationClient";

export default function ReservationPage() {
  return (
    <>
      <Navbar />
      <ReservationClient />
      <Footer />
    </>
  );
}
