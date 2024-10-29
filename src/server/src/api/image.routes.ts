import express, { NextFunction, Request, Response } from 'express';
import { authUser, getUserName } from './utils/jwt.validate';
import { uploadImage } from '../handlers/image/upload.handler';
import { getAllImages } from '../handlers/image/get-all-images.handler';
import fileUpload from 'express-fileupload';


const router = express.Router();


router.get("/get-all", authUser, async (req: Request, res: Response) => {
    const images = await getAllImages();
    res.json(images);
});

router.post("/upload", authUser, async (req: Request, res: Response) => {

    // if (req.files!.file) {
    //     return res.status(400).send("No file uploaded");
    // }


    //file as base64 string
    const file = req.files!.file as fileUpload.UploadedFile;
    console.log(file.data);

    const username = getUserName(req);
    console.log(username);

    //const file = req.files.file as fileUpload.UploadedFile;
    await uploadImage(file.data, req.body, username);

    res.status(200).send("Image uploaded successfully");

});




export default router;
