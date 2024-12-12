import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authcontext } from '../Context/Context';
import { RiTreasureMapFill } from 'react-icons/ri';

const CreateRecipe = () => {
  const { setrecipe, recipe } = useContext(Authcontext);
  const [formdata, setformdata] = useState({
    title: '',
    description: '',
    ingredients: [{ name: '', quantity: '' }], // Default to one ingredient field
    steps: '',
    image: null,
  });
  const [error, seterror] = useState('');
  const [validationerror, setvalidationerror] = useState({});
  const navigate = useNavigate();
  const [loading,setloading] = useState(false)

  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setformdata({ ...formdata, [name]: value });
  };

  // Handle ingredient changes
  const handleIngredientChange = (index, e) => {
    const { name, value } = e.target;
    const updatedIngredients = [...formdata.ingredients];
    updatedIngredients[index][name] = value;
    setformdata({ ...formdata, ingredients: updatedIngredients });
  };

  // Add a new ingredient field
  const addIngredient = () => {
    setformdata({
      ...formdata,
      ingredients: [...formdata.ingredients, { name: '', quantity: '' }],
    });
  };

  // Remove an ingredient field
  const removeIngredient = (index) => {
    const updatedIngredients = formdata.ingredients.filter((_, i) => i !== index);
    setformdata({ ...formdata, ingredients: updatedIngredients });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setformdata({ ...formdata, image: e.target.files[0] });
  };

  // Validate the form
  const validateForm = () => {
    const errors = {};
    if (!formdata.title.trim()) errors.title = 'Title is required';
    if (!formdata.description.trim()) errors.description = 'Description is required';
    if (formdata.ingredients.some((ing) => !ing.name || !ing.quantity)) {
      errors.ingredients = 'All ingredient fields are required';
    }
    if (!formdata.steps.trim()) errors.steps = 'Steps are required';
    if (!formdata.image) errors.image = 'Image is required';
    setvalidationerror(errors);
    return Object.keys(errors).length === 0;
  };
  
  

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setloading(true)
    if (validateForm()) {
      try {
        const formData = new FormData();
        formData.append('title', formdata.title);
        formData.append('description', formdata.description);
        formData.append('ingredients', JSON.stringify(formdata.ingredients));
        formData.append('steps', formdata.steps);
        formData.append('image', formdata.image);
        
        const token = localStorage.getItem('accesstoken');

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/createRecipe`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
        },
          body: formData,
        });

        const data = await response.json();
        if (data) {
          setrecipe([...recipe, data.newrecipe]);
          alert("New Created Successfully")
          navigate('/admin');
        } else {
          seterror(data.error || 'Error creating recipe');
        }
      } catch (error) {
        seterror('Error submitting the form');
        console.error(error);
      }finally{
        setloading(false)
      }
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 overflow-auto'>
      {error && <p className="text-red-500 font-bold text-xl mt-1">{error}</p>}
      <form onSubmit={handleSubmit} className='bg-green-100 w-full max-w-xl rounded-xl shadow-lg animate-fade-in-down p-6 '>
        <h1 className='text-center capitalize font-bold mt-3 text-2xl text-green-700 mb-6'>Create Recipe</h1>
        {/* Title */}
        <div className='flex flex-col mb-4'>
          <label className='mb-1 text-lg font-bold'>Title:</label>
          <input className='p-3 rounded-lg border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-green-500'
            type="text"
            name="title"
            placeholder="Enter recipe title"
            value={formdata.title}
            onChange={handleInputChange}
          />
          {validationerror.title && <p className="text-red-500 font-bold text-xl mt-1">{validationerror.title}</p>}
        </div>

        {/* Description */}
        <div className='flex flex-col mb-4 '>
          <label className='mb-1 text-lg font-bold'>Description:</label>
          <textarea className='p-3 rounded-lg border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-green-500'
            name="description"
            placeholder="Enter recipe description"
            value={formdata.description}
            onChange={handleInputChange}
          />
          {validationerror.description && <p className="text-red-500 font-bold text-xl mt-1">{validationerror.description}</p>}
        </div>

        {/* Ingredients */}
        <div className='flex flex-col mb-4 '>
          <label className='mb-1 text-lg font-bold'>Ingredients:</label>
          {formdata.ingredients.map((ingredient, index) => (
            <div key={index} className='flex flex-wrap gap-4 mb-2'>
              <input className='flex-grow w-full sm:w-auto p-3 rounded-lg border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                type="text"
                name="name"
                placeholder="Ingredient name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, e)}
              />
              <input className='flex-grow w-full sm:w-auto p-3 rounded-lg border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                type="text"
                name="quantity"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, e)}
              />
              <button className='bg-red-500 text-white p-2  rounded-xl hover:bg-red-700 transition ' type="button" onClick={() => removeIngredient(index)}>
                Remove
              </button>
            </div>
          ))}
          <button className='bg-green-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-600 transition' type="button" onClick={addIngredient}>
            Add Ingredient
          </button>
          {validationerror.ingredients && <p className="text-red-500 font-bold text-xl mt-1">{validationerror.ingredients}</p>}
        </div>

        {/* Steps */}
        <div className='flex flex-col mb-4 '>
          <label className='mb-1 text-lg font-bold'>Steps:</label>
          <textarea className='p-3 rounded-lg border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-green-500'
            name="steps"
            placeholder="Enter recipe steps"
            value={formdata.steps}
            onChange={handleInputChange}
          />
          {validationerror.steps && <p className="text-red-500 font-bold text-xl mt-1">{validationerror.steps}</p>}
        </div>

        {/* Image */}
        <div className='flex flex-col mb-4'>
          <label className='mb-1 text-lg font-bold'>Image:</label>
          <input className='p-3 rounded-lg border shadow-sm' type="file" name="image" onChange={handleFileChange} />
          {validationerror.image && <p className="text-red-500 font-bold text-xl mt-1">{validationerror.image}</p>}
        </div>
        <div className='text-center'>
        <button className='w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition text-lg' type="submit">
          {loading ? "Creating..." : "Create Recipe"}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
