import express, { Request, Response } from 'express';
import { authUser, getUserName } from './utils/jwt.validate';
import { uploadImage } from '../handlers/image/upload.handler';
import { getAllImages } from '../handlers/image/get-all-images.handler';
import fileUpload from 'express-fileupload';
import { getUserImages } from '../handlers/image/get-my-images.handler';
import { getImageByIdHandle } from '../handlers/image/get-image-by-id.handler';
import { updateImageHandle } from '../handlers/image/update-image.handler';

const router = express.Router();

router.get("/get-all", authUser, async (req: Request, res: Response) => {
    const images = await getAllImages();
    res.json(images);
});

router.get("/my-images", authUser, async (req: Request, res: Response) => {
    const username = getUserName(req);
    const images = await getUserImages(username);
    res.json(images);    
});

router.get("/get/:cid", async (req: Request, res: Response) => {
    const cid = req.params.cid;
    const file = await getImageByIdHandle(cid);

    res.setHeader('Content-Type', 'image/jpeg');
    res.send(file);
});

router.post("/upload", authUser, async (req: Request, res: Response) => {
    const file = req.files!.file as fileUpload.UploadedFile;

    const username = getUserName(req);
    await uploadImage(file.data, req.body, username);

    res.status(200).send("Image uploaded successfully");

});

router.post("/update", authUser, async (req: Request, res: Response) => {
    const username = getUserName(req);
    await updateImageHandle(req.body, username);

    res.status(200).send("Image uploaded successfully");

});


export default router;
