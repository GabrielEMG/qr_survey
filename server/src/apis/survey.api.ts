import { Survey, User } from "../models";
import { Router } from "express";

const router = Router();

router.post("/create_survey", async (req, res) => {
  try {
    const data = req.body.survey;
    const user = await User.findById(data.userId);
    if (!user) return res.json({ message: "User not found" });
    const newData = { ...data, userId: user._id };
    const survey = await Survey.create(newData);
    if (user?.surveys) {
      user.surveys.push(survey._id);
    } else {
      user.surveys = [survey._id];
    }
    await user.save();
    return res.json({ message: "Survey created successfully", survey });
  } catch ({ message }) {
    console.log(message);
    return res.json({ message: message });
  }
});

router.post("/remove_survey", async (req, res) => {
  const surveyId = req.body;
  if (!surveyId) return res.json({ message: "no se entrego un id" });
  const surveyFound = await Survey.findById(surveyId);
  if (!surveyFound) return res.json({ message: "no se encontro una encuesta" });
  await surveyFound.delete();
  return res.json({ message: "encuesta eliminada" });
});

router.get("/survey/:id", async (req, res) => {
  const surveyId = req.params?.id;
  if (!surveyId) return res.json({ message: "no se encontro un id" });
  const survey = await Survey.findById(surveyId);
  if (!survey) return res.json({ message: "no existe esta encuesta" });
  return res.json({ survey, message: "encuesta encontrada!" });
});

export default router;
