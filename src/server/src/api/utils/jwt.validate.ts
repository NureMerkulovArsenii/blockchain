import { NextFunction, Request, Response } from "express";
import { verifyJwtToken } from "../../helpers/jwt.helper";


export function authUser(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    console.log(token);
    if (token) {
        const isValid = verifyJwtToken(token);
        if (isValid) {
            next();
        }
        else {
            res.status(401).send("Unauthorized");
        }
    }
    else{
        res.status(401).send("Unauthorized");
    }
}