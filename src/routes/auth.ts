import { Router } from 'express';
import AuthController from '../controller/AuthController';
import { chechToken } from '../middlewares/jwt';

const router = Router();

//login
router.post('/login', AuthController.login);

//Change Passowrd
router.put('/change-password', [chechToken], AuthController.changePassword);
export default router;