
const FilmModel = require('../models/film');
const asyncMiddleware = require('../utils/asyncMiddleware');
const status = require('../utils/statusCodes');
const passwordUtils = require('../utils/passwordHash');
const jwt = require('../utils/jwt');


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const multer = require('multer');

cloudinary.config({
    cloud_name: 'dxtpcpwwf',
    api_key: '679544638251481',
    api_secret: '-wlVUN0JRZfaNDAZHW6dZMiOYRM'
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        resource_type: 'auto',
        folder: 'Asan-Dukaan',
        format: async (req, file) => file.originalname.substr(file.originalname.lastIndexOf('.') + 1), // supports promises as well
        public_id: (req, file) => Date.now().toString()
    },
});

const express = require('express');
const router = express.Router();

const parser = multer({
    storage: storage
});
const filmActions = {
    createFilm: asyncMiddleware(async (req, res) => {
        let data =req.body.data ? JSON.parse(req.body.data):''
        console.log("file",req.file)
        if(data && req.file){
            req.body={
                ...data,
                Photo:req.file.path
            }
         let film = new FilmModel({...req.body});
         newFilm =await film.save();
        console.log(newFilm)
           if(newFilm){
            res.status(200).json({
                message: 'Film data saved successfully',
                data: newFilm,
                
            });
            
        }
        else{
            res.status(400).json({
                message: 'Something went wrong',
                
            });
        }
            
        }
        else{
            res.status(400).json({
                message: 'Data not in correct format',
            });
        }
        
       
    }),
    getFilm: asyncMiddleware(async (req, res) => {

        if(req.params.id){
            let { id }=req.params;
            let film = await FilmModel.findById(id);
            if(film){
                res.status(200).json({
                    message: 'Film fetched successfully',
                    data: film
                });
                
            }
            else{
                res.status(400).json({
                    message: 'Something went wrong'
                });
            }
        }
        else{
            let film = await FilmModel.find({});
            res.status(200).json({
                message: 'All Films fetched successfully',
                data: film
            });
        }
     
    }),
    updateFilm: asyncMiddleware(async (req, res) => {
        let { id }=req.params;
        let data =req.body.data ? JSON.parse(req.body.data):''
        console.log("file",req.file)
        if(id && (data || req.file) ){  
            if(req.file){
                req.body={
                    ...data,
                    Photo:req.file.path
                }
            }
            else{
                req.body={
                    ...data
                }
            }
          let film = await FilmModel.findByIdAndUpdate(id,{...req.body},);
            if(film){
                res.status(200).json({
                    message: 'Film updated successfully',
                    data: film
                }); 
            }
            else{
                res.status(400).json({
                    message: 'Something went wrong'
                });
            }
        }
        else{
            let film = await FilmModel.find({});
            res.status(400).json({
                message: 'Necessary details are missing such as id or data'
            });
        }
     
    }),
    
    

};
router.post('/',parser.single("file"), filmActions.createFilm)
router.get('/:id', filmActions.getFilm)
router.patch('/:id',parser.single("file"), filmActions.updateFilm)
// User

module.exports = router;