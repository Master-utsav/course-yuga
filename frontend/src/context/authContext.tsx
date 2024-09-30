import { LoginUserDataProps } from "@/constants";
import { getVerifiedToken, setTokenCookie } from "@/lib/cookieService";
import { getLocalStorageuserData } from "@/lib/getLocalStorage";
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface AuthContextType {
  isSignupOpen: boolean;
  setIsSignupOpen: (value: boolean) => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (value: boolean) => void;
  userData: LoginUserDataProps | null;
  setUserData: (user: LoginUserDataProps) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  localStorageUserData: LoginUserDataProps | null;
  setLocalStorageUserData: (user: LoginUserDataProps) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<LoginUserDataProps | null>(null);
  const [localStorageUserData, setLocalStorageUserData] = useState<LoginUserDataProps | null>(null);

  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      setTokenCookie(tokenFromUrl); 
    }

    const verifiedToken = getVerifiedToken();
    if (verifiedToken) {
      const storedUserData = getLocalStorageuserData();
      if (storedUserData) {
        setLocalStorageUserData(storedUserData);
        setUserData(storedUserData); 
      } else {
        const newUserData: LoginUserDataProps = {
          userName: urlParams.get("userName") || "unknown_username",
          firstName: urlParams.get("firstName") || "Unknown",
          lastName: urlParams.get("lastName") || "Guest",
          email: urlParams.get("email") || "",
          emailVerificationStatus: urlParams.get("emailVerificationStatus") === 'true',
          profileImageUrl: urlParams.get("profileImageUrl") || "",
        };

        setUserData(newUserData);
        window.location.href = import.meta.env.VITE_PUBLIC_FRONTEND_DOMAIN!
      }
    }
  }, []);

  useEffect(() => {
    const verifiedToken = getVerifiedToken();
    if (userData !== null) {
      localStorage.setItem("userData", JSON.stringify(userData));
      setLocalStorageUserData(userData);
    }
    setIsLoggedIn(!!verifiedToken); 
  }, [userData]);

  return (
    <AuthContext.Provider value={{ 
      isSignupOpen, 
      setIsSignupOpen, 
      isLoginOpen, 
      setIsLoginOpen, 
      userData, 
      setUserData, 
      isLoggedIn, 
      setIsLoggedIn, 
      localStorageUserData, 
      setLocalStorageUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
