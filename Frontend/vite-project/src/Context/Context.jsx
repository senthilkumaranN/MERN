import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


export const Authcontext = createContext();

const Context = ({ children }) => {
   const [user, setuser] = useState(null);
   const [isAuthenticated, setisAuthenticated] = useState(false);
   const [protectloading, setprotectloading] = useState(true)
   const navigate = useNavigate()
   const [recipe, setrecipe] = useState([])
   const [loading, setloading] = useState(false)
   const [error, seterror] = useState("")
   const [favorites,setfavorites] = useState([])

   const API_URL = import.meta.env.VITE_API_BASE_URL
   console.log(API_URL)


   useEffect(() => {
      const storedusername = JSON.parse(localStorage.getItem('user'))

      if (storedusername) {
         setuser(storedusername)
         setisAuthenticated(true);
      } else {
         console.log("user is not authenticated no data in localstorage");
         navigate("/login")
      }
      setprotectloading(false)
   }, [])

   const login = (userdata) => {

      setuser(userdata)
      setisAuthenticated(true)
      localStorage.setItem('user', JSON.stringify(userdata))
      localStorage.setItem('accesstoken', userdata.accesstoken)
      console.log('User logedin:', user);

   }

   const logout = () => {
      setuser(null)
      setisAuthenticated(false)
      localStorage.removeItem('user')
      localStorage.removeItem('accesstoken')
      navigate("/login")
   }




   const fetchrecipe = async () => {
      try {
         setloading(true)
         const response = await fetch(`${API_URL}/api/recipe`)
         const data = await response.json();
         console.log(data.food)
         setrecipe(data.food);


      } catch (error) {
         console.error("Error fetching recipes", error.message)
         seterror(error.message)
      } finally {
         setloading(false)
      }
   }

  

   const DeleteRecipe = async (id) => {
      try {
         const token = localStorage.getItem('accesstoken');
         const response = await fetch(`${API_URL}/api/recipe/${id}`, {
            method: 'DELETE',
            headers: {

               Authorization: `Bearer ${token}`,

            }
         })
         const data =  await response.json()
         if (data) {
            setrecipe((prevRecipes) => prevRecipes.filter((recipe) => recipe?._id !== id));
            alert(data.message);
        }

      } catch (error) {
             seterror(error.message)
      }
   }
   

    useEffect(() => {
      fetchrecipe();
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setfavorites(storedFavorites)
   }, [])
   

  

  const addFavorite = (recipe) => {
   // Avoid duplicates
   if (!favorites.some((item) => item._id === recipe._id)) {
      const updatedFavorites = [...favorites, recipe];
       setfavorites(updatedFavorites);
       localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
   }
};

const removeFavorite = (id) => {
   const updatedFavorites = favorites.filter((item) => item._id !== id);
    setfavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
};



   return (
      <Authcontext.Provider value={{ user, isAuthenticated, login, logout, protectloading, recipe, loading,
      DeleteRecipe, error, setrecipe,favorites,addFavorite,removeFavorite }}>
         {children}
      </Authcontext.Provider>
   )
}

export default Context