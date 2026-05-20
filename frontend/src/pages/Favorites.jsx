import { useEffect, useState } from "react"

import { Link } from "react-router-dom"

import {
  getFavorites,
  removeFavorite
} from "../services/favoriteService"


function Favorites() {

  const [favorites, setFavorites] = useState([])

  const [loading, setLoading] = useState(true)

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

    setLoading(false)

  }


  const handleRemove = async (movieId) => {

    try {

      await removeFavorite(movieId)

      setFavorites(

        favorites.filter(
          (movie) => movie.id !== movieId
        )

      )

    } catch (error) {

      console.log(error)

    }

  }


  return (

    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}

      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800">

        <div className="flex justify-between items-center px-8 py-5">

          <Link
            to="/"
            className="text-3xl font-bold text-red-600"
          >
            🎬 CineMind AI
          </Link>

          <Link
            to="/"
            className="bg-zinc-800 px-5 py-2 rounded-lg hover:bg-zinc-700 transition"
          >
            Home
          </Link>

        </div>

      </div>

      {/* PAGE CONTENT */}

      <div className="p-10">

        <h1 className="text-5xl font-bold text-red-600 mb-10">

          ❤️ My Favorites

        </h1>

        {/* LOADING */}

        {loading && (

          <div className="text-2xl animate-pulse">

            Loading favorites...

          </div>

        )}

        {/* EMPTY STATE */}

        {!loading && favorites.length === 0 && (

          <div className="flex flex-col items-center justify-center mt-24">

            <h2 className="text-4xl font-bold text-zinc-400 mb-4">

              No Favorite Movies Yet

            </h2>

            <p className="text-zinc-500 text-lg mb-8">

              Start adding movies you love ❤️

            </p>

            <Link
              to="/"
              className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold transition"
            >
              Explore Movies
            </Link>

          </div>

        )}

        {/* FAVORITES GRID */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {favorites.map((movie) => (

            <div
              key={movie.id}
              className="bg-zinc-900 rounded-2xl overflow-hidden hover:scale-105 transition duration-300 shadow-lg"
            >

              <img
                src={movie.poster_path}
                alt={movie.movie_title}
                className="w-full h-[350px] object-cover"
              />

              <div className="p-4">

                <h2 className="text-xl font-bold mb-4 line-clamp-2">

                  {movie.movie_title}

                </h2>

                <button
                  onClick={() =>
                    handleRemove(movie.id)
                  }
                  className="w-full bg-red-600 hover:bg-red-700 p-3 rounded-lg font-bold transition"
                >

                  ❌ Remove Favorite

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}

export default Favorites