import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Survey, User } from "../models";

const router = Router();

interface RegisterData {
  password1: string;
  password2: string;
  email: string;
  age: number;
  name: string;
}

router.post("/register", async (req, res) => {
  if (!process.env.TOKEN_PASS) return res.json({ message: "token broken" });
  const data: RegisterData = req.body;
  if (data.password1 !== data.password2)
    return res.json({ message: "las contrasenas no coinciden" });
  const checkEmail = await User.findOne({ email: data.email });
  if (checkEmail)
    return res.json({ message: "el email ya se encuentra registrado" });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password1, salt);
  let user = new User({
    name: data.name,
    password: hashedPassword,
    email: data.email,
    age: data.age,
  });
  await user.save();
  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_PASS);
  return res.json({
    message: "nuevo usuario creado",
    user: user,
    token: token,
  });
});

interface LoginData {
  email: string;
  password: string;
}

router.post("/login", async (req, res) => {
  const data: LoginData = req.body;
  const user = await User.findOne({ email: data.email });
  if (!user) return res.json({ message: "email no encontrado" });
  const passComparison = await bcrypt.compare(data.password, user.password);
  if (!passComparison) return res.json({ message: "contrasena incorrecta" });
  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_PASS || "");
  return res.json({ message: "login exitoso", token: token, user: user });
});

router.post("/check_token", async (req, res) => {
  const token: string | undefined = req.body.token;
  if (typeof token === "undefined" || !token)
    return res.json({ message: "no se ha recibido un token" });
  const tokenVerify = jwt.verify(token, process.env.TOKEN_PASS || "");
  if (typeof tokenVerify === "string")
    return res.json("el formato del token es invalido");
  const user = await User.findById(tokenVerify?.userId);
  if (!user)
    return res.json({
      message: "no se encontro un usuario con el id del token",
    });
  const surveys = await Survey.find({ user: user._id });
  console.log(surveys);
  return res.json({
    message: "el usuario se encuentra logeado",
    user: user,
    surveys: surveys,
  });
});

export default router;
