import express, { Router } from "express";
import DroneListener from "./drone-listener";
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  path: "/api/socket.io",
});

const droneListener = new DroneListener(io);

io.on("connection", (socket) => {
  socket.emit("set-violations", droneListener.violations);
});

const router = Router();

app.use(express.json());

router.get("/violations", (req, res) => {
  res.send(droneListener.violations);
});

app.use("/api", router);

app.use((req, res) => res.status(404).send("Not Found"));

export default httpServer;
