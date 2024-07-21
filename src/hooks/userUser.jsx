import React from 'react'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
import { getUserDetail } from '../api'

const userUser = () => {
    const { data, isError, isLoading, refetch } = useQuery(
        "user",
        async () => {
            try {
                const userDetail = await getUserDetail()
                return userDetail
            } catch (error) {
                if (!error.message.includes("not authenticated")) {
                    toast.error("Shomthing went worng")
                }
            }
        }, { refetchOnWindowFocus: false }
    )
    return { data, isError, isLoading, refetch }
}

export default userUser