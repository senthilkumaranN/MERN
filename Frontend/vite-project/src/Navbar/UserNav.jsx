import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Authcontext } from '../Context/Context'
import { FaBars, FaShoppingCart, FaHome, FaTimes, FaHeart } from 'react-icons/fa';
import { BiSolidLogOutCircle } from "react-icons/bi";
import { RiAdminFill } from "react-icons/ri";

const UserNav = () => {
    const { logout, isAuthenticated, user } = useContext(Authcontext)
    const [isopen, setisopen] = useState(false)



    function handleclick() {
        logout();
    }
    function handletoggle() {
        setisopen(!isopen)
    }
    return (
        <>
            <header className='bg-gradient-to-r from-green-500 to-yellow-400 fixed top-0 left-0 w-full z-50 '>
                <nav className='flex justify-between items-center w-[92%] mx-auto h-14'>
                    <h2 className='font-[poppins] font-extrabold text-lg '>SENRecipes</h2>
                    <div className='hidden md:flex items-center gap-[4vw]'>

                        <NavLink className='flex items-center font-semibold hover:bg-green-100 hover:rounded-full hover:p-2' to={"/"} >
                            <FaHome className='mr-1' />Home</NavLink>



                        <NavLink className='flex items-center font-semibold hover:bg-green-100 hover:rounded-full hover:p-2' to={"/cart"}>
                            <FaHeart className='mr-1' />Favorite</NavLink>

                        {isAuthenticated && user?.role === 'Admin' && (
                            <NavLink className='flex items-center font-semibold hover:bg-green-100 hover:rounded-full hover:p-2'
                                to={"/admin"}>
                                < RiAdminFill className='mr-1' />Admin</NavLink>
                        )}

                        <button className="flex items-center font-semibold bg-green-100 rounded-full p-1 hover:text-white" onClick={handleclick}>
                            <BiSolidLogOutCircle className='mr-1' />Logout</button>
                    </div>
                    <div className='md:hidden flex items-center'>
                        <button className=' focus:outline-none' onClick={handletoggle}>
                            {
                                isopen ? <FaTimes className='w-6 h-6' /> : <FaBars className='w-6 h-6' />
                            }

                        </button>
                    </div>
                </nav>
                {isopen && (
                    <div className="md:hidden  bg-green-100 shadow-lg">
                        <NavLink
                            className="block py-2 px-4 text-gray-700 hover:bg-white"
                            to="/"
                            onClick={() => setisopen(false)}
                        >
                            <FaHome className="inline-block mr-2" />
                            Home
                        </NavLink>
                        <NavLink
                            className="block py-2 px-4 text-gray-700 hover:bg-white"
                            to="/cart"
                            onClick={() => setisopen(false)}
                        >
                            <FaHeart className="inline-block mr-2" />
                            Favorites
                        </NavLink>
                        {isAuthenticated && user?.role === 'Admin' && (
                            <NavLink className='block py-2 px-4 text-gray-700 hover:bg-white'
                                to="/admin" onClick={() => setisopen(false)}>
                                < RiAdminFill className='inline-block mr-2' />Admin</NavLink>
                        )}
                        <button
                            className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-white"
                            onClick={() => {
                                handleclick();
                                setisopen(false);
                            }}
                        >
                            <BiSolidLogOutCircle className="inline-block mr-2" />
                            Logout
                        </button>
                    </div>
                )}
            </header>
        </>
    )
}

export default UserNav