import { useEffect, useState } from "react";

const MODAL_OPEN_KEY = "modal-open-timestamp"; // LocalStorage Key
const THIRTY_MINUTES = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Custom hook to manage modal state with localStorage.
 * It ensures the modal is opened only once every 30 minutes.
 */
const useModalWithLocalStorage = () => {
  const [isValidOpen, setIsValidOpen] = useState(false);

  useEffect(() => {
    const checkModalState = () => {
      const lastOpened = localStorage.getItem(MODAL_OPEN_KEY);
      const now = Date.now();

      if (!lastOpened || now - parseInt(lastOpened) >= THIRTY_MINUTES) {
        setIsValidOpen(true); // Open modal if 30 minutes passed
        localStorage.setItem(MODAL_OPEN_KEY, now.toString()); // Update timestamp
      } else {
        setIsValidOpen(false); // Keep it closed within 30 minutes
      }
    };

    checkModalState(); // Check modal state on component mount

    const interval = setInterval(checkModalState, 1000 * 60); // Recheck every minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return {isValidOpen};
};

export default useModalWithLocalStorage;
