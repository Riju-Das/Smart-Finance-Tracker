import * as db from "../db/AuthQueries"
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken"
import { config  } from "dotenv";
import type { Request, Response } from "express";

config()

interface User{
  id: string;
  username: string;
  fullname: string;
  email: string;
  password?: string;
  refreshTokens?: string[]
}

interface AuthenticatedRequest extends Request {
  user?:  jwt.JwtPayload | undefined;
}

function generateAccessToken(user:User) {
  return jwt.sign(
    { id: user.id, username: user.username, fullname: user.fullname, email: user.email },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "300m" }
  );
}

function generateRefreshToken(user:User) {
  return jwt.sign(
    { id: user.id, username: user.username, fullname: user.fullname, email: user.email },
    process.env.REFRESH_TOKEN_SECRET as string ,
    { expiresIn: "7d" }
  );
}

async function register(req:Request, res:Response) {
  try {

    const { username, fullname, email, password } = req.body;

    const existing = await db.findUserByUsername(username);

    if (existing) return res.status(400).json({ message: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.createUser(username, fullname, email, hashedPassword)

    res.json({ message: "user registered", user: { id: user.id, username: user.username, fullname: user.fullname } });
  }
  catch (err) {
    return res.status(500).json({ message: "internal server error" })
  }
}

async function login(req:Request, res:Response) {
  try {
    const { username, password } = req.body;
    const user = await db.findUserByUsername(username);
    if (!user) return res.status(401).json({ message: "username does not exist" })

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "incorrect password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await db.saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    res.json({ accessToken });
  }
  catch (err) {
    return res.status(500).json({ message: "internal server error" })
  }
}

async function refresh(req:Request , res:Response) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(403).json({ message: "No refresh token" });
    let userData:any;
    
    try{
      userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string)
    }
    catch(err){
      return res.status(403).json({ message: "invalid refresh token" });
    }
    const user = await db.findUserByUsername(userData.username);
    if (!user || !user.refreshTokens.includes(token)) {
      return res.status(403).json({ message: "Refresh token revoked" });
    }
    const newAccessToken = generateAccessToken(user)
    res.json({ accessToken: newAccessToken });

  }
  catch (err) {
    console.error("Refresh error:", err);
    return res.status(403).json({ message: "Invalid or expired refresh token" });
  }
}

async function logout(req:Request, res:Response) {
  try {
    const token = req.cookies.refreshToken;
    res.clearCookie("refreshToken");

    if (!token) return res.json({ message: "Logged out" });

    const user = await db.findUserByRefreshToken(token);
    if (user) await db.removeRefreshToken(user.id, token);

    res.json({ message: "Logged out" });

  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function userDetail(req:AuthenticatedRequest,res:Response) {
  const user = req.user;
  if(!user){
    return res.status(401).json({message:"Auth error"})
  }
  const { id, username, fullname, email } = user;
  return res.status(200).json({id , username , fullname , email})
}

export { register, login, refresh, logout, userDetail };