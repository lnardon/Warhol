import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import sharp from "sharp";
import path from "path";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", async (req: Request, res: Response) => {
  const data = await sharp(path.resolve(__dirname, "test.jpg"))
    .webp({ lossless: true })
    .toFile("converted.webp");
  res.send(data);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
