import React from 'react';
import { CgChevronRight } from 'react-icons/cg';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';

const AuthBtnWithProvider = ({ Icon, label, provider,isSignin }) => {
    const navigate = useNavigate();
    const {currentUser,handleRegisterWithGoogle} = useAuth()

    const handleClick = async () => {
        if (isSignin) {
            const authProvider = provider === 'GoogleAuthProvider' ? new GoogleAuthProvider() : new GithubAuthProvider();
    
            try {
                await signInWithPopup(auth, authProvider);
    
                toast.success(`Signed in with ${provider}`);
                navigate('/');
            } catch (error) {
                toast.error(`Error signing in with ${provider}: ${error.message}`);
            }
        }else{
            handleRegisterWithGoogle(navigate)
        }
    };

    return (
        <div onClick={handleClick} className='w-full px-4 py-3 sm:w-96 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 duration-150 active:scale-95 hover:shadow-md hover:text-white'>
            <Icon /> {label} <CgChevronRight />
        </div>
    );
};

export default AuthBtnWithProvider;
