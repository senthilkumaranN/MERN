import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Authcontext } from '../Context/Context';

const UpdateRecipe = () => {
    const { setrecipe, recipe } = useContext(Authcontext);
    const [updateformdata, setupdateformdata] = useState({
        title: '',
        description: '',
        ingredients: [{ name: '', quantity: '' }],
        steps: '',
        image: null,
    });
    const [error, seterror] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const API_URL = import.meta.env.VITE_API_BASE_URL;


    useEffect(() => {
        const token = localStorage.getItem('accesstoken');
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`${API_URL}/api/Recipe/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch recipe data');
                const data = await response.json();
                setupdateformdata({
                    title: data?.title || '',
                    description: data?.description || '',
                    ingredients: data?.ingredients || [{ name: '', quantity: '' }],
                    steps: data?.steps || '',
                    image: data?.image || null
                });
            } catch (err) {
                seterror(err.message || 'Network error');
            }
        };

        fetchRecipe();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setupdateformdata({ ...updateformdata, [name]: value });
    };

    const handleIngredientChange = (index, e) => {
        const { name, value } = e.target;
        const updatedIngredients = [...updateformdata.ingredients];
        updatedIngredients[index][name] = value;
        setupdateformdata({ ...updateformdata, ingredients: updatedIngredients });
    };

    const addIngredient = () => {
        setupdateformdata({
            ...updateformdata,
            ingredients: [...updateformdata.ingredients, { name: '', quantity: '' }],
        });
    };

    const removeIngredient = (index) => {
        const updatedIngredients = updateformdata.ingredients.filter((_, i) => i !== index);
        setupdateformdata({ ...updateformdata, ingredients: updatedIngredients });
    };

    const handleFileChange = (e) => {
        setupdateformdata({ ...updateformdata, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', updateformdata.title);
            formData.append('description', updateformdata.description);
            formData.append('ingredients', JSON.stringify(updateformdata.ingredients));
            formData.append('steps', updateformdata.steps);
            if (updateformdata.image) formData.append('image', updateformdata.image);

            const token = localStorage.getItem('accesstoken');
            const response = await fetch(`${API_URL}/api/updateRecipe/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await response.json();
            console.log(data)
            if (data && data.updateRecipe) {
                setrecipe((prevRecipes) =>
                    prevRecipes.map((recipe) =>
                        recipe._id === data.updateRecipe._id ? data.updateRecipe : recipe
                    )
                );
                alert("Updated Successfully")
                navigate('/admin');
            } else {
                seterror(data.error || 'Error updating recipe');
            }
        } catch (err) {
            seterror(err.message || 'Error submitting the form');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div  className='flex justify-center items-center min-h-screen bg-gray-100 overflow-auto'>

            
            <form onSubmit={handleSubmit} className='bg-green-100 w-full max-w-xl rounded-xl shadow-lg animate-fade-in-down p-6 '>
            {error && <p className="text-red-500 font-bold text-xl mt-1" style={{ color: 'red' }}>{error}</p>}
                <h1 className='text-center capitalize font-bold mt-3 text-2xl text-green-700 mb-6'>Update Recipe</h1>
                <div className='flex flex-col mb-4'>
                    <label className='mb-1 text-lg font-bold'>Title:</label>
                    <input className='p-3 rounded-lg border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        type="text"
                        name="title"
                        value={updateformdata.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='flex flex-col mb-4'>
                    <label className='mb-1 text-lg font-bold'>Description:</label>
                    <textarea className='p-3 rounded-lg border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        name="description"
                        value={updateformdata.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='flex flex-col mb-4'>
                    <label className='mb-1 text-lg font-bold'>Ingredients:</label>
                    {updateformdata.ingredients.map((ingredient, index) => (
                        <div key={index} className='flex flex-wrap gap-4 mb-2'>
                            <input className=' flex-grow w-full sm:w-auto p-3 rounded-lg border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, e)}
                                required
                            />
                            <input className='flex-grow w-full sm:w-auto p-3 rounded-lg border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                type="text"
                                name="quantity"
                                placeholder="Quantity"
                                value={ingredient.quantity}
                                onChange={(e) => handleIngredientChange(index, e)}
                                required
                            />
                            <button  className='bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600 transition'type="button" onClick={() => removeIngredient(index)}>
                                Remove
                            </button>
                        </div>
                    ))}
                    <button  className='bg-green-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-600 transition' type="button" onClick={addIngredient}>
                        Add Ingredient
                    </button>
                </div>
                <div className='flex flex-col mb-4'> 
                    <label className='mb-1 text-lg font-bold'>Steps:</label>
                    <textarea className='p-3 rounded-lg border shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                        name="steps"
                        value={updateformdata.steps}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='flex flex-col mb-4'>
                    <label className='mb-1 text-lg font-bold'>Image:</label>
                    <input type="file" name="image" onChange={handleFileChange} />
                </div>
                <button  className='bg-green-500 w-full text-white px-4 py-2 rounded-lg mt-2 hover:bg-green-600 transition' type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Recipe'}
                </button>
            </form>
        </div>
    );
};

export default UpdateRecipe;
