import express, { Request, Response } from 'express';

import { login } from "../handlers/auth/login.handler";
import { register } from '../handlers/auth/register.handler';

const router = express.Router();


router.post("/login", async (req: Request, res: Response) => {
    const model = req.body;
    const result = await login(model);
    res.send(result);
});

router.post("/register", async (req: Request, res: Response) => {
    const model = req.body;
    const result = await register(model);
    res.send(result);
});


export default router;
