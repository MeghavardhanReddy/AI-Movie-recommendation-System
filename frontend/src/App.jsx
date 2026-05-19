import { useState } from 'react'
import axios from 'axios'

function App() {

  const [movie, setMovie] = useState("")
  const [moviesData, setMoviesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchedMovie, setSearchedMovie] = useState("")
  const [mainMovieData, setMainMovieData] = useState(null)

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

  const getRecommendations = async () => {

    if (!movie) return

    setLoading(true)

    try {

      setSearchedMovie(movie)

      // Fetch searched movie details
      const mainMovieResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: TMDB_API_KEY,
            query: movie
          }
        }
      )

      if (mainMovieResponse.data.results.length > 0) {
        setMainMovieData(mainMovieResponse.data.results[0])
      }

      // Get recommendations from Django backend
      const response = await axios.get(
        `http://127.0.0.1:8000/api/recommend/?movie=${movie}`
      )

      const recommendedMovies = response.data.recommendations

      let movieResults = []

      // Fetch TMDB data for recommendations
      for (const movieName of recommendedMovies) {

        const tmdbResponse = await axios.get(
          `https://api.themoviedb.org/3/search/movie`,
          {
            params: {
              api_key: TMDB_API_KEY,
              query: movieName
            }
          }
        )

        if (tmdbResponse.data.results.length > 0) {
          movieResults.push(tmdbResponse.data.results[0])
        }
      }

      setMoviesData(movieResults)

    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  return (

    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <div className="px-8 pt-8">

        <h1 className="text-5xl font-bold text-red-600 mb-10">
          🎬 CineMind AI
        </h1>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">

          <input
            type="text"
            placeholder="Search movie..."
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            className="p-4 w-full sm:w-[400px] rounded-lg bg-white text-black text-lg outline-none"
          />

          <button
            onClick={getRecommendations}
            className="bg-red-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-red-700 transition duration-300"
          >
            Recommend
          </button>

        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="px-8">
          <h2 className="text-2xl text-zinc-300 animate-pulse">
            Loading recommendations...
          </h2>
        </div>
      )}

      {/* Featured Hero Banner */}
      {mainMovieData && !loading && (

        <div className="relative w-full h-[550px] mb-14 overflow-hidden">

          {/* Background */}
          <img
            src={`https://image.tmdb.org/t/p/original${mainMovieData.backdrop_path}`}
            alt={mainMovieData.title}
            className="w-full h-full object-cover opacity-40"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent flex items-end">

            <div className="p-10 max-w-3xl">

              <h1 className="text-6xl font-bold mb-4">
                {mainMovieData.title}
              </h1>

              <p className="text-zinc-300 text-lg mb-4 line-clamp-4">
                {mainMovieData.overview}
              </p>

              <div className="flex gap-6 text-lg">

                <p className="text-yellow-400">
                  ⭐ {mainMovieData.vote_average}
                </p>

                <p className="text-zinc-300">
                  📅 {mainMovieData.release_date}
                </p>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* Recommendations Section */}
      {searchedMovie && !loading && (

        <div className="px-8 pb-10">

          <h2 className="text-4xl font-bold mb-10">
            Recommendations for:
            <span className="text-red-500">
              {" "} {searchedMovie}
            </span>
          </h2>

          {/* Movie Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {moviesData.map((movie, index) => (

              <div
                key={index}
                className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-red-500/20 transition duration-300"
              >

                {/* Poster */}
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[350px] object-cover"
                />

                {/* Details */}
                <div className="p-4">

                  <h2 className="text-xl font-bold mb-2 line-clamp-1">
                    {movie.title}
                  </h2>

                  <p className="text-yellow-400 mb-2">
                    ⭐ {movie.vote_average}
                  </p>

                  <p className="text-zinc-400 text-sm mb-2">
                    📅 {movie.release_date}
                  </p>

                  <p className="text-sm text-zinc-300 line-clamp-4">
                    {movie.overview}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      )}

    </div>
  )
}

export default App