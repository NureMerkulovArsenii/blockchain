import express, { NextFunction, Request, Response } from 'express';
import { authUser } from './utils/jwt.validate';


const router = express.Router();


router.get("/download", authUser, async (req: Request, res: Response) => {

    const token = req.headers.authorization;
    console.log(token);

    res.send("image download");
});



export default router;
