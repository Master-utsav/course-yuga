import { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context state
interface AuthContextType {
  isSignupOpen: boolean;
  setIsSignupOpen: (value: boolean) => void;
}

// Create context with the shape
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};

// Create a provider for the AuthContext
export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <AuthContext.Provider value={{ isSignupOpen, setIsSignupOpen }}>
      {children}
    </AuthContext.Provider>
  );
};
