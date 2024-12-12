import React, { useContext, useState } from 'react'
import { Authcontext } from '../Context/Context';
import { NavLink, useNavigate } from 'react-router-dom';
import backgroundimage from '../assests/bg-image.jpg'


const Login = () => {

   const { login } = useContext(Authcontext);
   const [formdata, setformdata] = useState({
      name: '', password: ''
   })
   const [error, seterror] = useState('')
   const [validationerror, setvalidationerror] = useState({})
   const navigate = useNavigate();

   


   const handleinput = (e) => {
      setformdata({
         ...formdata,
         [e.target.name]: e.target.value
      })
   }

   const validatelogin = () => {
      const newerror = {};

      if (!formdata.name.trim()) {
         newerror.name = "Name is required"
      }
      if (!formdata.password.trim()) {
         newerror.password = "password is required"
      }
      setvalidationerror(newerror);
      return Object.keys(newerror).length === 0;
   }

   const handlesubmit = async (e) => {
      e.preventDefault()
      const { name, password } = formdata;
      seterror('')

      if (validatelogin()) {
         try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ name, password })
            });
            const data = await response.json()
            

            if (data) {

               const user = { name: data.name, role: data.role, accesstoken: data.accesstoken }
               login(user);
               navigate("/")
            } else {
               seterror("Invaild credentials")
            }

         } catch (error) {
            seterror('Login Failed')
            console.log(error)
         }
      }

   }
   return (
      <div className='bg-cover bg-fixed bg-center h-screen'
         style={{ backgroundImage: `url(${backgroundimage})` }}>
        
         <div className='bg-opacity-50 bg-black h-full flex justify-center items-center'>
            <form onSubmit={handlesubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto  animate-fade-in-down">
               <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Login</h2>
               {error && <p className="text-red-500 text-xl text-center mt-1">{error}</p>}
               <div className="mb-4">
                  <input
                     type="text"
                     name="name"
                     value={formdata.name}
                     placeholder="Username"
                     onChange={handleinput}
                     className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {validationerror.name && <p className="text-red-500 text-sm mt-1">{validationerror.name}</p>}
               </div>

               <div className="mb-4">
                  <input
                     type="password"
                     name="password"
                     value={formdata.password}
                     placeholder="Password"
                     onChange={handleinput}
                     className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  {validationerror.password && <p className="text-red-500 text-sm mt-1">{validationerror.password}</p>}
               </div>

               <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
               >
                  Login
               </button>

               <div className="mt-4 text-center">
                  <span>Don't have an account? </span>
                  <NavLink to="/register" className="text-green-600 underline hover:text-green-800">
                     Register
                  </NavLink>
               </div>
            </form>
         </div>
      </div>
   )
}

export default Login