import Header from "../components/header";
import Banner from "../components/banner";
import Introduction from "../components/introduction";
import Cooperation from "../components/cooperation";
import Activities from "../components/activities";
import Events from "../components/events";
import Products from "../components/products";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div className="justify-center items-center">
      <Header />
      <div className="container mx-auto w-9/10 mt-10">
        <div className="flex gap-4">
          <div className="w-3/10"><Introduction /></div>
          <div className="w-7/10"><Banner /></div>
        </div>
        <Cooperation />
        <Activities />
        <Events />
        <Products />
      </div>
      <Footer />
    </div>
  );
}