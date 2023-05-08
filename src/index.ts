import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import sharp from "sharp";
import path from "path";
import multer from "multer";
import fs from "fs";

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT;
app.use(express.static("../frontend/build"));

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
  console.log(path.join(__dirname, "..", "/frontend", "/build", "index.html"));
  res.sendFile(path.join(__dirname, "..", "/frontend", "/build", "index.html"));
});

app.post("/losslessWebp", upload, async (req: Request, res: Response) => {
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
  }, 1000 * 3600); // 3600 seconds || 1 Hour
  res.send(convertedFiles);
});

app.post("/greyscale", upload, async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  let convertedFiles: string[] = [];

  for (let file of files) {
    const filePath = path.join(__dirname, "/uploads/" + file.filename);
    const outputFilePath = path.resolve(__dirname, "converted", file.filename);

    await sharp(filePath).grayscale().toFile(outputFilePath);

    convertedFiles.push(outputFilePath);
  }

  files.forEach((file, index) => {
    fs.unlinkSync(file.path);
  });
  setTimeout(() => {
    convertedFiles.forEach((file) => {
      fs.unlinkSync(file);
    });
  }, 1000); // 3600 seconds || 1 Hour
  res.send(convertedFiles);
});

app.post("/blur", upload, async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const blurAmount = JSON.parse(req.body);
  let convertedFiles: string[] = [];

  for (let file of files) {
    const filePath = path.join(__dirname, "/uploads/" + file.filename);
    const outputFilePath = path.resolve(__dirname, "converted", file.filename);

    await sharp(filePath).blur(blurAmount).toFile(outputFilePath);

    convertedFiles.push(outputFilePath);
  }

  files.forEach((file, index) => {
    fs.unlinkSync(file.path);
  });
  setTimeout(() => {
    convertedFiles.forEach((file) => {
      fs.unlinkSync(file);
    });
  }, 1000); // 3600 seconds || 1 Hour
  res.send(convertedFiles);
});

app.post("/flip", upload, async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  let convertedFiles: string[] = [];

  for (let file of files) {
    const filePath = path.join(__dirname, "/uploads/" + file.filename);
    const outputFilePath = path.resolve(__dirname, "converted", file.filename);

    await sharp(filePath).flip().toFile(outputFilePath);

    convertedFiles.push(outputFilePath);
  }

  files.forEach((file, index) => {
    fs.unlinkSync(file.path);
  });
  setTimeout(() => {
    convertedFiles.forEach((file) => {
      fs.unlinkSync(file);
    });
  }, 1000); // 3600 seconds || 1 Hour
  res.send(convertedFiles);
});

app.post("/rotate", upload, async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const degrees = JSON.parse(req.body);
  let convertedFiles: string[] = [];

  for (let file of files) {
    const filePath = path.join(__dirname, "/uploads/" + file.filename);
    const outputFilePath = path.resolve(__dirname, "converted", file.filename);

    await sharp(filePath).rotate(degrees).toFile(outputFilePath);

    convertedFiles.push(outputFilePath);
  }

  files.forEach((file, index) => {
    fs.unlinkSync(file.path);
  });
  setTimeout(() => {
    convertedFiles.forEach((file) => {
      fs.unlinkSync(file);
    });
  }, 1000); // 3600 seconds || 1 Hour
  res.send(convertedFiles);
});

app.post("/resize", upload, async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const { width, height } = JSON.parse(req.body);
  let convertedFiles: string[] = [];

  for (let file of files) {
    const filePath = path.join(__dirname, "/uploads/" + file.filename);
    const outputFilePath = path.resolve(__dirname, "converted", file.filename);

    await sharp(filePath).resize({ width, height }).toFile(outputFilePath);

    convertedFiles.push(outputFilePath);
  }

  files.forEach((file, index) => {
    fs.unlinkSync(file.path);
  });
  setTimeout(() => {
    convertedFiles.forEach((file) => {
      fs.unlinkSync(file);
    });
  }, 1000); // 3600 seconds || 1 Hour
  res.send(convertedFiles);
});

app.listen(PORT || 3333, () => {
  console.log(`⚡️[server]: Server is running at port: ${PORT}`);
});
