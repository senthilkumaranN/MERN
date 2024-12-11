const express = require('express');
const router = express.Router();
const { protect, admin } = require('../Middleware/Authmiddleware')
const Recipe = require('../Model/Recipe')
const multer = require('multer')



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    },
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image.jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invaild file type, only jpeg,png,jpg are allowed'), false);
        }
    }
})

router.get('/recipe', async (req, res) => {
    const recipe = await Recipe.find()
    res.json({food:recipe});
})

router.post('/createRecipe', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { title, description, ingredients, steps } = req.body;
        const image = req.file ? req.file.path : null;
        const parsedingredients = JSON.parse(ingredients)
        const newrecipe = new Recipe({
            title, description, ingredients: parsedingredients, steps, image: image
        })
        await newrecipe.save();
        res.status(201).json({
            sucess: true,
            message: "New recipe created successfully",
            newrecipe
        })
    } catch (error) {
        console.log(error)
        res.status(409).json({
            success: false,
            error: error.message
        })
    }
})
router.get('/Recipe/:id', protect, admin, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ success: false, message: 'Recipe not found' });
        }
        res.json(recipe); // Return recipe data for update
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch recipe' });
    }
});

router.get('/Pagination',async (req,res)=>{
    try{
        const {page = 1,limit = 4} = req.query;
        const pageNumber = parseInt(page,10)
        const pageSize = parseInt(limit,10)

        const items = await Recipe.find()
         .skip((pageNumber - 1) * pageSize)
         .limit(pageSize);

         const totalItems = await Recipe.countDocuments();
         res.status(200).json({
            items,
            totalPages: Math.ceil(totalItems / pageSize),
            currentPage: pageNumber , totalItems
         })

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
})

router.put("/updateRecipe/:id", protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { title, description, ingredients, steps } = req.body;
        const image = req.file ? req.file.path : null;
        const parsedIngredients = JSON.parse(ingredients);
        const updateRecipe = { title, description, ingredients: parsedIngredients, steps, image: image }
        if (image) updateRecipe.image = image;
        const updatedata = await Recipe.findByIdAndUpdate(req.params.id, updateRecipe, { new: true });

        if (!updatedata) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            })
        }
        res.json({updateRecipe:updatedata})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: " updaterecipe failed"
        })
    }
})
router.delete('/recipe/:id', protect, admin, async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            message: "deleted successfully"
        })

    } catch (error) {
        res.status(204).json({
            success: false,
            message: "deleted failed"
        })
    }
})

module.exports = router;