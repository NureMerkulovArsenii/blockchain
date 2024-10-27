import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import auth from "./api/auth.routes";
import image from "./api/image.routes";
import cors from "cors";
import { buildClient } from "./clients/smart-contract-client/smart-contract.client";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

buildClient().then(() => {
  console.log("Smart contract client built");
});


const requestLogger = function (req: Request, res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} body: ${JSON.stringify(req.body)}`);
  next()
}

app.use(cors())

app.use(bodyParser.json());

app.use(requestLogger)

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


app.use("/auth", auth);
app.use("/image", image);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});