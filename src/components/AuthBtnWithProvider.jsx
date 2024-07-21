import React from 'react'
import { CgChevronRight } from 'react-icons/cg'
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth } from '../config/firebase.config';
import { useNavigate } from 'react-router-dom'


const AuthBtnWithProvider = ({ Icon, lable, provider }) => {
    const navigation = useNavigate()

    const googleAuthProvider = new GoogleAuthProvider();
    const githubAuthProvider = new GithubAuthProvider();

    const handleClick = async () => {
        try {
            let res;
            switch (provider) {
                case "GoogleAuthProvider":
                    res = await signInWithRedirect(auth, googleAuthProvider);
                    console.log("GoogleAuthProvider :", res);
                    break;
                case "GithubAuthProvider":
                    res = await signInWithRedirect(auth, githubAuthProvider);
                    console.log("GithubAuthProvider :", res);
                    break;
                default:
                    res = await signInWithRedirect(auth, googleAuthProvider);
                    console.log("GoogleAuthProvider :", res);
                    break;
            }
            // If sign-in is successful, navigate to the home page
            navigate("/");
        } catch (err) {
            console.log(`Error : ${err.message}`);
        }
    }

    return (
        <div onClick={handleClick} className=' w-full px-4 py-3 sm:w-96 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 duration-150 active:scale-95 hover:shadow-md hover:text-white'>
            <Icon /> {lable} <CgChevronRight /></div>
    )
}

export default AuthBtnWithProvider