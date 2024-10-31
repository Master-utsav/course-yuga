import React from "react";
import { Card, Button, Input, Textarea, Spacer, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/authContext";
import WarningIcon from "@/Icons/WarningIcon";

const Community: React.FC = () => {
  const {userData} = useAuthContext();
  const {isOpen , onClose, onOpen} = useDisclosure();
  // const displayText = "Welcome to the Course-Yuga Community!".split('');
  return (
    <div className="min-h-screen   bg-white dark:bg-black text-neutral-300 flex flex-col items-center px-6 py-12 lg:pt-56 pt-60 md:pt-56 relative overflow-x-hidden ">
      {/* Header Section */}
      <div className="max-w-7xl w-full text-center">
      <motion.h1
          className="text-3xl md:text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600  font-extrabold font-ubuntu mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Welcome to the Course-Yuga Community!
        </motion.h1>
        {/* <h1 className="text-center flex justify-center overflow-hidden">
            {displayText.map((char, index) => (
            <motion.span
            key={index}
            initial={{ y: char === ' ' ? 0 : -100 }} // Start below the container
            animate={{ y: 0 }} // Animate to its final position
            transition={{
                duration: 0.5,
                delay: index * 0.02, // Stagger effect
                ease : "easeOut",
                type: 'spring', // Adds a slight bounce for a better effect
                stiffness: 80,
                damping: 20,
            }}
            style={{
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal', // Maintain spacing
            }}
            className={" text-6xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600  font-extrabold font-ubuntu mb-6"}
            >
            {char === ' ' ? '\u00A0' : char}
            </motion.span>
        ))}
        </h1> */}
        <motion.i 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.7, 0, 0.84, 0] , delay: 0.5 }}
        className="text-neutral-500 dark:text-neutral-400 sm:text-lg text-base font-libre overflow-hidden">
          Connect with learners worldwide, share your thoughts, ask questions, and grow together!
        </motion.i>
      </div>

      <Spacer y={2} />

      {/* Create Post Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 1, ease: [0.7, 0, 0.84, 0] }}
        className="max-w-3xl w-full px-6 py-8 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
        <div className="flex items-center gap-4 mb-4">
          <Avatar >
              <AvatarImage src={userData.profileImageUrl} />
              <AvatarFallback className="font-bold text-xl dark:text-black dark:bg-white text-white bg-black">
                {userData.avatarFallbackText}
              </AvatarFallback>
            </Avatar>
          <Input
            placeholder="Share your thoughts with the community..."
            fullWidth
            variant="bordered"
            className=" text-white placeholder:text-neutral-500"
          />
        </div>
        <Textarea
          placeholder="Write something amazing..."
          minRows={3}
          variant="bordered"
          className=" text-white placeholder:text-neutral-500 mb-4"
        />
        <div className="flex justify-between">
          
          <>
            <Button color="primary" variant="solid" onPress={onOpen}>
              Post
            </Button>

            <Modal backdrop={"opaque"} isOpen={isOpen} onClose={onClose}>
              <ModalContent className="sm:max-w-[480px] p-6 shadow-lg rounded-lg dark:bg-gray-800 bg-white">
                <ModalHeader className="flex flex-col gap-1">
                  <div className="w-full space-x-2 flex justify-start items-center">
                    <WarningIcon fillColor="red" />
                    <span className="font-ubuntu text-2xl font-bold text-red-700 dark:text-red-400">
                      Maintenance Alert
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-base mt-2">
                    We're currently performing maintenance on the community page. Please check back later.
                  </p>
                </ModalHeader>
                <ModalBody>
                  <div className="gap-4 pb-4 flex flex-col justify-start items-center">
                    {/* Maintenance List */}
                    <ul className="w-full bg-gray-50 dark:bg-gray-900 text-sm p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      {[
                        "This feature is temporarily unavailable.",
                        "You will not be able to post or interact.",
                        "Thank you for your patience.",
                      ].map((message, index) => (
                        <li key={index} className="flex items-center mb-2">
                          <span className="text-red-600 dark:text-red-400 font-bold text-lg mr-2">
                            !
                          </span>
                          <span className="text-gray-800 dark:text-gray-300">
                            {message}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ModalBody>
                <ModalFooter className="flex justify-between mt-4">
                  <Button color="default" onPress={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
          <Button color="secondary" variant="flat">
            Cancel
          </Button>
        </div>
      </motion.div>

      <Spacer y={4} />

      <Divider className="max-w-5xl w-full my-8" />

      {/* Posts Section */}
      <div className="max-w-5xl w-full space-y-6">
        {/* Sample Post */}
        <Card className="bg-neutral-50 dark:bg-neutral-900">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={"https://i.pravatar.cc/150?u=a042581f4e29026307d"} />
                  <AvatarFallback className="font-bold text-xl dark:text-black dark:bg-white text-white bg-black">
                    {userData.avatarFallbackText}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-ubuntu font-semibold text-neutral-800 dark:text-white">
                    Jane Doe
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Posted 2 hours ago
                  </p>
                </div>
              </div>
              <Button color="primary"  >
                Follow
              </Button>
            </div>

            <p className="text-neutral-800 dark:text-neutral-300 font-ubuntu">
              Hey everyone! Just finished the latest Course-Yuga module. It’s been a fantastic
              learning experience. What course are you currently working on?
            </p>

            <div className="flex gap-4 mt-4">
              <Button variant="ghost" color="primary" >
                👍 Like
              </Button>
              <Button variant="ghost" color="secondary" className="text-black dark:text-white" >
                💬 Comment
              </Button>
            </div>
          </div>
        </Card>

        {/* Another Sample Post */}
        <Card  className="bg-neutral-50 dark:bg-neutral-900">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={"https://i.pravatar.cc/150?u=a042581f4e29026609d"} />
                  <AvatarFallback className="font-bold text-xl dark:text-black dark:bg-white text-white bg-black">
                    {userData.avatarFallbackText}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-ubuntu font-semibold text-neutral-800 dark:text-white">
                    John Smith
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Posted 1 day ago
                  </p>
                </div>
              </div>
              <Button color="primary"  >
                Follow
              </Button>
            </div>

            <p className="text-neutral-800 dark:text-neutral-300 font-ubuntu">
              I found an amazing free course on YouTube through Course-Yuga! Loving the curated
              content here.
            </p>

            <div className="flex gap-4 mt-4">
              <Button variant="ghost" color="primary" >
                👍 Like
              </Button>
              <Button variant="ghost" color="secondary" className="text-black dark:text-white" >
                💬 Comment
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Spacer y={4} />
    </div>
  );
};

export default Community;
