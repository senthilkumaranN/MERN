import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import backgroundimage from '../assests/bg-image.jpg';

const Register = () => {
    const [formdata, setformdata] = useState({
        name: '', password: '', email: '', role: ''
    })
    const [validationerror, setvalidationerror] = useState({});
    const [error, seterror] = useState('')
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_BASE_URL;


    const handleinput = (e) => {
        setformdata({
            ...formdata,
            [e.target.name]: e.target.value
        })
    }

    const validateform = () => {
        const newError = {}

        if (!formdata.name.trim()) {
            newError.name = "name is required"
        }
        if (!formdata.email.trim()) {
            newError.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formdata.email)) {
            newError.email = "Invaild email format"
        }
        if (!formdata.password.trim()) {
            newError.password = "password is required"
        }
        if (!formdata.role.trim()) {
            newError.role = "role is required"
        }
        setvalidationerror(newError);
        return Object.keys(newError).length === 0;
    }

    const handlesubmit = async (e) => {
        e.preventDefault()
        const { name, email, password, role } = formdata;



        if (validateform()) {
            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role }),
                });

                // Check if the response is successful
                if (!res.ok) {
                    throw new Error(`HTTP ERROR! status: ${res.status}`);
                }

                // Parse JSON response
                const data = await res.json();
                console.log(data);

                if (res.ok) {
                    alert('Registration successful!');
                    navigate('/login');
                } else {
                    seterror(data.message || 'Registration failed');
                }
            } catch (error) {
                seterror('Server error, please try again');
                console.error(error.message);
            }

        }
    }
    return (
        <div className='bg-cover bg-center bg-fixed h-screen sm:bg-cover sm:bg-center'
          style={{backgroundImage: `url(${backgroundimage})`}}>
            
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <div className="bg-black bg-opacity-50 h-full flex justify-center items-center">
            <form onSubmit={handlesubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto animate-fade-in-down">
                <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Register</h2>
                <div className='mb-4'>
                    <input type='text' placeholder='username'
                        name='name' value={formdata.name} onChange={handleinput} 
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
                    {validationerror.name && <p className="text-red-500 text-sm mt-1">{validationerror.name}</p>}
                </div>
                <div className='mb-4'>
                    <input type='email' placeholder='email'
                        name='email' value={formdata.email} onChange={handleinput} 
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
                    {validationerror.email && <p className="text-red-500 text-sm mt-1">{validationerror.email}</p>}
                </div>
                <div className='mb-4'>
                    <input type='password' placeholder='password'
                        name='password' value={formdata.password} onChange={handleinput}
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    {validationerror.password && <p className="text-red-500 text-sm mt-1">{validationerror.password}</p>}
                </div>
                <div className='mb-4'>
                    <select name='role' value={formdata.role} onChange={handleinput}
                     className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="" disabled>Select role</option>
                        <option value='user'>user</option>
                        <option value='Admin'>Admin</option>
                    </select>
                    {validationerror.role && <p className="text-red-500 text-sm mt-1">{validationerror.role}</p>}
                </div>
                <button type='submit' className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300">Register</button>
                <div className='mt-4 text-center'>
                    <span>Already Have a account? Please</span>
                    <NavLink to={'/login'} className='text-green-600 underline hover:text-green-800'>Login</NavLink>
                </div>
            </form>
            </div>
        </div>
    )
}

export default Register