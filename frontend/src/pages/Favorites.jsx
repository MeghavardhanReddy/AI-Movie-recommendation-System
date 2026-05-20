import { useEffect, useState } from "react"

import { getFavorites } from "../services/favoriteService"


function Favorites() {

  const [favorites, setFavorites] = useState([])

  useEffect(() => {

    fetchFavorites()

  }, [])


  const fetchFavorites = async () => {

    try {

      const data = await getFavorites()

      setFavorites(data)

    } catch (error) {

      console.log(error)

    }

  }


  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold text-red-600 mb-10">

        ❤️ My Favorites

      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {favorites.map((movie) => (

          <div
            key={movie.id}
            className="bg-zinc-900 rounded-2xl overflow-hidden"
          >

            <img
              src={movie.poster_path}
              alt={movie.movie_title}
              className="w-full h-[350px] object-cover"
            />

            <div className="p-4">

              <h2 className="text-xl font-bold">
                {movie.movie_title}
              </h2>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}

export default Favorites