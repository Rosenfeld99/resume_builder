import React from 'react'
import { PuffLoader } from 'react-spinners'

const MainLoading = () => {
    return (
        <div className=" flex items-center justify-center h-screen w-full">
            <PuffLoader color='#48a9f8' size={80} />
        </div>
    )
}

export default MainLoading