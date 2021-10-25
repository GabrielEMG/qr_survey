import { Schema, model } from "mongoose";
import { IUser, ISurvey } from "./interfaces";

const userSchema = new Schema<IUser>({
  name: String,
  email: String,
  password: String,
  surveys: [{ type: Schema.Types.ObjectId, ref: "Surveys" }],
  tokens: Number,
  trial: Boolean,
});

export const User = model<IUser>("User", userSchema);

const surveySchema = new Schema<ISurvey>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  userEmail: String,
  title: String,
  fixed: Boolean,
  creationDate: Number,
  questions: [
    {
      type: { type: String },
      title: String,
      isValid: Boolean,
      answers: [
        {
          title: String,
          responses: [
            {
              value: String,
              date: { type: Number },
            },
          ],
        },
      ],
    },
  ],
});

export const Survey = model<ISurvey>("Survey", surveySchema);
