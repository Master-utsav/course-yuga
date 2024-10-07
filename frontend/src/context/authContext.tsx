import { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { getVerifiedToken, setTokenCookie } from "@/lib/cookieService";
import { SuccessToast, WarningToast } from "@/lib/toasts";
import { getUserData as fetchUserData } from "@/lib/authService"; // Import the utility function
import React from "react";
import { defaultUserData } from "@/constants";

export interface UserDataProps {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  userName: string;
  profileImageUrl: string;
  emailVerificationStatus: boolean;
  phoneNumber: {
    code: string;
    number: string;
  };
  phoneNumberVerificationStatus: boolean;
  address: string;
  bio: string;
  userDob: string;
  role: string;
  avatarFallbackText: string;
}

interface AuthContextType {
  userData: UserDataProps;
  setUserData: (user: UserDataProps) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  localStorageUserData: UserDataProps;
  setLocalStorageUserData: (user: UserDataProps) => void;
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserDataProps>(defaultUserData);
  const [localStorageUserData, setLocalStorageUserData] = useState<UserDataProps>(defaultUserData);

  const loadUserData = useCallback(async () => {
    const userData = await fetchUserData(); 
    if (userData) {
      setUserData(userData);
      setLocalStorageUserData(userData);
      localStorage.setItem("userData", JSON.stringify(userData));
    }
  }, []);

  

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      setTokenCookie(tokenFromUrl); 
      SuccessToast("Login Successfully");
      WarningToast("Update your profile");
    }

    const verifiedToken = getVerifiedToken();
    if (verifiedToken) {
      loadUserData();
    }

    setIsLoggedIn(!!verifiedToken); 
  }, [loadUserData]);

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        isLoggedIn,
        setIsLoggedIn,
        localStorageUserData,
        setLocalStorageUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
