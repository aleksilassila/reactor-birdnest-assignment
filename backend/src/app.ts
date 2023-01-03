import express, {Router} from "express";

const app = express();
const router = Router();

app.use(express.json());

router.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

app.use((req, res) => res.status(404).send("Not Found"));

export default app;
