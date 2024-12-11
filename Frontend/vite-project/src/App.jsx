import React from 'react'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import AdminDashboard from './Pages/Admindashboard'
import Cart from './Pages/Favorite'
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Pages/ProtectedRoute'
import Context from './Context/Context'
import CreateRecipe from './Pages/CreateRecipe'
import UpdateRecipe from './Pages/UpdateRecipe'



const App = () => {
  return (

    <Context>
      <Routes>
        <Route path="/"  element={<Home />}   />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Admin" element={<ProtectedRoute element={<AdminDashboard />} />} role="Admin" />
        <Route path="/create" element={<ProtectedRoute element={<CreateRecipe/>} />} role="Admin" />
        <Route path="/update/:id" element={<ProtectedRoute element={<UpdateRecipe/>} />} role="Admin" />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Context>


  )
}

export default App