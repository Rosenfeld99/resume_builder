import React, { useState } from 'react'
import Header from '../components/Header'
import useUser from '../hooks/userUser'
import { AnimatePresence } from 'framer-motion'
import { TemplateDesignPin } from '../components'
import useTemplate from '../hooks/useTemplate'
import useResume from '../hooks/useResume'
import { PuffLoader } from 'react-spinners'

const Profile = () => {
  const { currentUser } = useUser()
  const { templates, isLoadingTemplates, isError } = useTemplate()
  const { getSaveResumes, resume, isLoading } = useResume()
  const [selectOptions, setSelectOption] = useState('collections')

  console.log(isLoading);


  return (
    <div>
      <Header />
      <div className=" flex w-full h-56 sm:h-72 items-center justify-center relative z-20 flex-col overflow-hidden">
        <div className="bg-[#0000003c] absolute top-0  right-0 w-full h-full z-20" />
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

        <button type='button' onClick={() => setSelectOption("collections")} className={` bg-gray-200 px-3 py-1 active:scale-110 duration-150 rounded-2xl ${selectOptions == "collections" ? " bg-white shadow-md text-blue-500" : " text-gray-600"}`}>
          Collections
        </button>
        <button type='button' onClick={() => { setSelectOption("myresumes"), console.log(getSaveResumes(currentUser?.id)) }} className={` bg-gray-200 px-3 py-1 active:scale-110 duration-150 rounded-2xl ${selectOptions == "myresumes" ? " bg-white shadow-md text-blue-500" : " text-gray-600"}`}>
          My resumes
        </button>
      </div>

      {/* render collections items grid */}
      {selectOptions == "collections" && <React.Fragment >
        {true ? <React.Fragment>
          {templates?.filter((item) => currentUser?.collections?.includes(item?.id))?.length > 0 ?
            <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
              <AnimatePresence>
                {templates?.filter((item) => currentUser?.collections?.includes(item?.id))?.map((item, index) => (
                  <TemplateDesignPin item={item} index={index} key={item?.id} />
                ))}
              </AnimatePresence>
            </div>
            : <React.Fragment>No data...</React.Fragment>}
        </React.Fragment> :
          <div className=' flex items-center justify-center h-full w-full'>
            <PuffLoader color='#48a9f8' size={80} />
          </div>}
      </React.Fragment>}

      {/* render my resumes items grid */}
      {selectOptions == "myresumes" && <React.Fragment >
        {!isLoading ? <React.Fragment>
          {resume?.length > 0 ?
            <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
              <AnimatePresence>
                {resume?.map((item, index) => (
                  <TemplateDesignPin item={item} index={index} key={item?.id} />
                ))}
              </AnimatePresence>
            </div>
            : <React.Fragment>No data...</React.Fragment>}
        </React.Fragment> :
          <div className=' flex items-center justify-center h-full w-full'>
            <PuffLoader color='#48a9f8' size={80} />
          </div>}

      </React.Fragment>}

    </div>
  )
}

export default Profile