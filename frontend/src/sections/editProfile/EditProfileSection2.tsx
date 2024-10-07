import { useTheme } from "@/context/ThemeProvider";
import { CountryCodeData } from "@/constants";
import DobAndRoleForm from "@/components/editProfile/DobAndRoleForm";
import FirstAndLastNameForm from "@/components/editProfile/FirstAndLastNameForm";
import MobileNumberForm from "@/components/editProfile/MobileNumberForm";

interface CountryCodeData {
  countryname: string;
  countrycode: string;
  flagurl: string;
}

const EditProfileSection2 = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full flex flex-col justify-between items-start px-2 py-4 gap-3">
      <div className="relative w-full flex flex-col items-start justify-between gap-2">
        <FirstAndLastNameForm />
        <div className="flex flex-row w-full">
          <MobileNumberForm CountryCodeData={CountryCodeData} theme={theme} />
        </div>
        <DobAndRoleForm theme={theme} />
      </div>
    </div>
  );
};

export default EditProfileSection2;
