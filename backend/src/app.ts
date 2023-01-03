import express, { Router } from "express";
import DroneListener from "./drone-listener";

const app = express();
const router = Router();

const droneListener = new DroneListener();

app.use(express.json());

router.get("/violations", (req, res) => {
  res.send(droneListener.violations);
});

app.use("/api", router);

app.use((req, res) => res.status(404).send("Not Found"));

export default app;
