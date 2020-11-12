import { NextFunction, Request, Response } from "express";
export const chekAdminRole = async (req: Request, res: Response, next: NextFunction) => {
    const { role } = res.locals.user;

    if(role !== 'ADMIN') {
        return res.status(400).json({ok: false, message: 'Not Authorized'});
    };

    next()
};

