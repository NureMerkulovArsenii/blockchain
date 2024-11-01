import express, { Request, Response } from 'express';
import { authUser, getUserName } from './utils/jwt.validate';
import { getUserExchangeRequests } from '../handlers/image/get-exchange-requests.handler';
import { createExchangeRequestHandle } from '../handlers/image/create-exchange.handler';
import { cancelExchangeRequestHandle } from '../handlers/image/cancel-exchange.handler';
import { acceptExchangeRequestHandle } from '../handlers/image/accept-exchange.handler';

const router = express.Router();

router.get("/my", authUser, async (req: Request, res: Response) => {
    const username = getUserName(req);
    const images = await getUserExchangeRequests(username);
    res.json(images);
});

router.post("/create", authUser, async (req: Request, res: Response) => {
    const requestModel = req.body;
    createExchangeRequestHandle(requestModel);
    res.status(200).send("Exchange request created successfully");
});

router.post("/cancel", authUser, async (req: Request, res: Response) => {
    const requestModel = req.body;
    cancelExchangeRequestHandle(requestModel);
    res.status(200).send("Exchange request cancelled successfully");
});

router.post('/accept', authUser, async (req: Request, res: Response) => {
    const requestModel = req.body;
    acceptExchangeRequestHandle(requestModel);
    res.status(200).send("Exchange request accepted successfully");
});

export default router;
