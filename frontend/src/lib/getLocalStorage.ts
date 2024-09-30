import { removeTokenCookie } from "./cookieService";

export const getLocalStorageuserData = () =>{
    const userData = localStorage.getItem("userData");
    if (userData) {
      return JSON.parse(userData);
    } else {
      return null;
    }
  }

export const userLogout = () => {
  localStorage.removeItem("userData");
  removeTokenCookie();
} 