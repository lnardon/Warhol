import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import sharp from "sharp";
import path from "path";
import multer from "multer";
import fs from "fs";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT;

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, path.join(__dirname, "/uploads/"));
  },
  filename: function (req: any, file: any, cb: any) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

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

app.get("/", async (req: Request, res: Response) => {
  res.json({ howdy: "there partner" });
});

app.post(
  "/optimization/losslessWebp",
  upload,
  async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    let convertedFiles: string[] = [];

    for (let file of files) {
      const filePath = path.join(__dirname, "/uploads/" + file.filename);
      const outputFilePath = path.resolve(
        __dirname,
        "converted",
        file.filename.split(".")[0] + ".webp"
      );

      await sharp(filePath).webp({ lossless: true }).toFile(outputFilePath);

      convertedFiles.push(outputFilePath);
    }

    files.forEach((file, index) => {
      fs.unlinkSync(file.path);
    });
    setTimeout(() => {
      convertedFiles.forEach((file) => {
        fs.unlinkSync(file);
      });
    }, 60000);
    res.send(convertedFiles);
  }
);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at port: ${PORT}`);
});
