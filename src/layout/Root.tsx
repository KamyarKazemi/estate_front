import { Outlet } from "react-router-dom";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";

export default function Root() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
