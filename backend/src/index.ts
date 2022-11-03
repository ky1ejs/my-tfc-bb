import express from "express";
import cors from "cors";
import Auth from "./services/auth";

const port = process.env.PORT || 3000;
const app = express();
app.use(cors({ credentials: true, exposedHeaders: ["set-cookie"] }));
app.use(express.json());

app.use(function (req, res, next) {
  console.log("Time:", Date.now());

  console.log("Request URL:", req.originalUrl);
  console.log("Request Type:", req.method);
  console.log("----");
  next();
});

app.post("/my-tfc/v1/login", async (req, res) => {
  return new Auth()
    .auth(req.body.username, req.body.password, req.body.device_id)
    .then((device) => res.send({ new_device: { id: device.id } }));
});

app.listen(port, () => console.log(`🛰️  Listening on port ${port}`));
