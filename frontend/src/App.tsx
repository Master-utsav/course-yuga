import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./sections/Navbar";
import HeroSection from "./sections/HeroSection";
import { ThemeProvider } from "./context/ThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "./context/authContext";
// import { getVerifiedToken } from "./lib/cookieService";
// import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  // const [isVerified , setIsVerfied] = useState<boolean>(false);
  const { isLoggedIn } = useAuthContext();
  console.log(isLoggedIn);
  // useEffect(() => {
  //   const token = getVerifiedToken();
  //   if (token !== null || isLoggedIn) {
  //     setIsVerfied(true);
  //   }
  //   else{
  //     setIsVerfied(false);
  //   }
  // } , [isLoggedIn])
  

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="max-w-full mx-auto relative dark:bg-black bg-white">
        <Navbar isUserLoggedIn={isLoggedIn}/>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {isLoggedIn ? (
              <Route
                path="/"
                element={
                  <HeroSection />
                }
              />
            ) : (
              <>
                <Route
                  path="/signup"
                  element={<HeroSection />}
                />
                <Route
                  path="/login"
                  element={<HeroSection />}
                />
                <Route
                  path="/"
                  element={<HeroSection />}
                />
              </>
            )}
          </Routes>
        </AnimatePresence>
        <ToastContainer />
      </main>
    </ThemeProvider>
  );
}

export default App;
