import axios from "axios"

const API_URL =
    "http://127.0.0.1:8000/api/auth"

export const addWatchHistory = async (
    movieData
) => {

    const token =
        localStorage.getItem("token")

    const response = await axios.post(

        `${API_URL}/history/add/`,

        movieData,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    )

    return response.data

}

export const getWatchHistory = async () => {

    const token =
        localStorage.getItem("token")

    const response = await axios.get(

        `${API_URL}/history/`,

        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

    )

    return response.data

}