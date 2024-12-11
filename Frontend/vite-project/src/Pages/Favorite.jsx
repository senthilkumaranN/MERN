import React, { useContext } from 'react'
import { Authcontext } from '../Context/Context'
import { FaHeartCrack } from "react-icons/fa6";

const Cart = () => {

  const { favorites, removeFavorite } = useContext(Authcontext);
  return (
    <div className='bg-gray-100 min-h-screen'>
      <h1 className='text-center text-2xl font-poppins font-extrabold pt-5'>My Favorite Recipes</h1>
      {
        favorites && favorites.length === 0 ?
          <p className='text-center py-44 text-2xl font-extrabold'>No Favorite</p> : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-8xl  mx-auto p-5 gap-6">
              {
                favorites.map((recipe) => (
                  <div key={recipe._id} className=' flex flex-col  border bg-green-100 shadow-lg rounded-xl p-4 hover:shadow-xl transition-all'>
                    <img className="object-contain w-25 h-20" src={`http://localhost:3000/${recipe.image}`} alt={recipe.title}></img>
                    <span className='pt-2 font-extrabold'>Title:</span>
                    <h2 className='my-2 capitalize font-extrabold text-2xl'>{recipe.title}</h2>
                    <span className='pb-2 font-extrabold'>Description:</span>
                    <p className='font-medium capitalize '>{recipe.description}</p>
                    <span className='py-2 font-extrabold'>Steps:</span>
                    <p className='font-medium capitalize '>{recipe.steps}</p>
                    <div className='mt-4'>
                      <h3 className='font-extrabold text-xl'>Ingredients</h3>
                      <ul className='text-sm text-gray-600 mt-2'>
                        {
                          recipe?.ingredients?.map((ingredient, index) => (
                            <li key={index} className='list-disc list-inside capitalize font-semibold'>
                              {ingredient?.name} - {ingredient?.quantity}
                            </li>
                          ))
                        }
                      </ul>
                    </div>
                    <div className='mt-auto flex justify-center'>
                      <button className='mt-2 bg-gradient-to-r from-green-500 to-yellow-400 p-2 rounded-xl
                                 hover:bg-green-100 transition-all capitalize font-extrabold'
                        onClick={() => removeFavorite(recipe._id)}>
                        <FaHeartCrack className='inline-block pb-0.5' />removeFavorite</button>
                    </div>
                  </div>
                ))
              }
            </div>
          )
      }
    </div>
  )
}

export default Cart