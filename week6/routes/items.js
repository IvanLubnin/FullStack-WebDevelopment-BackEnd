//this defines all routes to get to the student data

const express = require('express');

//import controllers

const
{
    createItem,
    updateItem,
    deleteItem,
    getAllItems,
    getItemById,
} = require('../controllers/itemController.js')

const authenticate = require('../middlewares/authenticate.js');
const validateItem = require('../middlewares/validateitem');
const router = express.Router();

//define top level router and pass to controller

router.get('/', authenticate(['admin','regular']), getAllItems); // now authentication is needed even if getting the students (basic fetch)

router.get('/:id', authenticate(['admin','regular']), getItemById);

//we use validator middleware whenever creating or updating students
//these operations also need authentication

router.post('/', authenticate(['admin']), validateItem, createItem);

router.put('/:id', authenticate(['admin']), validateItem, updateItem);

router.delete('/:id', authenticate(['admin']), deleteItem);

// export this controller to server.js

module.exports = router;
