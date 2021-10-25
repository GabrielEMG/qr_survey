import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import UserAPI from "./apis/user.api";
import SurveyAPI from "./apis/survey.api";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/user", UserAPI);
app.use("/survey", SurveyAPI);

const start = async () => {
  await mongoose
    .connect(
      "mongodb+srv://gabriel:gabriel@cluster0.lpg87.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
    )
    .then(() => console.log("database connected"));
  app.listen(4000, () => {
    console.log("server up and running in port 4000");
  });
};

start();
