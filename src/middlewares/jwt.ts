import { NextFunction, Request, Response } from "express";
import { sign, verify } from 'jsonwebtoken';
import { User } from "../entity/User";
import { config } from '../config/config';

export async function generateJWT(user: User) {
    const tokenBody = { username: user.username, email: user.email, role: user.role, id: user.id };
    return await sign(tokenBody, config.SEED, { expiresIn: '4h' });
}

export async function chechToken(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) return res.status(400).json({ ok: false, message: 'No Token Provided' });

    const token = req.get('Authorization').split(' ')[1];

    try {
        const { email, password, id, role } = <any>verify(token, config.SEED);
        res.locals.user = { email, password, id, role };

        const newToken = await generateJWT(res.locals.user);

        res.setHeader('authorization', `Bearer ${newToken}`);

    } catch (error) {
        console.log(error);
        if (error.expiredAt < new Date())
            return res.status(400).json({
                ok: false,
                message: 'Token has expired. Please, login again',
                token: null
            });
        return res.status(500).json({ ok: false, mensaje: 'Internal server eror' });
    }


    next();
}