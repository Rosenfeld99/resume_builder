import React, { useState } from 'react'
import Header from '../components/Header'
import useUser from '../hooks/userUser'

const Profile = () => {
  const {currentUser} = useUser()
  const [selectOptions,setSelectOption] = useState('collections')
  return (
    <div>
      <Header />
      <div className=" flex w-full min-h-44 h-72 items-center justify-center relative z-20 flex-col overflow-hidden">
        <div className="bg-[#0000003c] absolute top-0  right-0 w-full h-full z-20"/>
        <img loading='lazy w-full' className=' object-cover' src="https://images.pexels.com/photos/574073/pexels-photo-574073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="" />
      </div>
      <div className="">
        <div className=' flex flex-col gap-2 items-center relative px-7 py-5 -mt-16 z-40' >
          {currentUser?.photoURL ?
            <img className="w-20 aspect-square rounded-full overflow-hidden cursor-pointer bg-gray-300 ring border-2 ring-blue-500" src={currentUser?.photoURL} alt="Profile" />
            : <div className="w-20 h-20 flex items-center justify-center text-3xl rounded-full overflow-hidden cursor-pointer bg-gray-300 ">{currentUser?.displayName?.substring(0, 1)}</div>}
          <p className=' text-sm font-semibold'>{currentUser?.displayName}</p>
        </div>
      </div>
      {/* btns controllers */}
      <div className=" flex items-center justify-center gap-10 lg:gap-20 py-7">

            <button type='button' onClick={()=> setSelectOption("collections")} className={` bg-gray-200 px-3 py-1 active:scale-110 duration-150 rounded-2xl text-gray-700 ${selectOptions == "collections" && " bg-white shadow-md text-blue-500"}`}>
              Collections
            </button>
            <button type='button' onClick={()=> setSelectOption("myresumes")} className={` bg-gray-200 px-3 py-1 active:scale-110 duration-150 rounded-2xl text-gray-700 ${selectOptions == "myresumes" && " bg-white shadow-md text-blue-500"}`}>
              My resumes
            </button>

      </div>
    </div>
  )
}

export default Profile