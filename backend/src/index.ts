import express from "express";
import cors from "cors";

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());

app.use(function (req, res, next) {
  console.log("Time:", Date.now());

  console.log("Request URL:", req.originalUrl);
  console.log("Request Type:", req.method);
  console.log("----");
  next();
});

app.get("/v1/hello", async function (req, res) {
  res.send("hello");
});

app.listen(port, () => console.log(`🛰️  Listening on port ${port}`));
