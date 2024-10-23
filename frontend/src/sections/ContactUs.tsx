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
          className="text-2xl md:text-7xl text-center font-sans font-bold mb-8 text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Contact Us
        </motion.h1>

        <motion.p
          className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {"We're here to help with any questions about our courses, programs, or events. Whether you're looking to enhance your skills or need more information about our offerings, we're just a message away."}
        </motion.p>

        {/* Assistance Section with Animation */}
        <div className="flex flex-col text-start items-center justify-start w-fit h-auto">
          <p
            className="text-blue-200 hover:text-blue-500 md:text-lg text-base cursor-pointer text-start"
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
                {
                  title: 'Course Inquiries:',
                  text: 'Have questions about our courses on YouTube? Need help finding the right one? Let us know!',
                },
                {
                  title: 'Program Information:',
                  text: "Want more details about our skill-enhancing programs? We're happy to provide all the information you need.",
                },
                {
                  title: 'Event Details:',
                  text: "Interested in our upcoming online events? We'll keep you updated on dates, schedules, and how to participate.",
                },
                {
                  title: 'Technical Support:',
                  text: "Facing any issues with accessing our content on YouTube? We're here to troubleshoot and ensure you have a seamless experience.",
                },
                {
                  title: 'General Questions:',
                  text: "Anything else on your mind? Feel free to ask, and we'll do our best to assist.",
                },
              ].map((item, index) => (
                <motion.li key={index} className="text-start mr-2 flex w-[100%]">
                  <span className="text-bold text-white md:text-base text-sm w-[30%]">
                    {item.title}{' '}
                  </span>
                  <p className="text-white/80 md:text-base text-sm w-[70%] text-start">
                    {item.text}
                  </p>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>

        <p className="bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 via-[#75f7bde4] to-neutral-50 md:text-lg text-base text-start">
          Feel free to share your thoughts, requirements, and any suggestions
          you have to improve our site!
        </p>

        {/* Animated Form */}
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
              name="email"
              placeholder="Your email address"
              className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500 w-full p-4 bg-neutral-950 placeholder:text-neutral-700"
            />
            {errors.email && (
              <p className="text-[12px] text-red-600 absolute -bottom-8 right-1">
                {errors.email?.message}
              </p>
            )}
          </label>

          <textarea
            {...register('message')}
            placeholder="Your message"
            className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500 w-full p-4 bg-neutral-950 placeholder:text-neutral-700 relative"
            rows={5}
          />
          {errors.message && (
            <p className="text-[12px] text-red-600 absolute -bottom-6 right-1">
              {errors.message?.message}
            </p>
          )}

          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Send Message
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default ContactUs;
