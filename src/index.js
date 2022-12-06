import express from "express";
import bodyParser from "body-parser";
import "dotenv/config"
import mainRouter from "./routes/mainRouter.js";
import errorHandler from "./errors/errorHandler.js"
import ApiError from "./errors/apiError.js";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.listen(8888, () => console.log("Server is running"));

app.use(mainRouter);

app.use((req, res, next) => {
    next(new ApiError(404, "Not found."))
});

app.use(errorHandler);