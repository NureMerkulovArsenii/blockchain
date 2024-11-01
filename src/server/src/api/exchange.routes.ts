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
    try {

        const requestModel = req.body;
        createExchangeRequestHandle(requestModel);
        res.status(200).json({ message: "Exchange request created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating exchange request" });
    }
});

router.post("/cancel", authUser, async (req: Request, res: Response) => {
    try {
        const requestModel = req.body;
        cancelExchangeRequestHandle(requestModel);
        res.status(200).json({ message: "Exchange request cancelled successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error cancelling exchange request" });
    }
});

router.post('/accept', authUser, async (req: Request, res: Response) => {
    try {
        const requestModel = req.body;
        acceptExchangeRequestHandle(requestModel);
        res.status(200).json({ message: "Exchange request accepted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error accepting exchange request" });
    }
});

export default router;
