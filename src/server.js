import express from "express";
import cors from "cors"
import setupEnv from "./utils/setupEnv.js";
import { connect } from "./config/db.js";
import usersRouter from "./routes/user.js";
import postsRouter from "./routes/post.js";
import commentsRouter from "./routes/comment.js";

const app = express();

app.use(cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({limit: "50mb"}))

await setupEnv();

await connect();

// API
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/comments", commentsRouter);


app.use((err,req,res,next) => {
    if(err){
        console.log(err.stack);
        return res.status(400).send({
            message: err.message,
            successful: false
        })
    }
})

app.listen(8081, () => {
    console.log("Server is listening on port 8081")
})