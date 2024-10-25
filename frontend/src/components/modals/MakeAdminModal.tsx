import React from 'react';
import { Label } from '../ui/label';
import { Button } from '@nextui-org/react';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@nextui-org/react';
import ProfileIcon from '@/Icons/ProfileIcon';
import { useNavigate } from 'react-router-dom';

interface MakeAdminModalProps{
    isValidOpen: boolean
}
const MakeAdminModal: React.FC<MakeAdminModalProps> = ({isValidOpen}) => {
  const [isOpen , setIsOpen] = React.useState<boolean>(isValidOpen);
  const navigate = useNavigate();

  return (
    <Modal backdrop="opaque" isOpen={isOpen} onClose={() => setIsOpen(!isOpen)}>
      <ModalContent className="sm:max-w-[480px] p-6 shadow-lg rounded-lg dark:bg-gray-800 bg-white">
        <ModalHeader className="flex flex-col gap-1">
          <div className="w-full space-x-2 flex justify-start items-center">
            <ProfileIcon fillColor="green" />
            <span className="font-ubuntu text-2xl font-bold text-green-700 dark:text-green-400">
              Change Your Role
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base mt-2">
            By changing your role to 
            <span className="font-bold"> ADMIN</span>, you'll unlock the following privileges:
          </p>
        </ModalHeader>

        <ModalBody>
          <div className="gap-4 pb-4 flex flex-col justify-start items-center">
            {/* Privileges List */}
            <ul className="w-full bg-gray-50 dark:bg-gray-900 text-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              {[
                "Manage user accounts and permissions.",
                "Access advanced analytics and system logs.",
                "Perform critical actions like editing or deleting content.",
                "View and modify all platform settings.",
              ].map((privilege, index) => (
                <li key={index} className="flex items-center mb-2">
                  <span className="text-green-600 dark:text-green-400 font-bold text-lg mr-2">
                    ✓
                  </span>
                  <span className="text-gray-800 dark:text-gray-300">
                    {privilege}
                  </span>
                </li>
              ))}
            </ul>

            <div className="w-full flex flex-col gap-3 mt-4">
              <Label>
                Confirm if you want to change your
                <span className="font-ubuntu font-semibold"> ROLE</span> to 
                <span className="font-bold text-green-700"> ADMIN</span>.
              </Label>

              <Button
                color="success"
                variant="bordered"
                onClick={() => navigate("/edit-profile")}
                className="hover:bg-green-600/10 transition-colors duration-300"
              >
                Confirm Role Change
              </Button>

              <Button
                color="danger"
                variant="bordered"
                onClick={() => setIsOpen(!isOpen)}
                className="hover:bg-red-600/10 transition-colors duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MakeAdminModal;
