import React, { useState } from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { countryStateCitiesData } from "@/constants/CountryStateCitiesData.ts"; // Adjust the import path as needed
import { ErrorToast, SuccessToast } from "@/lib/toasts";
import axios from "axios";
import { getVerifiedToken } from "@/lib/cookieService";
import { USER_API } from "@/lib/env";
import { getUserData as fetchUserData} from "@/lib/authService";
import { useAuthContext } from "@/context/authContext";
import { useCallback } from "react";

interface FormData {
  country: string;
  state: string;
  city: string;
}

const SelectAddressForm: React.FC = () => {
  const [states, setStates] = useState<
    { stateName: string; cities: { cityName: string }[] }[]
  >([]);
  const [cities, setCities] = useState<{ cityName: string }[]>([]);
  const [formData, setFormData] = useState<FormData>({
    country: "",
    state: "",
    city: "",
  });

  const {setUserData} = useAuthContext();
  const loadUserData = useCallback(async () => {
    const userData = await fetchUserData(); 
    if (userData) {
      setUserData(userData);
    }
  }, [setUserData]);

  const onSubmit = async () => {
    if (
      formData.city === "" ||
      formData.state === "" ||
      formData.country === ""
    ) {
      ErrorToast("Please select all the fields");
    } else {
      const address = formData;
      const jwt = getVerifiedToken();
      try {
        const response = await axios.put(
          `${USER_API}/update-user`,
          { address },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response && response.data && response.data.success) {
          SuccessToast(response.data.message);
          loadUserData();
        } else {
          ErrorToast(response.data.message);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        ErrorToast(error.response?.data?.message);
      }
    }
  };

  const handleCountryChange = (countryIndex: string) => {
    const countryData = countryStateCitiesData[parseInt(countryIndex)];
    setStates(countryData?.states || []);
    setCities([]);
    setFormData({
      ...formData,
      country: countryData.countryName,
      state: "",
      city: "",
    });
  };

  const handleStateChange = (stateIndex: string) => {
    const stateData = states[parseInt(stateIndex)];
    setCities(stateData?.cities || []);
    setFormData({
      ...formData,
      state: stateData.stateName,
      city: "",
    });
  };

  const handleCityChange = (cityIndex: string) => {
    setFormData({
      ...formData,
      city: cities[parseInt(cityIndex)].cityName,
    });
  };

  return (
    <div className="w-full flex sm:flex-row flex-col justify-between items-start px-2 py-4 gap-3 relative">
      {/* Country Selection */}
      <div className="w-full flex flex-col justify-start items-end gap-1">
        <Select
          label="Select Country"
          variant="bordered"
          onChange={(e) => handleCountryChange(e.target.value)}
          className="max-w-sm focus-visible:border-none focus-visible:outline-none"
        >
          {countryStateCitiesData.map((country, index) => (
            <SelectItem key={index} value={index.toString()}>
              {country.countryName}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* State Selection */}
      <div className="w-full flex flex-col justify-start items-end gap-1">
        <Select
          label="Select State"
          variant="bordered"
          onChange={(e) => handleStateChange(e.target.value)}
          className="max-w-sm focus-visible:border-none focus-visible:outline-none"
        >
          {states.map((state, index) => (
            <SelectItem key={index} value={index.toString()}>
              {state.stateName}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* City Selection */}
      <div className="w-full flex flex-col justify-start items-end gap-1">
        <Select
          label="Select City"
          variant="bordered"
          onChange={(e) => handleCityChange(e.target.value)}
          className="max-w-sm focus-visible:border-none focus-visible:outline-none"
        >
          {cities.map((city, index) => (
            <SelectItem key={index} value={index.toString()}>
              {city.cityName}
            </SelectItem>
          ))}
        </Select>
      </div>

      <Button
        type="button"
        onClick={onSubmit}
        className="max-sm:w-full font-medium font-ubuntu"
      >
        Update
      </Button>
    </div>
  );
};

export default SelectAddressForm;
