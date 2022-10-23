import express from "express";
import cors from "cors";
const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/connection", (req, res, next) => {
    console.log(req.body);
    res.json({ msg: "Connected successfully" });
});

app.listen(PORT, () => {
    console.log("server started");
});
