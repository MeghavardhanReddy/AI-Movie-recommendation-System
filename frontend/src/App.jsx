import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {

  const [movie, setMovie] = useState("")
  const [moviesData, setMoviesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchedMovie, setSearchedMovie] = useState("")
  const [mainMovieData, setMainMovieData] = useState(null)

  const [trendingMovies, setTrendingMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])

  const [activeCategory, setActiveCategory] = useState("home")

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY

  // =========================
  // FETCH HOMEPAGE MOVIES
  // =========================

  const fetchHomepageMovies = async () => {

    try {

      const trendingResponse = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/day`,
        {
          params: {
            api_key: TMDB_API_KEY
          }
        }
      )

      const popularResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/popular`,
        {
          params: {
            api_key: TMDB_API_KEY
          }
        }
      )

      const topRatedResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/top_rated`,
        {
          params: {
            api_key: TMDB_API_KEY
          }
        }
      )

      setTrendingMovies(trendingResponse.data.results)
      setPopularMovies(popularResponse.data.results)
      setTopRatedMovies(topRatedResponse.data.results)

    } catch (error) {
      console.log(error)
    }

  }

  // =========================
  // GET AI RECOMMENDATIONS
  // =========================

  const getRecommendations = async () => {

    if (!movie) return

    setLoading(true)

    try {

      setSearchedMovie(movie)

      // Search movie from TMDB
      const mainMovieResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: TMDB_API_KEY,
            query: movie
          }
        }
      )

      // If movie not found
      if (mainMovieResponse.data.results.length === 0) {

        alert("Movie not found")

        setLoading(false)

        return
      }

      // Main movie data
      const selectedMovie =
        mainMovieResponse.data.results[0]

      // Save movie banner data
      setMainMovieData(selectedMovie)

      // Create MovieLens title
      const movieYear =
        selectedMovie.release_date?.split("-")[0]

      const backendMovieTitle =
        `${selectedMovie.title} (${movieYear})`

      // Call Django Hybrid AI Backend
      const response = await axios.get(
        `http://127.0.0.1:8000/api/recommend/?movie=${encodeURIComponent(backendMovieTitle)}&user_id=1`
      )

      const recommendedMovies =
        response.data.recommendations

      let movieResults = []

      // Fetch TMDB movie details
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

          movieResults.push(
            tmdbResponse.data.results[0]
          )

        }

      }

      setMoviesData(movieResults)

    } catch (error) {

      console.log(error)

    }

    setLoading(false)

  }

  // =========================
  // LOAD HOMEPAGE
  // =========================

  useEffect(() => {

    fetchHomepageMovies()

  }, [])

  // =========================
  // MOVIE ROW COMPONENT
  // =========================

  const MovieRow = ({ title, movies }) => (

    <div className="mb-14">

      <h2 className="text-3xl font-bold mb-6 px-8">
        {title}
      </h2>

      <div className="flex gap-5 overflow-x-auto px-8">

        {movies.map((movie) => (

          <div
            key={movie.id}
            className="min-w-[220px] hover:scale-105 transition duration-300"
          >

            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-xl h-[320px] object-cover"
            />

            <h3 className="mt-3 text-lg font-semibold">
              {movie.title}
            </h3>

          </div>

        ))}

      </div>

    </div>

  )

  return (

    <div className="min-h-screen bg-black text-white">

      {/* NAVBAR */}

      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800">

        <div className="flex items-center justify-between px-8 py-5">

          {/* LOGO */}
          <h1 className="text-3xl font-bold text-red-600">
            🎬 CineMind AI
          </h1>

          {/* NAVIGATION */}
          <div className="flex gap-8 text-lg font-medium">

            <button
              onClick={() => {

                setActiveCategory("home")

                setSearchedMovie("")
                setMoviesData([])
                setMainMovieData(null)
                setMovie("")

              }}
              className={`${activeCategory === "home"
                ? "text-red-500"
                : "text-white"} hover:text-red-400 transition`}
            >
              Home
            </button>

            <button
              onClick={() => setActiveCategory("trending")}
              className={`${activeCategory === "trending"
                ? "text-red-500"
                : "text-white"} hover:text-red-400 transition`}
            >
              Trending
            </button>

            <button
              onClick={() => setActiveCategory("popular")}
              className={`${activeCategory === "popular"
                ? "text-red-500"
                : "text-white"} hover:text-red-400 transition`}
            >
              Popular
            </button>

            <button
              onClick={() => setActiveCategory("toprated")}
              className={`${activeCategory === "toprated"
                ? "text-red-500"
                : "text-white"} hover:text-red-400 transition`}
            >
              Top Rated
            </button>

          </div>

          {/* PROFILE */}
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">
            M
          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="px-8 pt-8">

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

      {/* LOADING */}

      {loading && (

        <div className="px-8">

          <h2 className="text-2xl text-zinc-300 animate-pulse">
            Loading recommendations...
          </h2>

        </div>

      )}

      {/* HERO BANNER */}

      {mainMovieData && !loading && (

        <div className="relative w-full h-[550px] mb-14 overflow-hidden">

          <img
            src={`https://image.tmdb.org/t/p/original${mainMovieData.backdrop_path}`}
            alt={mainMovieData.title}
            className="w-full h-full object-cover opacity-40"
          />

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

      {/* AI RECOMMENDATIONS */}

      {searchedMovie && !loading && (

        <div className="px-8 pb-10">

          <h2 className="text-4xl font-bold mb-10">

            Recommendations for:

            <span className="text-red-500">
              {" "} {searchedMovie}
            </span>

          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

            {moviesData.map((movie, index) => (

              <div
                key={index}
                className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-red-500/20 transition duration-300"
              >

                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[350px] object-cover"
                />

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

      {/* HOMEPAGE */}

      {!searchedMovie && (

        <div className="mt-10">

          <MovieRow
            title="🔥 Trending Movies"
            movies={trendingMovies}
          />

          <MovieRow
            title="🎬 Popular Movies"
            movies={popularMovies}
          />

          <MovieRow
            title="⭐ Top Rated Movies"
            movies={topRatedMovies}
          />

        </div>

      )}

    </div>

  )

}

export default App