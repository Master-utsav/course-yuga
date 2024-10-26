import React from 'react';
import { motion } from 'framer-motion';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z, ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Accordion, AccordionItem } from '@nextui-org/react';
import {faqData} from "@/constants/index"

interface SupportForm {
  email: string;
  message: string;
}

const schema: ZodType<SupportForm> = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    ),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(3500, 'Message is too long'),
});

const HelpSection: React.FC = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupportForm>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<SupportForm> = (data) => {
    console.log('Submitted:', data);
  };
  
  const displayText = "Help & Support".split('');

  

  return (
    <div className="min-h-screen h-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300 lg:py-12 lg:pt-24 relative overflow-x-hidden px-2 py-4 pt-40 md:pt-56">
      <div className="max-w-3xl mx-auto sm:space-y-8 space-y-3">
        <div className="max-w-7xl w-full text-center">
        <h1 className="text-center flex justify-center overflow-hidden">
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
            className={"sm:text-6xl text-3xl text-center font-ubuntu bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-500 font-semibold mb-6"}
            >
            {char === ' ' ? '\u00A0' : char}
            </motion.span>
        ))}
            
        </h1>
        <motion.i 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.7, 0, 0.84, 0] , delay: 0.2 }}
        className="text-neutral-500 dark:text-neutral-400 text-lg font-libre overflow-hidden">
          Find answers to common questions or reach out to us for help.
        </motion.i>
      </div>

        {/* FAQ Section */}
        <div className="sm:space-y-2 space-y-1">
          <h2 className="sm:text-3xl text-2xl font-semibold dark:text-blue-300 text-blue-700 font-ubuntu">Frequently Asked Questions</h2>
          {faqData.map((faq, index) => (
             <Accordion isCompact>
             <AccordionItem key={index} aria-label="Accordion 1" title={faq.question} className='text-base font-ubuntu'>
               {faq.answer}
             </AccordionItem>
           </Accordion>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="mt-12">
          <h2 className="sm:text-2xl text-xl font-semibold text-white">Need Further Assistance?</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <label className="block">
              <input
                type="email"
                {...register('email')}
                placeholder="Your email address"
                className="w-full p-4 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-teal-500 bg-neutral-100 dark:bg-neutral-800 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </label>

            <label className="block">
              <textarea
                {...register('message')}
                placeholder="Your message"
                rows={5}
                className="w-full p-4 rounded-lg border border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-teal-500 bg-neutral-100 dark:bg-neutral-800 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
              ></textarea>
              {errors.message && (
                <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>
              )}
            </label>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpSection;
