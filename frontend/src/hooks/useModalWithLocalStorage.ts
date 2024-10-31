import { useEffect, useState } from "react";

const MODAL_OPEN_KEY = "modal-open-timestamp";
const THIRTY_MINUTES = 30 * 60 * 1000;

const useModalWithLocalStorage = () => {
  const initialCheck = () => {
    const lastOpened = localStorage.getItem(MODAL_OPEN_KEY);
    const now = Date.now();
    return !lastOpened || now - parseInt(lastOpened, 10) >= THIRTY_MINUTES;
  };

  const [isValidOpen, setIsValidOpen] = useState(initialCheck);

  useEffect(() => {
    // Only set isValidOpen initially; later, update only in intervals
    const now = Date.now();
    const lastOpened = localStorage.getItem(MODAL_OPEN_KEY);

    if (!lastOpened || now - parseInt(lastOpened, 10) >= THIRTY_MINUTES) {
      setIsValidOpen(true);
      localStorage.setItem(MODAL_OPEN_KEY, now.toString());
    } else {
      setIsValidOpen(false);
    }

    // Check every 30 minutes without causing re-renders in between
    const interval = setInterval(() => {
      const now = Date.now();
      const lastOpened = localStorage.getItem(MODAL_OPEN_KEY);

      if (!lastOpened || now - parseInt(lastOpened, 10) >= THIRTY_MINUTES) {
        setIsValidOpen(true);
        localStorage.setItem(MODAL_OPEN_KEY, now.toString());
      } else {
        setIsValidOpen(false);
      }
    }, THIRTY_MINUTES);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return { isValidOpen };
};

export default useModalWithLocalStorage;
