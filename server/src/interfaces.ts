import { Schema } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  surveys: [Schema.Types.ObjectId];
  tokens: number;
  trial: boolean;
}

export interface IResponse {
  value: string;
  date: number;
}

export interface IAnswer {
  title: string;
  responses?: IResponse[];
}

export interface IQuestion {
  type: string;
  title: string;
  isValid: boolean;
  answers?: IAnswer[];
}

export interface ISurvey {
  userId: Schema.Types.ObjectId;
  userEmail: string;
  title: string;
  fixed: boolean;
  creationDate: number;
  questions: IQuestion[];
}
