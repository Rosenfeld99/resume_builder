import React, { useEffect, useState } from 'react';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { toast } from 'react-toastify';
import AuthBtnWithProvider from '../components/AuthBtnWithProvider';
import MainLoading from '../components/MainLoading';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/userUser';

const Authentication = () => {
    const navigate = useNavigate();
    const { isLoading } = useAuth();
    const [isSignin, setIsSignin] = useState(true)
    const {currentUser} = useUser()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (currentUser) {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    if (isLoading) {
        return <MainLoading />;
    }

    return (
        <div className='flex flex-col gap-6 p-4 flex-1 h-screen'>
            <div className="flex items-center justify-between">
                <img loading='lazy' src="/logo_resume_builders.png" className=' w-20' alt="logo resume builder" />
            </div>
            <div className="w-full flex flex-1 flex-col items-center justify-center gap-6">
                <h1 className='text-2xl lg:text-4xl text-blue-700'>Welcome to Express Resume</h1>
                <p className='text-base text-gray-700'>Express way to create resume</p>
                <h2 className='text-xl lg:text-2xl text-gray-600'>Authentication</h2>
                <div className="w-full lg:w-96 rounded-md p-2 flex flex-col items-center justify-center gap-6">
                    <AuthBtnWithProvider Icon={BsGoogle} setIsSignin={setIsSignin} label={isSignin?"Sign in With Google" : "Signup With Google"} provider={'GoogleAuthProvider'} isSignin={isSignin}/>
                    <AuthBtnWithProvider Icon={BsGithub} setIsSignin={setIsSignin} label={isSignin?"Sign in With Github" : "Signup With Github"} provider={'GithubAuthProvider'} isSignin={isSignin}/>
                </div>
                <div className=" capitalize">
                    {isSignin ?
                        <span>Don't Have An account ? <span onClick={() => setIsSignin(!isSignin)} className='text-blue-700 underline'>register</span></span>
                        :
                        <span>
                            have Have An account ? <span onClick={() => setIsSignin(!isSignin)} className='text-blue-700 underline'>Login</span>
                        </span>
                    }
                </div>
            </div>
            <div className="flex items-center justify-between w-full border-t border-gray-500">
                footer
            </div>
        </div>
    );
};

export default Authentication;
