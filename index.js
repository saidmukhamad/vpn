import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { countConnections, newConnection } from "./generator/reader.js";

dotenv.config();

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

// check connection
app.use((req, res, next) => {
    if (req.query.key !== process.env.KEY) {
        res.json({ msg: "Connection restricted", success: false });
    } else {
        next();
    }
});

app.get("/new-connection", (req, res, next) => {
    console.log(req.body);
    let newConnection_ = newConnection();

    res.json(
        JSON.stringify({
            msg: "Connected successfully",
            data: newConnection_,
            config: `
        [Interface]
        PrivateKey = ${newConnection_.public}
        Address = ${newConnection_.ip}
        DNS = 8.8.8.8
    
        [Peer]
        PublicKey = VkQV2uUuJv15bUb05odOAFlfV2CLtpU3Og0Km2vXhi8=
        Endpoint = 87.249.50.251:51830
        AllowedIPs = 0.0.0.0/0
        PersistentKeepalive = 20`,
        })
    );
});

app.get("/info", async (req, res, next) => {
    let data = await countConnections();
    console.log(data);
    res.json({ free: data, status: true });
});

app.get("/file", async (req, res, next) => {
    let id = req.query.id;

    if (id) {
        res.download(`${process.cwd()}/generator/data/data.json`);
    } else {
        res.json({ success: false });
    }
});

app.listen(PORT, () => {
    console.log("server started");
});
