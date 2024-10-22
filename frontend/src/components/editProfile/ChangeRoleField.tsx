import { useAuthContext } from '@/context/authContext';
import ProfileIcon from '@/Icons/ProfileIcon';
import { getVerifiedToken } from '@/lib/cookieService';
import { USER_API } from '@/lib/env';
import { userLogout } from '@/lib/getLocalStorage';
import { ErrorToast, SuccessToast, WarningToast } from '@/lib/toasts';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { Label } from '@radix-ui/react-dropdown-menu';
import axios from 'axios';
import React from 'react'
import {useNavigate} from "react-router-dom"

const ChangeRoleField: React.FC = () => {
    const [inputValue, setInputValue] = React.useState("");
    const {setIsLoggedIn} = useAuthContext();
    const [isInputValid, setIsInputValid] = React.useState(false);
    const { onClose, isOpen, onOpen } = useDisclosure();
    const navigate = useNavigate();

    const handleInputChange = (event: { target: { value: string } }) => {
        const { value } = event.target;
        setInputValue(value);
        setIsInputValid(value === "Confirm Role ADMIN");
    };

    async function handleConfirmAdmin(){
        if(inputValue.trim() === `Confirm Role ADMIN`){
            await confirmAdmin();
        }
        else{
            ErrorToast("Please enter the correct phrase")
        }
    }

    async function confirmAdmin () {
        const jwt = getVerifiedToken();
        const newRole = "ADMIN";
        try{
            const response = await axios.put(`${USER_API}/update-role` , {newRole} , {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                },
            })
            if(response && response.data && response.data.success){
                SuccessToast(response.data.message);
                userLogout();
                setIsLoggedIn(false);
                WarningToast("Please login again...")
                onClose();
                navigate("/login");
            }
            else{
                ErrorToast(response.data.message);
            } 
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (error: any) {
            ErrorToast(error.response?.data?.message);
        }
    }
    
  return (
    <div className='w-full px-2'>
        <Button
          className="dark:bg-green-600/50 bg-green-300 hover:bg-green-600 dark:hover:bg-green-500 transition-colors duration-200 font-semibold font-ubuntu text-black dark:text-white/80 w-full"
          onPress={onOpen}
        >
          Change Role
        </Button>
        <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
          <ModalContent className="sm:max-w-[480px] p-6 shadow-lg rounded-lg dark:bg-gray-800 bg-white">
          <ModalHeader className="flex flex-col gap-1">
                  <div className="w-full space-x-2 flex justify-start items-center">
                    <ProfileIcon fillColor="green" />
                    <span className="font-ubuntu text-2xl font-bold text-green-700 dark:text-green-400">
                      ADMIN ???
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base mt-2">
                    Are you sure? You want to be a{" "}
                    <span className="font-bold">ADMIN</span> 
                  </p>
                </ModalHeader>
            <ModalBody>
              <div className="gap-4 pb-4 flex flex-col justify-start items-center">
                {/* Warning List */}
                <ul className="w-full bg-gray-50 dark:bg-gray-900 text-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  {[
                    "You are able to add courses",
                    "Courses can be your personal, youtube and other external source",
                    "Manage/ Add videos in the courses.",
                   ].map((message, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <span className="text-green-600 dark:text-green-400 font-bold text-lg mr-2">
                        |
                      </span>
                      <span className="text-gray-800 dark:text-gray-300">
                        {message}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Confirmation Input Form */}
                <div className="w-full flex flex-col gap-3 mt-4">
                <Label>Type <span className="font-ubuntu font-semibold ">Confirm Role ADMIN {" "}</span>below</Label>
                  <Input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    className={`p-1 border-[1px] rounded-md w-full text-gray-900 dark:text-white dark:bg-gray-700 bg-gray-100 ${
                      inputValue !== "Confirm Role ADMIN" ? "border-red-300" : "border-green-500"
                    }`}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between mt-4">
              <Button
                color="success"
                type="submit"
                isDisabled={!isInputValid}
                variant="ghost"
                onClick={handleConfirmAdmin}
              >
                Confirm
              </Button>
              <Button color="default" onPress={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </div>
  )
}

export default ChangeRoleField
