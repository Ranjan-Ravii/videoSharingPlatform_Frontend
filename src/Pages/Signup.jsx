import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"


const SignUp = () => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    function handleSignup(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);
        formData.append('username', username);
        formData.append('fullname', fullname);
        formData.append('avatar', avatar);
        formData.append('coverImage', coverImage);
        formData.append('password', password);

        fetch('http://localhost:8000/api/v1/users/register', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                console.log("Success : ", result);
                alert("Sign up completed.")
                navigate('/')
            })
            .catch(error => {
                console.error('Error:', error)
                alert("Sign up failed.")
            });

    }

    return (
        <>

            <div className="flex items-center justify-center min-h-screen ml-5 mb-15 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">

                <form onSubmit={handleSignup}
                className="flex flex-col w-1/3 bg-gray-200 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

                    <div className="flex flex-col gap-4 mb-4">
                        <input id="email"
                            className="border-2 rounded-lg p-2"
                            type="email"
                            value={email}
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input id="username"
                            className="border-2 rounded-lg p-2"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input id="fullname"
                            className="border-2 rounded-lg p-2"
                            type="text"
                            placeholder="Full Name"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                        />
                        <input id="avatar"
                            className="border-2 rounded-lg p-2"
                            type="file"
                            accept="image/*"
                            placeholder="Avatar"
                            onChange={(e) => setAvatar(e.target.files[0])}
                        />
                        <input id="coverImage"
                            className="border-2 rounded-lg p-2"
                            type="file"
                            accept="image/*"
                            placeholder="Cover Image"
                            onChange={(e) => setCoverImage(e.target.files[0])}
                        />
                        <input id="password"
                            className="border-2 rounded-lg p-2"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-700 mb-4">
                        Sign Up
                    </button>

                    <div>
                        Already have an account?{" "}
                        <Link to="/login"
                            className="text-blue-700 hover:underline">Log In</Link>
                    </div>
                </form>
            </div>
        </>
    )
}

export default SignUp;