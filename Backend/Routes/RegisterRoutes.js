const express = require('express');
const jwt = require('jsonwebtoken')
const Register = require('../Model/Register')
const router = express.Router();
const bcrypt = require('bcryptjs')


router.post('/register', async (req,res)=>{
    const {name,email,password,role} = req.body;
    const allowedrole = ['user','Admin']
    try{
        const checkexistinguser = await Register.findOne({email})
        if(checkexistinguser){
            res.status(409).json({
                success: false,
                message: 'user email already exist'
            })
        }
        if(!allowedrole.includes(role)){
             return res.status(404).json({message: "Invaild role provided"})
        }
        const newlyregister = new Register({
            name,email,password,role
        })
        await newlyregister.save();

        if(newlyregister){
            res.status(201).json({
                status: true,
                message: "user register is successfully done"
            })
        }else{
            res.status(409).json({
                success: false,
                message: "user register is not created succesfully"
            })
        }
        
    }catch(error){
        console.log(error)
        res.status(500).json({
            error: error.message
        })
    }
})

router.post('/login', async  (req,res)=>{
    try{
    const {name,password} = req.body
    const user = await Register.findOne({name})
    if(!name){
        res.status(409).json({
            success: false,
            message: "user did not exist"
        })
    }

    const ispasswordMatch = await bcrypt.compare(password, user.password)
    if(!ispasswordMatch){
        res.status(409).json({
            success: false,
            message: "password not match! try again"
        })
    }

    const accesstoken = jwt.sign({
          id : user._id,
          role: user.role
    },process.env.jwt_secret_key,{
        expiresIn: '1hr'
    })
    res.status(201).json({
        success: true,
        message: "login successfully",
        accesstoken,
        name: user.name,
        role: user.role
    })
   }catch(error){
      console.log(error)
      res.status(409).json({
        error: error.message
      })
   }
})

module.exports = router;