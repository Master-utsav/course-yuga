import React, { useState } from 'react';
import { z, ZodType } from 'zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { motion } from 'framer-motion';

interface User_Mail {
  email: string;
  message: string;
}

const schema: ZodType<User_Mail> = z.object({
  email: z
    .string()
    .min(1, 'required')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'invalid email format'
    ),
  message: z.string().min(1, 'required').max(3500, 'message is too long'),
});

const ContactUs: React.FC = () => {
  const [assistState, setAssistState] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User_Mail>({
    mode: 'all',
    resolver: zodResolver(schema),
  });

  const submit: SubmitHandler<User_Mail> = (data) => {
    console.log('Submitted:', { email: data.email, message: data.message });
  };

  return (
    <div className="min-h-screen h-auto bg-gray-100 dark:bg-gray-900 md:py-12 md:pt-24 relative overflow-x-hidden py-4 pt-20">
    <BackgroundBeams className="absolute top-0 left-0 w-full h-full" />

    <div className="max-w-2xl mx-auto p-4 relative space-y-4">
      {/* Animated Heading */}
      <motion.h1
        className="text-3xl md:text-7xl text-center font-sans font-bold mb-8 text-neutral-800 dark:text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Contact Us
      </motion.h1>

      <motion.p
        className="text-neutral-700 dark:text-neutral-400 max-w-lg mx-auto my-2 text-sm text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {"We're here to help with any questions about our courses, programs, or events. Whether you're looking to enhance your skills or need more information about our offerings, we're just a message away."}
      </motion.p>

      {/* Assistance Section */}
      <div className="flex flex-col items-start justify-start w-fit h-auto">
        <p
          className="text-blue-600 dark:text-blue-400 hover:underline md:text-lg text-base cursor-pointer"
          onClick={() => setAssistState(!assistState)}
        >
          How Can We Assist You?
        </p>

        {assistState && (
          <motion.ul
            className="flex flex-col gap-2 mt-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {[
              { title: 'Course Inquiries:', text: 'Need help with our YouTube courses?' },
              { title: 'Program Information:', text: "Learn more about our skill-enhancing programs." },
              { title: 'Event Details:', text: "Stay updated on upcoming events and how to join." },
              { title: 'Technical Support:', text: "Facing issues accessing content? We’re here to help." },
              { title: 'General Questions:', text: "Anything else? Let us know!" },
            ].map((item, index) => (
              <motion.li key={index} className="flex w-full">
                <span className="font-semibold text-neutral-800 dark:text-white w-1/3">
                  {item.title}
                </span>
                <p className="text-neutral-700 dark:text-neutral-300 w-2/3">
                  {item.text}
                </p>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      <p className="bg-clip-text text-transparent bg-gradient-to-b from-teal-500 to-teal-200 md:text-lg text-base text-start">
        Feel free to share your thoughts and suggestions!
      </p>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit(submit)}
        className="space-y-4 mt-4 relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <label className="relative">
          <input
            type="email"
            {...register('email')}
            placeholder="Your email address"
            className="w-full p-4 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-teal-500 bg-neutral-100 dark:bg-neutral-800 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm absolute -bottom-6 right-1">
              {errors.email.message}
            </p>
          )}
        </label>

        <textarea
          {...register('message')}
          placeholder="Your message"
          rows={5}
          className="w-full p-4 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-teal-500 bg-neutral-100 dark:bg-neutral-800 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
        />
        {errors.message && (
          <p className="text-red-500 text-sm absolute -bottom-6 right-1">
            {errors.message.message}
          </p>
        )}

        <button
          type="submit"
          className="w-full px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Send Message
        </button>
      </motion.form>
    </div>
  </div>
  );
};

export default ContactUs;
