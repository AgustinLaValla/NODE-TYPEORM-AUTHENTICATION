import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { User } from "../entity/User";
import { validate } from 'class-validator';
import { generateJWT }   from '../middlewares/jwt';


export class UserController {

    static getAll = async (req: Request, res: Response) => {
        const userRepository = getRepository(User);
        try {
            const users = await userRepository.find();
            return res.json({ ok: true, users });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ ok: false, message: 'internal Server Error' });
        }
    };

    static getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOne({ where: { id } });
            if (!user) return res.status(404).json({ ok: false, message: 'User not found' });
            return res.json({ ok: true, user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ ok: false, message: 'internal Server Error' });
        }
    }

    static newUser = async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        const userRepository = getRepository(User);
        try {
            //Check if user already exists
            const user = await userRepository.findOne({ where: { email } });
            if (user) return res.status(400).json({ ok: false, message: 'User Already exists' });

            //Create user
            const newUser = await userRepository.create({ username, email, password });

            //Validate fields
            const errors = await validate(newUser);

            if (errors.length > 0) {
                return res.status(400).json({ ok: false, errors });
            }

            //Encrypt password
            newUser.hashPassword();
            userRepository.save(newUser);

            //Token Body
            const body = {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            };

            //Generate token
            const token = await generateJWT(newUser);

            return res.json({ ok: true, message: 'User Successfully  created', token });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ ok: false, message: 'internal Server Error' });
        }
    }

    static editUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { username, role } = req.body
        const userRepository = getRepository(User);

        try {
            const user = await userRepository.findOne({ where: { id } });
            if (!user) return res.status(400).json({ ok: false, message: 'User not found' });

            user.username = username;
            user.role = role

            await userRepository.save(user);

            return res.status(201).json({ ok: true, message: 'User successfully updated' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ ok: false, message: 'internal Server Error' });
        }
    }

    static deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);

        try {
            await userRepository.delete({ id: parseInt(id) });
            return res.json({ ok: true, message: 'User successfully deleted' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ ok: false, message: 'Internal server Error' });
        }
    }

}

export default UserController;