import { Router } from 'express';
import UserController from '../controller/UserController';
import { chechToken } from '../middlewares/jwt';
import { chekAdminRole } from '../middlewares/role';

const router = Router();

//Get all Users
router.get('/', [chechToken], UserController.getAll);

//Get user By Id
router.get('/:id', [chechToken], UserController.getById);

//Create User
router.post('/', UserController.newUser);

//Edit User
router.patch('/:id', [chechToken], UserController.editUser);

//Delete User
router.delete('/:id', [chechToken, chekAdminRole], UserController.deleteUser);

export default router;