import axios from "axios"

const API_URL =
  "http://127.0.0.1:8000/api/auth"

export const addFavorite = async (
  movieData
) => {

  const token =
    localStorage.getItem("token")

  const response = await axios.post(

    `${API_URL}/favorites/add/`,

    movieData,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  )

  return response.data

}

export const getFavorites = async () => {

  const token =
    localStorage.getItem("token")

  const response = await axios.get(

    `${API_URL}/favorites/`,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  )

  return response.data

}
export const removeFavorite = async (
  movieId
) => {

  const token =
    localStorage.getItem("token")

  const response = await axios.delete(

    `${API_URL}/favorites/remove/${movieId}/`,

    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }

  )

  return response.data

}