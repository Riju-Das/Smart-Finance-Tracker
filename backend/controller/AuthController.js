const db = require("../db/AuthQueries")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

function generateAccessToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, fullname: user.fullname, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "300m" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, fullname: user.fullname, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}

async function register(req, res) {
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

async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await db.findUserByUsername(username);
    if (!user) return res.status(401).json({ message: "user does not exist" })

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "incorrect password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await db.saveRefreshToken(user.id, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    })
    res.json({ accessToken });
  }
  catch (err) {
    return res.status(500).json({ message: "internal server error" })
  }
}

async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(403).json({ message: "No refresh token" });

    const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return null;
      return decoded;
    })
    if (!userData) return res.status(403).json({ message: "invalid refresh token" });
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

async function logout(req, res) {
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

module.exports = {
  register,
  login,
  refresh,
  logout
}