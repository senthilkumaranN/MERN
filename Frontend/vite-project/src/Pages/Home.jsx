import React, { useContext, useEffect, useState } from 'react'
import UserNav from '../Navbar/UserNav'
import { Authcontext } from '../Context/Context'
import { Circles } from 'react-loader-spinner'
import AdminNav from '../Navbar/AdminNav';
import { FiEdit } from "react-icons/fi";
import { MdDeleteSweep } from "react-icons/md";
import { FaCopyright } from "react-icons/fa6";
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import backgroundimage from '../assests/home-bg2-image.jpg'
import Pagination from './Pagination';

const Home = () => {
  const { user, isAuthenticated, setrecipe, recipe, loading, error, DeleteRecipe,
    favorites, addFavorite, removeFavorite } = useContext(Authcontext)
  const navigate = useNavigate()
  const [searchquery, setsearchquery] = useState('')
 
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setsearchquery(query)
    const filtered = recipe.filter((product) => product.title.toLowerCase().includes(query));
    setrecipe(filtered)
  }


  if (error) return <p className='min-h-screen w-full flex justify-center items-center'>{error}</p>
  return (
    <>
      {
        loading ? (
          <div className="min-h-screen w-full flex justify-center items-center">
            <Circles
              height={"120"}
              width={"120"}
              color="rgb(127,29,29)"
              visible={true} />

          </div>) : (
          < div className='font-[Poppins] bg-cover bg-center bg-no-repeat  min-h-screen' style={{ backgroundImage: `url(${backgroundimage})` }}>
            {isAuthenticated && user?.role === "user" ? <UserNav /> : <AdminNav />}
            <div className='pt-16 bg-black bg-opacity-20'>

              {
                isAuthenticated && user ? (
                  <>
                    <div className='flex flex-col flex-wrap items-center w-full'>
                      <h1 className='p-3 text-2xl  capitalize text-green-100'>Welcome to the SENRecipes!</h1>
                      <h1 className='text-xl  capitalize font-bold text-white space-x-2'>Hello,{user?.name}</h1>
                      <input type='text' placeholder='Search Recipe...' onChange={handleSearch} value={searchquery}
                        className='mt-3 p-2 flex-grow sm:w-auto focus:ring-2 focus:ring-green-500 focus:outline-none
                        rounded-xl'></input>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-8xl   mx-auto p-5 gap-6">
                      {
                        recipe.map((data) => {
                          if (!data) return null
                          const isFavorite = favorites?.some((item) => item?._id === data?._id);
                          return (
                            <div key={data?._id} className=' flex flex-col sm:mx-2 border bg-green-100 shadow-lg rounded-xl p-4 hover:shadow-xl transition-all' >
                              <div className="flex justify-center w-full md:w-24 md:mx-auto lg:w-32 xl:w-40">
                                <img
                                  className="object-cover w-16 h-16 sm:w-22 sm:h-22 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-40 xl:h-40 object-center rounded-xl shadow-lg transition-transform duration-75 ease-in-out transform hover:scale-110 cursor-pointer"
                                  src={data?.image ? `${API_URL}/${data?.image}` : '/path/to/default-image.jpg'}
                                  alt={data?.title || 'Default Image'}
                                />
                              </div>

                              <span className='pt-2 font-extrabold'>Title:</span>
                              <h2 className='my-2 capitalize font-extrabold text-2xl'>{data?.title}</h2>
                              <span className='pb-2 font-extrabold'>Description:</span>
                              <p className='font-medium capitalize '>{data?.description}</p>
                              <span className='py-2 font-extrabold'>Steps:</span>
                              <p className='font-medium capitalize'>{data?.steps}</p>
                              <div className='mt-4'>
                                <h3 className='font-extrabold text-xl'>Ingredients</h3>
                                <ul className='text-sm text-gray-600 mt-2'>
                                  {
                                    data?.ingredients?.map((ingredient, index) => (
                                      <li key={index} className='list-disc list-inside capitalize font-semibold'>
                                        {ingredient?.name} - {ingredient?.quantity}
                                      </li>
                                    ))
                                  }
                                </ul>
                              </div>

                              {

                                isAuthenticated && user?.role === "Admin" ? (
                                  <div className='mt-auto flex justify-between space-x-4'>
                                    <button className='bg-gradient-to-r from-green-500 to-yellow-400 p-2 rounded-xl 
                                   duration-300 ' onClick={() => navigate(`/update/${data._id}`)}>
                                      <FiEdit className='inline-block' />Update</button>

                                    <button className='bg-gradient-to-r from-green-500 to-yellow-400 p-2 rounded-xl
                                   duration-300 ' onClick={() => DeleteRecipe(data?._id)}>
                                      <MdDeleteSweep className='inline-block ' />Delete</button>
                                  </div>
                                ) : (
                                  <div className='mt-auto flex justify-center'>
                                    <button className=' mt-2 bg-gradient-to-r from-green-500 to-yellow-400 p-2 rounded-xl
                                 hover:bg-green-100 transition-all'
                                      onClick={() => isFavorite ? removeFavorite(data._id) : addFavorite(data)}
                                    ><FaHeart className='inline-block pb-0.5' />{isFavorite ? "RemoveFromFavorite" : "AddToFavorite"}</button>
                                  </div>
                                )
                              }
                            </div>
                          )
                        })
                      }
                    </div>

                  </>


                ) : <p className="text-center mt-20 text-lg text-gray-700">Sorry! No Data Available</p>

              }

            </div>
            <Pagination />

            <p className='text-center mt-2 text-green-600 font-extrabold
              hover:text-green-200'><FaCopyright className='inline-block' />Designed by Sen</p>

          </div >
        )
      }

    </>
  )
}

export default Home