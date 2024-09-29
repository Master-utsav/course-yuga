import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./sections/Navbar";
import HeroSection from "./sections/HeroSection";
import { ThemeProvider } from "./context/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <main className="max-w-full mx-auto relative dark:bg-black bg-white">
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    // <PageTransitionBoxAnimation className="bg-white" >
                      <HeroSection /> 
                    /* </PageTransitionBoxAnimation> */
                  }
                />
                <Route
                  path="/signup"
                  element={
                      <HeroSection />
                  }
                />
                <Route
                  path="/login"
                  element={
                      <HeroSection />
                  }
                />
              </Routes>
            </AnimatePresence>
            <ToastContainer/>
          </main>
          </ThemeProvider>
  );
}

export default App;
