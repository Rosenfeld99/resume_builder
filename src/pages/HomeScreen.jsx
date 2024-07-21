import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HomeScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.5, transformOrigin: 'top right' },
    visible: { opacity: 1, scale: 1, transformOrigin: 'top right' },
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <header className='px-5 py-2 flex items-center gap-4 justify-between sticky top-0 bg-white'>
        {/* logo */}
        <div className="text-2xl font-bold">LOGO</div>
        {/* input */}
        <div className="w-full flex-1">
          <input className='w-full p-3 border-gray-300 border rounded-md' type="text" placeholder='Search ...' />
        </div>
        {/* account */}
        <div onClick={() => setIsOpen(!isOpen)} className="w-12 aspect-square rounded-md overflow-hidden cursor-pointer">
          <img className='object-cover' src="https://lh3.googleusercontent.com/a/ACg8ocLMbw8R1rEjr1a5NhSNT6zbdMX9uRCs57EDK8mplAOCl4U=s96-c" alt="Profile" />
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            transition={{ duration: 0.3 }}
            className="absolute top-14 right-5 bg-white border border-gray-300 shadow-lg rounded-md p-4"
            style={{ transformOrigin: 'top right' }}
          >
            <div className=" flex flex-col gap-5 items-center ">
              <div className=' flex flex-col gap-2 items-center' >
                <img className="w-20 aspect-square rounded-md overflow-hidden cursor-pointer" src="https://lh3.googleusercontent.com/a/ACg8ocLMbw8R1rEjr1a5NhSNT6zbdMX9uRCs57EDK8mplAOCl4U=s96-c" alt="Profile" />
                <p>Dropdown Content</p>
              </div>
              <div className=' flex flex-col gap-2 items-center'  >
                <p>Dropdown Content</p>
                <p>Dropdown Content</p>
              </div>
              <div className=' border-t w-full flex flex-col gap-2 items-center'  >
                <p>Signout</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeScreen;
