import React, { useEffect } from 'react';
import { AuthBtnWithProvider, MainLoading } from '../components';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { toast } from 'react-toastify';
import userUser from '../hooks/userUser';

const Authentication = () => {
    const navigate = useNavigate();
    const { data, isLoading, refetch } = userUser();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
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
            {/* header */}
            <div className="flex items-center justify-between">
                header
            </div>
            {/* main */}
            <div className="w-full flex flex-1 flex-col items-center justify-center gap-6">
                <h1 className='text-2xl lg:text-4xl text-blue-700'>Welcome to Express Resume</h1>
                <p className='text-base text-gray-700'>Express way to create resume</p>
                <h2 className='text-xl lg:text-2xl text-gray-600'>Authentication</h2>
                <div className="w-full lg:w-96 rounded-md p-2 flex flex-col items-center justify-center gap-6">
                    <AuthBtnWithProvider Icon={BsGoogle} label={"Sign in With Google"} provider={'GoogleAuthProvider'} />
                    <AuthBtnWithProvider Icon={BsGithub} label={"Sign in With Github"} provider={'GithubAuthProvider'} />
                </div>
                {/* test */}
                <button onClick={() => toast.success("Izi pIZI")}>Click me</button>
                {/* test */}
            </div>
            {/* footer */}
            <div className="flex items-center justify-between w-full border-t border-gray-500">
                footer
            </div>
        </div>
    );
};

export default Authentication;
