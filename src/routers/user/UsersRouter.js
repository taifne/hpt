const express =require('express');
const router = express.Router();

const usersController =require( '../../controllers/UserController');
const AuthMiddleware =require('../../middleware/AuthMiddleware')

router.get('/', usersController.getAllUsers);

// Route to get a user by ID
// router.get('/:id', usersController.getUserById);



// Route to create a new user
router.put('/',AuthMiddleware.verifyToken, usersController.updateUser);

module.exports= router;