import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import sharp from "sharp";
import path from "path";
import multer from "multer";
import fs from "fs";

dotenv.config();
// Define multer storage for the images.
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "uploads/");
  },
  filename: function (req: any, file: any, cb: any) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Set up multer for image uploads.
const upload = multer({
  storage: storage,
  fileFilter: function (req: any, file: any, cb: any) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      return cb(null, true);
    }
    cb(
      "Error: File upload only supports the following filetypes - " + filetypes
    );
  },
}).array("images");

const app: Express = express();
const port = process.env.PORT;

app.get("/", async (req: Request, res: Response) => {
  res.json({ howdy: "there partner" });
});

// app.post("/optimization/losslessWebp", async (req: Request, res: Response) => {
//   const data = await sharp(path.resolve(__dirname, "test.jpg"))
//     .webp({ lossless: true })
//     .toFile(__dirname + "converted.webp");
//   res.setHeader("Content-Type", "image/webp");
//   res.sendFile(__dirname + "converted.webp");
// });

app.post(
  "/optimization/losslessWebp",
  upload,
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    let convertedFiles = [];

    for (let file of files) {
      const filePath = path.resolve(__dirname, file.path);
      const outputFilePath = path.resolve(
        __dirname,
        "converted",
        file.filename.split(".")[0] + ".webp"
      );

      await sharp(filePath).webp({ lossless: true }).toFile(outputFilePath);

      convertedFiles.push(outputFilePath);
    }
    res.download(convertedFiles[0]);
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
