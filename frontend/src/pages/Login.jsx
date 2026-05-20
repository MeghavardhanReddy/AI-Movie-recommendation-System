import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../services/authService"

function Login() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    })

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })

    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        try {

            const response = await loginUser(formData)

            localStorage.setItem(
                "token",
                response.access
            )

            alert("Login Successful!")

            navigate("/")

        } catch (error) {

            console.log(error)

            alert("Login Failed")

        }

    }

    return (

        <div className="min-h-screen bg-black flex items-center justify-center">

            <form
                onSubmit={handleSubmit}
                className="bg-zinc-900 p-10 rounded-2xl w-[400px]"
            >

                <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">
                    Login
                </h1>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-lg bg-zinc-800 text-white"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full p-4 mb-6 rounded-lg bg-zinc-800 text-white"
                />

                <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-lg font-bold"
                >
                    Login
                </button>

            </form>

        </div>

    )

}

export default Login