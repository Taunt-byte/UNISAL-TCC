import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { HomePage } from "./HomePage/page";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans">
               <Navbar />
               <HomePage />
              <Footer />
    </div>
  );
}
