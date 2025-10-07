import * as jwt from "jsonwebtoken";
import { config } from "dotenv";

config()

import type { Request , Response, NextFunction} from "express"

interface AuthenticatedRequest extends Request{
  user?: string | jwt.JwtPayload | undefined
}


function authenticateToken(req:AuthenticatedRequest , res:Response , next:NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  if (!secret) {
    return res.status(500).json({ message: "Server misconfiguration: missing ACCESS_TOKEN_SECRET" });
  }

  jwt.verify(token, secret , (err, user) => {
    if (err) {
      return res.status(401).json({ message: "invalid Token" })
    }
    req.user = user;
    next();
  })
}

export default authenticateToken;