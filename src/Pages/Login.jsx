import React, { useState } from "react";
import { Link, useNavigate, useResolvedPath } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loginUser } from "../Features/Authentication.slice.jsx";

const Login = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')

    const dispatch = useDispatch();
    const { error, isAuthenticated } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const resultAction = await dispatch(loginUser({ email, password, username }));
        if (loginUser.fulfilled.match(resultAction)) {
            navigate('/');
        }
    } 


    return (
        <>
        
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="flex flex-col w-1/3 bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Log In</h2>

                <div className="flex flex-col gap-4 mb-4">
                    <input
                        className="border-2 rounded-lg p-2"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="border-2 rounded-lg p-2"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="border-2 rounded-lg p-2"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mb-4 text-blue-700 cursor-pointer hover:underline">
                    Forgot password?
                </div>

                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-700 mb-4">
                    Login
                </button>

                <div>
                    Don't have an account?{" "}
                    <Link to="/signup"
                        className="text-blue-700 hover:underline">Sign Up</Link>
                </div>

                {error && <p
                    className="text-2xl text-red-500 font-bold mb-4"
                >{error}</p>}
            </div>
        </div>
        </>
    )
}

export default Login;