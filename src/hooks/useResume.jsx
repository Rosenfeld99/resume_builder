import React, { useContext } from 'react'
import { ResumeContext } from '../context/ResumeContext'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../config/firebase.config'

const useResume = () => {
    const { resume, setResume, isLoading, setIsLoading, isError, setIsError, } = useContext(ResumeContext)

    const getSaveResumes = async (userId) => {
        try {
            setIsLoading(true)
            const resumesQuery = query(
                collection(db, "users", userId, "resumes"),
                orderBy("timeStamp", "asc")
            )
            const unsubscribe = onSnapshot(resumesQuery, (querySnap) => {
                const data = querySnap.docs.map((doc) => doc.data())
                return setResume(data || [])
            })
        } catch (error) {
            setIsError(true)
            console.log(`Error : ${error?.message}`);
        } finally {
            setIsLoading(false)
        }




    }

    return { resume, setResume, isLoading, setIsLoading, isError, setIsError, getSaveResumes }
}

export default useResume