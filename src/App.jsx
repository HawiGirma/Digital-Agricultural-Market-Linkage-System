import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[var(--color-brand-cream)] transition-colors dark:bg-stone-950">
      <Header />

      <Outlet /> {/* pages go here */}

      <Footer />
    </div>
  );
}
export default App;
