const mongoose = require('mongoose');


const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [{ name: String, quantity: String }],
    steps: [String],
    image: { type: String }

})

module.exports = mongoose.model('Recipe',RecipeSchema);