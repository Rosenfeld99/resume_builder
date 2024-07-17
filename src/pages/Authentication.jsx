import React, { useEffect } from 'react'
import { AuthBtnWithProvider } from '../components'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { toast } from 'react-toastify'
import userUser from '../hooks/userUser'
import { useNavigate } from 'react-router-dom'

const Authentication = () => {
    const { data, isLoading, refetch } = userUser()

    const navigation = useNavigate()


    useEffect(() => {
        if (!isLoading && data) {
            console.log(data);
            navigation("/", { replace: true })
        }
    }, [isLoading, data])

    return (
        <div className=' flex flex-col gap-6 p-4 flex-1 h-screen'>
            {/* header */}
            <div className=" flex items-center justify-between">
                header
            </div>
            {/* main */}
            <div className=" w-full flex flex-1 flex-col items-center justify-center gap-6">
                <h1 className=' text-2xl lg:text-4xl text-blue-700'>welocome to express resume</h1>
                <p className='text-base text-gray-700'>express way to create resume</p>
                <h2 className='text-xl lg:text-2xl text-gray-600'>Authentication</h2>
                <div className=" w-full lg:w-96 rounded-md p-2 flex flex-col items-center justify-center gap-6">
                    <AuthBtnWithProvider Icon={BsGoogle} lable={"Signin With Google"} provider={'GoogleAuthProvider'} />
                    <AuthBtnWithProvider Icon={BsGithub} lable={"Signin With Github"} provider={'GithubAuthProvider'} />
                </div>
                {/* test */}
                <button onClick={() => toast.success("Izi pIZI")}>click me</button>
                {/* test */}
            </div>
            {/* footer */}
            <div className=" flex items-center justify-between w-full border-t border-gray-500">
                footer
            </div>

        </div>
    )
}

export default Authentication