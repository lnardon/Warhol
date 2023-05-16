import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import sharp from "sharp";
import path from "path";
import multer from "multer";
import fs from "fs";
const Busboy = require("busboy");
const bodyParser = require("body-parser");

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT;
app.use(express.static("../frontend/build"));
app.use(bodyParser());

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
  storage: multer.memoryStorage(),
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
  }, 1000 * 3600); // 3600 seconds || 1 Hour
  res.send(convertedFiles);
});

app.post("/blur", upload, async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const blurAmount = JSON.parse(req.body.blurAmount);
  console.log(blurAmount);
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
  }, 1000 * 3600); // 3600 seconds || 1 Hour
  res.send(convertedFiles);
});

app.post("/flip", upload, async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  let convertedFiles: string[] = [];

  for (let file of files) {
    const filePath = path.join(__dirname, "/uploads/" + file.filename);
    const outputFilePath = path.resolve(__dirname, "converted", file.filename);

    await sharp(filePath).flop().toFile(outputFilePath);

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
  }, 1000 * 3600); // 3600 seconds || 1 Hour
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
  }, 1000 * 3600); // 3600 seconds || 1 Hour
  res.send(convertedFiles);
});

app.post("/upload", upload, async (req, res) => {
  // if (!req.files) {
  //   return res.status(400).send("No file uploaded");
  // }

  // const files = req.files as Express.Multer.File[];
  // const buffer = files[0].buffer;
  // console.log(files, buffer);
  // const transformer = await sharp(buffer).webp();
  // res.setHeader("Content-Type", "image/webp");

  // const readStream = new Stream.PassThrough();
  // readStream.end(buffer);

  // readStream.pipe(transformer).pipe(res);
  const busboy = Busboy({ headers: req.headers });

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const transformer = sharp().webp();
    res.setHeader("Content-Type", "image/webp");

    file.pipe(transformer).pipe(res);
  });

  req.pipe(busboy);
});

app.listen(PORT || 3333, () => {
  console.log(`⚡️[server]: Server is running at port: ${PORT}`);
});
