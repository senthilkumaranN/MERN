import React, { useState,useEffect,useContext } from 'react'
import { Authcontext } from '../Context/Context'

const Pagination = () => {

    const {setrecipe} = useContext(Authcontext);
    const [currentPage,setcurrentPage] = useState(1)
    const [totalPage,settotalPage] = useState(1)

    const API_URL = import.meta.env.VITE_API_BASE_URL;


    const fetchItems= async () =>{
        try{
           const response = await fetch(`${API_URL}/api/Pagination?page=${currentPage}&limit=4`);
           const data = await response.json()
           setrecipe(data.items);
           settotalPage(data.totalPages);
        }catch(error){
            console.error("error fetching items:",error);
        }
    }

    useEffect(()=>{
        fetchItems()
    },[currentPage]);
  

    const handleNextPage = () => {
        if(currentPage < totalPage){
            setcurrentPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if(currentPage > 1){
            setcurrentPage(currentPage - 1);
        }
    }
    
  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
    {/* Previous Button */}
    <button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        className={`px-4 py-2 rounded-md font-medium ${
            currentPage === 1
                ? "bg-gradient-to-r from-green-500 to-yellow-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-yellow-400 text-white hover:bg-green-600"
        }`}
    >
        Previous
    </button>

    {/* Current Page Info */}
    <span className="px-4 py-2 border rounded-md bg-gray-100">
        Page {currentPage} of {totalPage}
    </span>

    {/* Next Button */}
    <button
        onClick={handleNextPage}
        disabled={currentPage === totalPage}
        className={`px-4 py-2 rounded-md font-medium ${
            currentPage === totalPage
                ? "bg-gradient-to-r from-green-500 to-yellow-400 cursor-not-allowed"
                : "bg-gradient-to-r from-green-500 to-yellow-400  text-white hover:bg-green-600"
        }`}
    >
        Next
    </button>
</div>    

  )
}

export default Pagination