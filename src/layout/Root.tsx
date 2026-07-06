import { Outlet } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";

export default function Root() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
