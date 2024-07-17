import React from 'react'
import { CgChevronRight } from 'react-icons/cg'
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth } from '../config/firebase.config';

const AuthBtnWithProvider = ({ Icon, lable, provider }) => {

    const googleAuthProvider = new GoogleAuthProvider();
    const githubAuthProvider = new GithubAuthProvider();

    const handleClick = async () => {
        switch (provider) {
            case "GoogleAuthProvider":
                await signInWithPopup(auth, googleAuthProvider).then((res) => {

                    console.log("GoogleAuthProvider :", res);
                }).catch(err => {

                    console.log(`Error : ${err.Message}`);
                })
                break;
            case "GithubAuthProvider":
                await signInWithRedirect(auth, githubAuthProvider).then((res) => {

                    console.log("GithubAuthProvider :", res);
                }).catch(err => {

                    console.log(`Error : ${err.Message}`);
                })
                break;
            default:
                await signInWithPopup(auth, googleAuthProvider).then((res) => {

                    console.log("GoogleAuthProvider :", res);
                }).catch(err => {

                    console.log(`Error : ${err.Message}`);
                })
                break;
        }
    }

    return (
        <div onClick={handleClick} className=' w-full px-4 py-3 sm:w-96 rounded-md border-2 border-blue-700 flex items-center justify-between cursor-pointer group hover:bg-blue-700 duration-150 active:scale-95 hover:shadow-md hover:text-white'>
            <Icon /> {lable} <CgChevronRight /></div>
    )
}

export default AuthBtnWithProvider