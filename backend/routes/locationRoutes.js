const express=require('express');
const router=express.Router();
const getRoute=require('../controllers/locationcontrollers').getRoute;
router.post('/getroute',getRoute);  
module.exports=router;