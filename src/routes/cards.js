import { Router } from "express";
import fs from "fs";

const router = Router();

export const dataPath = process.cwd() + "/cards.json";

router.get("/", (req, res) => {
  // console.log(dataPath);
  // res.send().status(200).end();
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      throw err;
    }
    res.send(JSON.parse(data));
  });
});

export default router;
