import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import {
  addFavorite,
  getFavorites,
  removeFavorite
} from './services/favoriteService'

function App() {

  // =========================
  // STATES
  // =========================

  const [movie, setMovie] = useState("")
  const [moviesData, setMoviesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchedMovie, setSearchedMovie] = useState("")
  const [mainMovieData, setMainMovieData] = useState(null)

  const [trendingMovies, setTrendingMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])

  const [favorites, setFavorites] = useState([])

  const [activeCategory, setActiveCategory] = useState("home")

  const TMDB_API_KEY =
    import.meta.env.VITE_TMDB_API_KEY

  const token =
    localStorage.getItem("token")

  const navigate = useNavigate()

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("token")

    navigate("/")

  }

  // =========================
  // FETCH FAVORITES
  // =========================

  const fetchFavorites = async () => {

    try {

      const data = await getFavorites()

      setFavorites(data)

    } catch (error) {

      console.log(error)

    }

  }

  // =========================
  // FAVORITE CHECK
  // =========================

  const isFavorite = (movieTitle) => {

    return favorites.some(

      (fav) => fav.movie_title === movieTitle

    )

  }

  // =========================
  // ADD FAVORITE
  // =========================

  const handleFavorite = async (movie) => {

    try {

      const existingFavorite = favorites.find(

        (fav) => fav.movie_title === movie.title

      )

      // REMOVE FAVORITE

      if (existingFavorite) {

        await removeFavorite(
          existingFavorite.id
        )

      }

      // ADD FAVORITE

      else {

        await addFavorite({

          movie_title: movie.title,

          poster_path:
            `https://image.tmdb.org/t/p/w500${movie.poster_path}`

        })

      }

      fetchFavorites()

    } catch (error) {

      console.log(error)

      alert("Login required")

    }

  }
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

      setTrendingMovies(
        trendingResponse.data.results
      )

      setPopularMovies(
        popularResponse.data.results
      )

      setTopRatedMovies(
        topRatedResponse.data.results
      )

    } catch (error) {

      console.log(error)

    }

  }

  // =========================
  // GET RECOMMENDATIONS
  // =========================

  const getRecommendations = async () => {

    if (!movie) return

    setLoading(true)

    try {

      setSearchedMovie(movie)

      const mainMovieResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie`,
        {
          params: {
            api_key: TMDB_API_KEY,
            query: movie
          }
        }
      )

      if (
        mainMovieResponse.data.results.length === 0
      ) {

        alert("Movie not found")

        setLoading(false)

        return

      }

      const selectedMovie =
        mainMovieResponse.data.results[0]

      setMainMovieData(selectedMovie)

      const movieYear =
        selectedMovie.release_date?.split("-")[0]

      const backendMovieTitle =
        `${selectedMovie.title} (${movieYear})`

      const response = await axios.get(
        `http://127.0.0.1:8000/api/recommend/?movie=${encodeURIComponent(backendMovieTitle)}&user_id=1`
      )

      const recommendedMovies =
        response.data.recommendations

      let movieResults = []

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

        if (
          tmdbResponse.data.results.length > 0
        ) {

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
  // INITIAL LOAD
  // =========================

  useEffect(() => {

    fetchHomepageMovies()

    fetchFavorites()

  }, [])

  // =========================
  // MOVIE ROW
  // =========================

  const MovieRow = ({
    title,
    movies,
    sectionId
  }) => (

    <div
      id={sectionId}
      className="mb-14 scroll-mt-28"
    >

      <h2 className="text-3xl font-bold mb-6 px-8">
        {title}
      </h2>

      <div className="flex gap-5 overflow-x-auto px-8">

        {movies.map((movie) => (

          <div
            key={movie.id}
            className="min-w-[220px] bg-zinc-900 rounded-2xl overflow-hidden hover:scale-105 transition duration-300 relative"
          >

            {/* FAVORITE BUTTON */}

            <button
              onClick={() => handleFavorite(movie)}
              className="absolute top-3 right-3 z-10 bg-black/70 px-3 py-1 rounded-full text-lg hover:scale-110 transition"
            >

              {isFavorite(movie.title)
                ? "❤️"
                : "🤍"}

            </button>

            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-xl h-[320px] w-full object-cover"
            />

            <div className="p-3">

              <h3 className="text-lg font-semibold line-clamp-2">
                {movie.title}
              </h3>

              <p className="text-yellow-400 mt-2">
                ⭐ {movie.vote_average}
              </p>

            </div>

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

                navigate("/")

                setActiveCategory("home")

                setSearchedMovie("")
                setMoviesData([])
                setMainMovieData(null)
                setMovie("")

                window.scrollTo({
                  top: 0,
                  behavior: "smooth"
                })

              }}
              className={`${activeCategory === "home"
                ? "text-red-500"
                : "text-white"} hover:text-red-400 transition`}
            >
              Home
            </button>

            <button
              onClick={() => {

                setActiveCategory("trending")

                document
                  .getElementById("trending")
                  ?.scrollIntoView({
                    behavior: "smooth"
                  })

              }}
              className={`${activeCategory === "trending"
                ? "text-red-500"
                : "text-white"} hover:text-red-400 transition`}
            >
              Trending
            </button>

            <button
              onClick={() => {

                setActiveCategory("popular")

                document
                  .getElementById("popular")
                  ?.scrollIntoView({
                    behavior: "smooth"
                  })

              }}
              className={`${activeCategory === "popular"
                ? "text-red-500"
                : "text-white"} hover:text-red-400 transition`}
            >
              Popular
            </button>

            <button
              onClick={() => {

                setActiveCategory("toprated")

                document
                  .getElementById("toprated")
                  ?.scrollIntoView({
                    behavior: "smooth"
                  })

              }}
              className={`${activeCategory === "toprated"
                ? "text-red-500"
                : "text-white"} hover:text-red-400 transition`}
            >
              Top Rated
            </button>

          </div>

          {/* AUTH */}

          <div className="flex gap-4">

            {!token ? (

              <>

                <Link
                  to="/login"
                  className="bg-zinc-800 px-5 py-2 rounded-lg hover:bg-zinc-700 transition"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Signup
                </Link>

              </>

            ) : (

              <>

                <Link
                  to="/favorites"
                  className="bg-zinc-800 px-5 py-2 rounded-lg hover:bg-zinc-700 transition"
                >
                  Favorites
                </Link>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-5 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>

              </>

            )}

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
            onChange={(e) =>
              setMovie(e.target.value)
            }
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

      {/* SEARCHED MOVIE */}

      {mainMovieData && !loading && (

        <div className="px-8 pt-4 pb-10">

          <h2 className="text-4xl font-bold mb-8">

            🎬 Search Result:

            <span className="text-red-500">
              {" "} {mainMovieData.title}
            </span>

          </h2>

          <div className="w-[320px] bg-zinc-900 rounded-2xl overflow-hidden">

            <img
              src={`https://image.tmdb.org/t/p/w500${mainMovieData.poster_path}`}
              alt={mainMovieData.title}
              className="w-full h-[450px] object-cover"
            />

            <div className="p-5">

              <h2 className="text-2xl font-bold mb-3">
                {mainMovieData.title}
              </h2>

              <p className="text-yellow-400 text-lg mb-4">
                ⭐ {mainMovieData.vote_average}
              </p>

              <button
                onClick={() =>
                  handleFavorite(mainMovieData)
                }
                className="mt-4 w-full p-3 rounded-lg font-bold transition"
                style={{
                  backgroundColor:
                    isFavorite(mainMovieData.title)
                      ? "#dc2626"
                      : "#27272a"
                }}
              >

                {isFavorite(mainMovieData.title)
                  ? "❤️ Favorited"
                  : "🤍 Add to Favorites"}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* RECOMMENDATIONS */}

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
                className="bg-zinc-900 rounded-2xl overflow-hidden"
              >

                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-[350px] object-cover"
                />

                <div className="p-4">

                  <h2 className="text-xl font-bold mb-2">
                    {movie.title}
                  </h2>

                  <p className="text-yellow-400 mb-2">
                    ⭐ {movie.vote_average}
                  </p>

                  <button
                    onClick={() =>
                      handleFavorite(movie)
                    }
                    className="mt-4 w-full p-3 rounded-lg font-bold transition"

                    style={{
                      backgroundColor:
                        isFavorite(movie.title)
                          ? "#dc2626"
                          : "#27272a"
                    }}
                  >

                    {isFavorite(movie.title)
                      ? "❤️ Favorited"
                      : "🤍 Add to Favorites"}

                  </button>

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
            sectionId="trending"
          />

          <MovieRow
            title="🎬 Popular Movies"
            movies={popularMovies}
            sectionId="popular"
          />

          <MovieRow
            title="⭐ Top Rated Movies"
            movies={topRatedMovies}
            sectionId="toprated"
          />

        </div>

      )}

    </div>

  )

}

export default App