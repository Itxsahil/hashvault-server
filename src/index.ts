const express = require("express");
const cors = require("cors");
const redis = require("ioredis");
require("dotenv").config();


const app = express();

app.use(cors(
    {
        origin: `${process.env.CLIENT_ORIGIN}` ||"http://localhost:5173",
        credentials: true,
    }
));

app.use(express.json());


const redisClient = new redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null
});

app.get("/", (req: any, res: any) => {
    res.send("Hello World!");
});


app.post("/note", async (req: any, res: any) => {
    const {key, note} = req.body;
    await redisClient.set(key, note);
    res.status(200).json(
        {
            status: "success",
            message: "Note added successfully"
        }
    )
});

app.get("/note/:key", async (req: any, res: any) => {
    console.log(req.params);
    const {key} = req.params;
    const hashednote = await redisClient.get(key);
    if(hashednote) {
        res.status(200).json(
            {
                note: hashednote,
                status: "success",
                message: "Note found successfully"
            }
        );
    } else {
        res.status(404).json(
            {
                status: "error",
                message: "Note not found"
            }
        );
    }
    
});


app.put('/note', async (req: any, res: any) => {
    const {key, note} = req.body;
    await redisClient.set(key, note);
    res.status(200).json(
        {
            status: "success",
            message: "Note updated successfully"
        }
    )
})


app.delete('/note/:key', async (req: any, res: any) => {
    const {key} = req.params;
    await redisClient.del(key);
    res.status(200).json(
        {
            status: "success",
            message: "Note deleted successfully"
        }
    )
})



app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on http://localhost:3000");
});