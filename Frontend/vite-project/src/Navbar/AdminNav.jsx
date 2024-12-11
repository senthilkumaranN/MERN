import React, { useContext } from 'react'
import { Authcontext } from '../Context/Context'
import { NavLink } from 'react-router-dom';
import { RiAdminFill } from "react-icons/ri";
import { FaBars, FaTimes } from 'react-icons/fa';
import { BiSolidLogOutCircle } from "react-icons/bi";
import { useState } from 'react';
import { MdFormatListBulletedAdd } from "react-icons/md";

const AdminNav = () => {
    const { logout } = useContext(Authcontext);
    const [isopen, setisopen] = useState(false);


    function handlelogout() {
        logout();
    }

    function handleadminnav() {
        setisopen(!isopen)
    }
    return (
        <>
            <nav className='bg-gradient-to-r from-green-500 to-yellow-400 fixed top-0 left-0 w-full z-50'>
                <div className='flex justify-between items-center w-[92%] mx-auto h-14'>
                    <h2 className='font-[poppins] font-extrabold text-lg '>SENRecipes</h2>
                    <div className='hidden md:flex items-center gap-[4vw]'>
                        <NavLink className='flex items-center font-semibold hover:bg-green-100 hover:rounded-full hover:p-2' to={"/admin"} >
                            <RiAdminFill className='mr-1' />AdminHome</NavLink>
                        <NavLink className='flex items-center font-semibold hover:bg-green-100 hover:rounded-full hover:p-2' to={"/create"} >
                            < MdFormatListBulletedAdd className='mr-1'/>CreateRecipe</NavLink>
                        <button className='flex items-center font-semibold hover:bg-green-100 hover:rounded-full hover:p-2'
                            onClick={handlelogout}> <BiSolidLogOutCircle className='mr-1' />Logout</button>
                    </div>
                    <div className='md:hidden flex items-center '>
                        <button className='focus:outline-none' onClick={handleadminnav}>
                            {
                                isopen ? <FaTimes className='w-6 h-6' /> : <FaBars className='w-6 h-6' />
                            }
                        </button>
                    </div>
                </div>
                {
                isopen && (
                       <div  className="md:hidden  bg-green-100 shadow-lg">
                            <NavLink className='block w-full text-left py-2 px-4 text-gray-700 hover:bg-white' to={"/admin"}
                             onClick={()=>setisopen(false)}>
                                    <RiAdminFill className="inline-block mr-2"/>AdminPage
                            </NavLink>
                            <NavLink className='block w-full text-left py-2 px-4 text-gray-700 hover:bg-white' to={"/create"}
                            onClick={()=>setisopen(false)}>
                                  < MdFormatListBulletedAdd className='inline-block mr-2'/>CreateRecipe
                            </NavLink>
                            <button onClick={()=>{
                                handlelogout();
                                setisopen(false)
                                 }} className='block w-full text-left py-2 px-4 text-gray-700 hover:bg-white'>
                                    <BiSolidLogOutCircle className="inline-block mr-2"/>logout
                            </button>
                       </div>
                )
            }

            </nav>
           
        </>
    )
}

export default AdminNav