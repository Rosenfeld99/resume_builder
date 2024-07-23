import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {MainLoading} from './';
import useAuth from '../hooks/useAuth';

const Header = () => {
  const { isLoading, currentUser } = useAuth()
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { handleSignOut } = useAuth()
  const navigateion = useNavigate()
//   console.log(currentUser);
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.8, transformOrigin: 'top right' },
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

  if (isLoading) {
    return <MainLoading />;
  }

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
        <div onClick={() => setIsOpen(!isOpen)} >
          {currentUser?.photoURL ?
            <img className="w-12 bg-gray-300 aspect-square rounded-md overflow-hidden cursor-pointer object-cover" src={currentUser?.photoURL} alt="Profile" />
            :
            <div className="w-12 bg-gray-300 h-12 flex items-center justify-center text-xl rounded-md overflow-hidden cursor-pointer">{currentUser?.displayName?.substring(0, 1)}</div>
          }
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
            className="absolute top-14 right-5 bg-white border border-gray-300 shadow-lg rounded-md"
            style={{ transformOrigin: 'top right' }}
          >
            <div className=" flex flex-col gap-5 items-center ">
              <div className=' flex flex-col gap-2 items-center px-7 py-5 border-b' >
                {currentUser?.photoURL ?
                  <img className="w-20 aspect-square rounded-full overflow-hidden cursor-pointer bg-gray-300 " src={currentUser?.photoURL} alt="Profile" />
                  : <div className="w-20 h-20 flex items-center justify-center text-3xl rounded-full overflow-hidden cursor-pointer bg-gray-300 ">{currentUser?.displayName?.substring(0, 1)}</div>}
                <p className=' text-sm font-semibold'>{currentUser?.displayName}</p>
              </div>
              <div className=' flex flex-col gap-4 capitalize items-start w-full px-7 text-gray-400'  >
                <p className='hover:text-black hover:underline '>My Account</p>
                <p className='hover:text-black hover:underline '>Add new template</p>
                <p className='hover:text-black hover:underline '>Switch Theme</p>
              </div>
              <button onClick={() => handleSignOut(navigateion)} className=' py-3 border-t w-full text-gray-400 hover:text-black flex flex-col gap-2 items-center'  >
                <p>Signout</p>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
